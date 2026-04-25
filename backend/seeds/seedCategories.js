import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Product from '../src/models/productModel.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecom';

const categories = {
  jeans: {
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
    products: [
      { name: 'Classic Blue Jeans', price: 1499, description: 'Everyday denim with a straight fit and soft stretch comfort.' },
      { name: 'Vintage Wash Jeans', price: 1799, description: 'Relaxed-fit jeans with a faded wash for casual styling.' },
      { name: 'Slim Fit Black Jeans', price: 1599, description: 'Sleek black denim with a slim silhouette for versatile wear.' },
      { name: 'Skinny Ripped Jeans', price: 1899, description: 'Trendy skinny jeans with distressed knee detailing.' },
      { name: 'Bootcut Denim Jeans', price: 1399, description: 'Classic bootcut fit with a comfortable mid-rise waist.' },
      { name: 'High Rise Mom Jeans', price: 1699, description: 'Retro-inspired high waist jeans with a relaxed leg.' },
      { name: 'Relaxed Fit Cargo Jeans', price: 1999, description: 'Utility-style cargo jeans with multiple pockets.' },
      { name: 'Grey Wash Straight Jeans', price: 1549, description: 'Modern grey denim with a straight leg cut.' },
      { name: 'White Slim Jeans', price: 1849, description: 'Crisp white denim perfect for summer outfits.' },
      { name: 'Dark Indigo Regular Jeans', price: 1299, description: 'Deep indigo wash in a classic regular fit.' },
    ],
  },
  't-shirts': {
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    products: [
      { name: 'Organic Cotton Tee', price: 699, description: 'Soft staple t-shirt made for daily wear and easy layering.' },
      { name: 'Oversized Graphic Tee', price: 899, description: 'Roomy t-shirt with a bold front print and dropped shoulders.' },
      { name: 'Crew Neck Plain Tee', price: 499, description: 'Essential crew neck t-shirt in solid colours.' },
      { name: 'V-Neck Premium Tee', price: 799, description: 'Premium cotton v-neck tee with a soft hand feel.' },
      { name: 'Striped Henley Tee', price: 949, description: 'Casual henley with button placket and striped pattern.' },
      { name: 'Polo Collar T-Shirt', price: 1099, description: 'Classic polo with a ribbed collar and tailored fit.' },
      { name: 'Muscle Fit Tank Top', price: 599, description: 'Athletic tank top with a muscle-hugging fit.' },
      { name: 'Long Line Tee', price: 849, description: 'Extended length t-shirt with a modern silhouette.' },
      { name: 'Pocket Tee Washed', price: 749, description: 'Washed look tee with a chest pocket detail.' },
      { name: 'Round Neck Printed Tee', price: 649, description: 'Eye-catching printed tee for everyday street style.' },
    ],
  },
  shoes: {
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    products: [
      { name: 'Street Runner Sneakers', price: 2499, description: 'Lightweight sneakers with cushioned support for all-day use.' },
      { name: 'Minimal Leather Trainers', price: 3299, description: 'Clean low-top trainers with a sleek leather upper.' },
      { name: 'Canvas Low-Top Sneakers', price: 1799, description: 'Casual canvas sneakers with rubber sole and lace-up front.' },
      { name: 'Running Performance Shoes', price: 3999, description: 'High-performance running shoes with breathable mesh.' },
      { name: 'Classic White Sneakers', price: 2799, description: 'Timeless white sneakers that go with everything.' },
      { name: 'Chunky Platform Sneakers', price: 2999, description: 'Bold chunky sneakers with elevated platform sole.' },
      { name: 'Slip-On Casual Shoes', price: 1999, description: 'Easy slip-on design for quick and comfortable wear.' },
      { name: 'Suede Desert Boots', price: 3499, description: 'Elegant suede boots with a crepe rubber sole.' },
      { name: 'High-Top Basketball Shoes', price: 4499, description: 'Supportive high-tops designed for the basketball court.' },
      { name: 'Eco-Friendly Recycled Sneakers', price: 3199, description: 'Sustainable sneakers made from recycled materials.' },
    ],
  },
  glasses: {
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
    products: [
      { name: 'Round Frame Glasses', price: 1299, description: 'Slim round frames that add a modern touch to any outfit.' },
      { name: 'Clear Lens Square Frames', price: 1499, description: 'Square glasses with lightweight frames and everyday comfort.' },
      { name: 'Aviator Sunglasses', price: 1999, description: 'Classic aviator style with UV400 protection lenses.' },
      { name: 'Cat Eye Frames', price: 1699, description: 'Retro-inspired cat eye glasses with bold acetate frames.' },
      { name: 'Rimless Titanium Glasses', price: 2499, description: 'Ultra-light rimless frames with flexible titanium arms.' },
      { name: 'Wayfarer Sunglasses', price: 1899, description: 'Iconic wayfarer shape with polarized lenses.' },
      { name: 'Blue Light Blocking Glasses', price: 1199, description: 'Computer glasses that reduce eye strain from screens.' },
      { name: 'Oversized Square Sunglasses', price: 1599, description: 'Statement oversized shades with gradient tint lenses.' },
      { name: 'Sport Wraparound Sunglasses', price: 2199, description: 'Secure wraparound design perfect for outdoor activities.' },
      { name: 'Tortoiseshell Reading Glasses', price: 899, description: 'Classic tortoiseshell pattern with lightweight construction.' },
    ],
  },
  jackets: {
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
    products: [
      { name: 'Utility Field Jacket', price: 2899, description: 'Structured jacket with roomy pockets and a clean finish.' },
      { name: 'Quilted Puffer Jacket', price: 3499, description: 'Warm puffer jacket built for cooler weather and layered looks.' },
      { name: 'Denim Trucker Jacket', price: 2499, description: 'Classic denim jacket with button front and chest pockets.' },
      { name: 'Leather Biker Jacket', price: 5999, description: 'Edgy genuine leather jacket with asymmetric zip.' },
      { name: 'Bomber Jacket', price: 3199, description: 'Casual bomber with ribbed cuffs and waistband.' },
      { name: 'Windbreaker Jacket', price: 1999, description: 'Lightweight wind-resistant jacket for outdoor activities.' },
      { name: 'Corduroy Sherpa Jacket', price: 3799, description: 'Soft corduroy exterior with cozy sherpa lining.' },
      { name: 'Rainproof Shell Jacket', price: 2799, description: 'Waterproof shell with sealed seams and adjustable hood.' },
      { name: 'Fleece Zip-Up Jacket', price: 2299, description: 'Warm fleece jacket ideal for layering in winter.' },
      { name: 'Blazer Casual Jacket', price: 4499, description: 'Smart-casual blazer that transitions from office to evening.' },
    ],
  },
  suits: {
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop',
    products: [
      { name: 'Tailored Two-Piece Suit', price: 7999, description: 'Sharp modern suit designed for formal events and office wear.' },
      { name: 'Slim Fit Blazer Set', price: 6499, description: 'Streamlined suit set with a lightweight, breathable finish.' },
      { name: 'Classic Black Suit', price: 8999, description: 'Timeless black suit perfect for any formal occasion.' },
      { name: 'Navy Blue Business Suit', price: 7499, description: 'Professional navy suit with a modern tailored fit.' },
      { name: 'Double Breasted Suit', price: 9499, description: 'Bold double-breasted design with peak lapels.' },
      { name: 'Charcoal Grey Suit', price: 7999, description: 'Versatile grey suit that works for any dress code.' },
      { name: 'Linen Summer Suit', price: 5999, description: 'Breathable linen suit designed for warm weather events.' },
      { name: 'Tuxedo Dinner Suit', price: 10999, description: 'Elegant tuxedo with satin lapels for black-tie events.' },
      { name: 'Three-Piece Waistcoat Suit', price: 9999, description: 'Complete three-piece suit with matching waistcoat.' },
      { name: 'Checked Pattern Suit', price: 8499, description: 'Contemporary checked pattern for a stylish statement.' },
    ],
  },
  bags: {
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    products: [
      { name: 'Canvas Weekender Bag', price: 1999, description: 'Spacious travel bag with durable canvas construction.' },
      { name: 'Compact Crossbody Bag', price: 1299, description: 'Compact daily bag with adjustable strap and quick-access pockets.' },
      { name: 'Leather Laptop Bag', price: 3499, description: 'Professional bag with padded laptop compartment and organizer pockets.' },
      { name: 'Backpack Daypack', price: 1799, description: 'Lightweight everyday backpack with multiple compartments.' },
      { name: 'Messenger Shoulder Bag', price: 2299, description: 'Classic messenger style with flap closure and adjustable strap.' },
      { name: 'Duffle Gym Bag', price: 1599, description: 'Spacious duffle with shoe compartment and wet pocket.' },
      { name: 'Mini Sling Bag', price: 899, description: 'Compact sling bag perfect for essentials on the go.' },
      { name: 'Roll-Top Backpack', price: 2499, description: 'Water-resistant roll-top design with modern aesthetics.' },
      { name: 'Tote Shopping Bag', price: 1199, description: 'Eco-friendly tote bag with reinforced handles and inner pocket.' },
      { name: 'Travel Organiser Pouch Set', price: 749, description: 'Set of packing cubes and pouches for organised travel.' },
    ],
  },
  watches: {
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop',
    products: [
      { name: 'Chronograph Steel Watch', price: 4499, description: 'Statement watch with a stainless steel band and precise movement.' },
      { name: 'Minimal Mesh Watch', price: 3499, description: 'Clean dial watch with a slim mesh strap and understated styling.' },
      { name: 'Digital Sport Watch', price: 1999, description: 'Feature-packed digital watch with stopwatch and alarm functions.' },
      { name: 'Leather Strap Dress Watch', price: 3999, description: 'Elegant dress watch with genuine leather strap.' },
      { name: 'Smart Fitness Watch', price: 5999, description: 'Track steps, heart rate, and more with this fitness watch.' },
      { name: 'Skeleton Mechanical Watch', price: 6999, description: 'See-through dial revealing the intricate mechanical movement.' },
      { name: 'Rose Gold Ladies Watch', price: 3799, description: 'Delicate rose gold timepiece with a slim bracelet.' },
      { name: 'Dive Watch 200m', price: 5499, description: 'Water-resistant dive watch with luminous hands and bezel.' },
      { name: 'Wooden Bamboo Watch', price: 2499, description: 'Eco-friendly watch crafted from natural bamboo wood.' },
      { name: 'NATO Strap Field Watch', price: 2999, description: 'Rugged field watch with interchangeable NATO strap.' },
    ],
  },
  gadgets: {
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    products: [
      { name: 'Portable Smart Speaker', price: 2499, description: 'Compact speaker with rich sound and easy wireless pairing.' },
      { name: 'Wireless Charging Pad', price: 999, description: 'Fast charging pad designed for tidy desks and nightstands.' },
      { name: 'Noise Cancelling Earbuds', price: 3999, description: 'Premium earbuds with active noise cancellation technology.' },
      { name: 'Bluetooth Fitness Tracker', price: 1999, description: 'Wristband tracker monitoring steps, sleep, and heart rate.' },
      { name: 'USB-C Hub Multiport', price: 1499, description: '7-in-1 hub with HDMI, USB, SD card, and power delivery.' },
      { name: 'Mini Portable Projector', price: 8999, description: 'Compact projector for movies and presentations anywhere.' },
      { name: 'Mechanical Keyboard RGB', price: 3499, description: 'Tactile mechanical switches with customizable RGB lighting.' },
      { name: 'Wireless Gaming Mouse', price: 2499, description: 'Precision gaming mouse with adjustable DPI and ergonomic grip.' },
      { name: 'Smart LED Desk Lamp', price: 1799, description: 'Adjustable brightness and colour temperature desk lamp.' },
      { name: 'Power Bank 20000mAh', price: 1299, description: 'High-capacity power bank with fast charging output.' },
    ],
  },
  accessories: {
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=400&fit=crop',
    products: [
      { name: 'Leather Belt', price: 899, description: 'Versatile belt with a clean buckle and durable finish.' },
      { name: 'Knitted Scarf', price: 649, description: 'Soft scarf that adds warmth without extra bulk.' },
      { name: 'Canvas Baseball Cap', price: 499, description: 'Classic cap with adjustable back strap and curved brim.' },
      { name: 'Stainless Steel Chain', price: 1299, description: 'Polished steel chain necklace with a modern look.' },
      { name: 'Leather Wallet Bifold', price: 799, description: 'Slim bifold wallet with card slots and ID window.' },
      { name: 'Sunglasses Carrying Case', price: 349, description: 'Hard-shell case to protect your sunglasses on the go.' },
      { name: 'Patterned Pocket Square', price: 299, description: 'Silk-feel pocket square to elevate any suit.' },
      { name: 'Beanie Winter Hat', price: 449, description: 'Warm ribbed beanie perfect for cold weather.' },
      { name: 'Cufflinks Set Silver', price: 999, description: 'Elegant silver-toned cufflinks for formal shirts.' },
      { name: 'Phone Lanyard Strap', price: 249, description: 'Stylish and secure strap to keep your phone handy.' },
    ],
  },
};

const seededTag = ' [seeded-product]';

function buildProducts() {
  const all = [];
  const categoryKeys = Object.keys(categories);

  categoryKeys.forEach((cat, catIndex) => {
    const data = categories[cat];
    data.products.forEach((product, prodIndex) => {
      all.push({
        name: product.name,
        description: `${product.description}${seededTag}`,
        price: product.price,
        image: data.image,
        category: cat,
        isFeatured: catIndex < 3 && prodIndex < 3,
      });
    });
  });

  return all;
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding');

    const deleteResult = await Product.deleteMany({
      description: { $regex: seededTag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$' },
    });
    console.log(`Deleted ${deleteResult.deletedCount} old seeded products`);

    const products = buildProducts();
    const created = await Product.insertMany(products);
    console.log(`Inserted ${created.length} products across ${Object.keys(categories).length} categories`);

    const counts = {};
    created.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    Object.entries(counts).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count} products`);
    });
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
