# RE-CON — E-Commerce Platform

## About

RE-CON is a modern e-commerce platform where users can browse products across multiple categories, compare prices from different platforms, and purchase seamlessly. Vendors can manage their product catalog through an admin dashboard.

## Features

### Browse & Shop
- Explore **10 categories**: Jeans, T-Shirts, Shoes, Glasses, Jackets, Suits, Bags, Watches, Gadgets, and Accessories
- 100+ products with high-quality images and detailed descriptions
- Search products by name or description
- Featured products highlighted on the homepage

### Price Comparison
- Compare prices across **Amazon**, **Flipkart**, **Snapdeal**, and **Meesho** on every product page
- See the **market average**, **lowest price**, **highest price**, and **your savings** at a glance
- Click **"Visit"** to go directly to the product page on any platform and buy at the best price
- Prices are fetched live and cached for accuracy

### Voice Control
- Navigate the entire app hands-free using voice commands
- Say things like:
  - "Search running shoes" — searches products
  - "Open jeans" or "Show jackets" — navigates to a category
  - "Go to cart" — opens your cart
  - "Go home" — returns to homepage
  - "Go back" — goes to previous page
  - "Add to cart" — adds the current product
  - "Checkout" — takes you to checkout
- Fuzzy matching understands mispronunciations (e.g., "genes" → Jeans, "god" → Cart)

### Cart & Checkout
- Add products to cart, adjust quantities, remove items
- Apply coupon codes for discounts
- Secure checkout via Stripe
- Automatic coupon rewards on orders above ₹200

### User Accounts
- **Customer account** — browse, search, compare prices, add to cart, and checkout
- **Vendor account** — full product management dashboard with analytics
- Secure login with session persistence across page refreshes

### Admin Dashboard (Vendor)
- Create, delete, and manage products with image uploads
- Toggle products as featured
- Edit price comparison links per product
- View sales analytics

### Design
- Sleek dark theme with glass-morphism effects
- Smooth animations and transitions
- Fully responsive across mobile, tablet, and desktop
- Image carousel with category-linked "Discover" buttons
- Uniform product cards with consistent layout
