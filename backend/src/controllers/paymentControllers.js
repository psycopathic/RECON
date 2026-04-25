import Coupon from "../models/couponModel.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";
import { stripe } from "../lib/stripe.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode, addressId } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid or empty products array" });
    }
    if (!addressId) {
      return res.status(400).json({ error: "Please select a shipping address" });
    }

    const user = await User.findById(req.user._id);
    const selectedAddress = user.addresses.id(addressId);
    if (!selectedAddress) {
      return res.status(404).json({ error: "Address not found" });
    }

    let totalAmount = 0;

    const lineItems = products.map((product) => {
      const amount = Math.round(product.price * 100);
      totalAmount += amount * (product.quantity || 1);

      const productData = {
        name: (product.name || "Product").substring(0, 250),
      };

      return {
        price_data: {
          currency: "inr",
          product_data: productData,
          unit_amount: amount,
        },
        quantity: product.quantity || 1,
      };
    });
    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      });
      if (coupon) {
        totalAmount -= Math.round(
          (totalAmount * coupon.discountPercentage) / 100
        );
      }
    }
    //session creation
    let discounts = [];
    if (coupon) {
      try {
        const stripeCouponId = await createStripeCoupon(coupon.discountPercentage);
        discounts = [{ coupon: stripeCouponId }];
      } catch (couponErr) {
        console.error("Failed to create Stripe coupon, proceeding without:", couponErr.message);
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      discounts,
      metadata: {
        userId: req.user._id.toString(),
        couponCode: couponCode || "",
        products: JSON.stringify(
          products.map((p) => ({
            id: p._id,
            quantity: p.quantity,
            price: p.price,
          }))
        ),
        shippingAddress: JSON.stringify({
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipCode: selectedAddress.zipCode,
          country: selectedAddress.country,
        }),
      },
    });
    if (totalAmount >= 20000) {
      await createNewCoupon(req.user._id);
    }
    res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
  } catch (error) {
    console.error("Error processing checkout:", error);
    res
      .status(500)
      .json({ message: "Error processing checkout", error: error.message });
  }
};

export const checkoutSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    // ✅ Check if order with this session already exists
    const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
    if (existingOrder) {
      return res.status(200).json({
        success: true,
        message: "Order already exists.",
        orderId: existingOrder._id,
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      // ✅ Deactivate coupon if used
      if (session.metadata.couponCode) {
        await Coupon.findOneAndUpdate(
          {
            code: session.metadata.couponCode,
            userId: session.metadata.userId,
          },
          {
            isActive: false,
          }
        );
      }

      // ✅ Parse products
      const products = JSON.parse(session.metadata.products);
      const shippingAddress = session.metadata.shippingAddress
        ? JSON.parse(session.metadata.shippingAddress)
        : null;

      const newOrder = new Order({
        user: session.metadata.userId,
        products: products.map((product) => ({
          product: product.id,
          quantity: product.quantity,
          price: product.price,
        })),
        totalAmount: session.amount_total / 100,
        stripeSessionId: sessionId,
        shippingAddress: shippingAddress,
      });

      await newOrder.save();

      const buyer = await User.findById(session.metadata.userId);
      const vendorNotificationsMap = new Map();

      for (const item of products) {
        const productDoc = await Product.findById(item.id);
        if (productDoc && productDoc.createdBy) {
          const vendorId = productDoc.createdBy.toString();
          if (!vendorNotificationsMap.has(vendorId)) {
            vendorNotificationsMap.set(vendorId, []);
          }
          vendorNotificationsMap.get(vendorId).push({
            product: item.id,
            productName: productDoc.name,
            quantity: item.quantity,
            price: item.price,
          });
        }
      }

      for (const [vendorId, items] of vendorNotificationsMap) {
        for (const item of items) {
          await Notification.create({
            vendor: vendorId,
            order: newOrder._id,
            product: item.product,
            buyerName: buyer ? buyer.name : "Unknown",
            message: `${buyer ? buyer.name : "A customer"} ordered ${item.productName} (x${item.quantity}) for ₹${item.price * item.quantity}`,
            isRead: false,
          });
        }
      }

      return res.status(200).json({
        success: true,
        message:
          "Payment successful, order created, and coupon deactivated if used.",
        orderId: newOrder._id,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Session is not marked as paid.",
      });
    }
  } catch (error) {
    console.error("Error processing successful checkout:", error);
    res.status(500).json({
      message: "Error processing successful checkout",
      error: error.message,
    });
  }
};

async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });

  return coupon.id;
}

async function createNewCoupon(userId) {
  await Coupon.findOneAndDelete({ userId });

  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    userId: userId,
  });

  await newCoupon.save();

  return newCoupon;
}
