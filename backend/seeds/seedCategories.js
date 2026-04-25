import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Product from '../src/models/productModel.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecom';

const categories = {
  jeans: {
    products: [
      { name: 'Classic Blue Jeans', price: 1499, description: 'Everyday denim with a straight fit and soft stretch comfort.', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop' },
      { name: 'Vintage Wash Jeans', price: 1799, description: 'Relaxed-fit jeans with a faded wash for casual styling.', image: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=400&h=400&fit=crop' },
      { name: 'Slim Fit Black Jeans', price: 1599, description: 'Sleek black denim with a slim silhouette for versatile wear.', image: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400&h=400&fit=crop' },
      { name: 'Skinny Ripped Jeans', price: 1899, description: 'Trendy skinny jeans with distressed knee detailing.', image: 'https://images.unsplash.com/photo-1551854838-212c50b4c184?w=400&h=400&fit=crop' },
      { name: 'Bootcut Denim Jeans', price: 1399, description: 'Classic bootcut fit with a comfortable mid-rise waist.', image: 'https://images.unsplash.com/photo-1475178626620-a4d074967571?w=400&h=400&fit=crop' },
      { name: 'High Rise Mom Jeans', price: 1699, description: 'Retro-inspired high waist jeans with a relaxed leg.', image: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=400&h=400&fit=crop' },
      { name: 'Relaxed Fit Cargo Jeans', price: 1999, description: 'Utility-style cargo jeans with multiple pockets.', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=400&fit=crop' },
      { name: 'Grey Wash Straight Jeans', price: 1549, description: 'Modern grey denim with a straight leg cut.', image: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=400&h=400&fit=crop' },
      { name: 'White Slim Jeans', price: 1849, description: 'Crisp white denim perfect for summer outfits.', image: 'https://images.unsplash.com/photo-1560243563-062bfc001d68?w=400&h=400&fit=crop' },
      { name: 'Dark Indigo Regular Jeans', price: 1299, description: 'Deep indigo wash in a classic regular fit.', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop' },
    ],
  },
  't-shirts': {
    products: [
      { name: 'Organic Cotton Tee', price: 699, description: 'Soft staple t-shirt made for daily wear and easy layering.', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop' },
      { name: 'Oversized Graphic Tee', price: 899, description: 'Roomy t-shirt with a bold front print and dropped shoulders.', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop' },
      { name: 'Crew Neck Plain Tee', price: 499, description: 'Essential crew neck t-shirt in solid colours.', image: 'https://images.unsplash.com/photo-1622445275576-721325763afe?w=400&h=400&fit=crop' },
      { name: 'V-Neck Premium Tee', price: 799, description: 'Premium cotton v-neck tee with a soft hand feel.', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=400&fit=crop' },
      { name: 'Striped Henley Tee', price: 949, description: 'Casual henley with button placket and striped pattern.', image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop' },
      { name: 'Polo Collar T-Shirt', price: 1099, description: 'Classic polo with a ribbed collar and tailored fit.', image: 'https://images.unsplash.com/photo-1625910513413-5fc421e0fd4f?w=400&h=400&fit=crop' },
      { name: 'Muscle Fit Tank Top', price: 599, description: 'Athletic tank top with a muscle-hugging fit.', image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&h=400&fit=crop' },
      { name: 'Long Line Tee', price: 849, description: 'Extended length t-shirt with a modern silhouette.', image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=400&fit=crop' },
      { name: 'Pocket Tee Washed', price: 749, description: 'Washed look tee with a chest pocket detail.', image: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=400&h=400&fit=crop' },
      { name: 'Round Neck Printed Tee', price: 649, description: 'Eye-catching printed tee for everyday street style.', image: 'https://images.unsplash.com/photo-1503341504253-dff4f94032fc?w=400&h=400&fit=crop' },
    ],
  },
  shoes: {
    products: [
      { name: 'Street Runner Sneakers', price: 2499, description: 'Lightweight sneakers with cushioned support for all-day use.', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop' },
      { name: 'Minimal Leather Trainers', price: 3299, description: 'Clean low-top trainers with a sleek leather upper.', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop' },
      { name: 'Canvas Low-Top Sneakers', price: 1799, description: 'Casual canvas sneakers with rubber sole and lace-up front.', image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop' },
      { name: 'Running Performance Shoes', price: 3999, description: 'High-performance running shoes with breathable mesh.', image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop' },
      { name: 'Classic White Sneakers', price: 2799, description: 'Timeless white sneakers that go with everything.', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop' },
      { name: 'Chunky Platform Sneakers', price: 2999, description: 'Bold chunky sneakers with elevated platform sole.', image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop' },
      { name: 'Slip-On Casual Shoes', price: 1999, description: 'Easy slip-on design for quick and comfortable wear.', image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop' },
      { name: 'Suede Desert Boots', price: 3499, description: 'Elegant suede boots with a crepe rubber sole.', image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&h=400&fit=crop' },
      { name: 'High-Top Basketball Shoes', price: 4499, description: 'Supportive high-tops designed for the basketball court.', image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=400&fit=crop' },
      { name: 'Eco-Friendly Recycled Sneakers', price: 3199, description: 'Sustainable sneakers made from recycled materials.', image: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=400&h=400&fit=crop' },
    ],
  },
  glasses: {
    products: [
      { name: 'Round Frame Glasses', price: 1299, description: 'Slim round frames that add a modern touch to any outfit.', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop' },
      { name: 'Clear Lens Square Frames', price: 1499, description: 'Square glasses with lightweight frames and everyday comfort.', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop' },
      { name: 'Aviator Sunglasses', price: 1999, description: 'Classic aviator style with UV400 protection lenses.', image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&h=400&fit=crop' },
      { name: 'Cat Eye Frames', price: 1699, description: 'Retro-inspired cat eye glasses with bold acetate frames.', image: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=400&h=400&fit=crop' },
      { name: 'Rimless Titanium Glasses', price: 2499, description: 'Ultra-light rimless frames with flexible titanium arms.', image: 'https://images.unsplash.com/photo-1616363088386-31c4708ba2ea?w=400&h=400&fit=crop' },
      { name: 'Wayfarer Sunglasses', price: 1899, description: 'Iconic wayfarer shape with polarized lenses.', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop' },
      { name: 'Blue Light Blocking Glasses', price: 1199, description: 'Computer glasses that reduce eye strain from screens.', image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=400&h=400&fit=crop' },
      { name: 'Oversized Square Sunglasses', price: 1599, description: 'Statement oversized shades with gradient tint lenses.', image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400&h=400&fit=crop' },
      { name: 'Sport Wraparound Sunglasses', price: 2199, description: 'Secure wraparound design perfect for outdoor activities.', image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=400&fit=crop' },
      { name: 'Tortoiseshell Reading Glasses', price: 899, description: 'Classic tortoiseshell pattern with lightweight construction.', image: 'https://images.unsplash.com/photo-1578319439584-104c94d37305?w=400&h=400&fit=crop' },
    ],
  },
  jackets: {
    products: [
      { name: 'Utility Field Jacket', price: 2899, description: 'Structured jacket with roomy pockets and a clean finish.', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop' },
      { name: 'Quilted Puffer Jacket', price: 3499, description: 'Warm puffer jacket built for cooler weather and layered looks.', image: 'https://images.unsplash.com/photo-1544923246-77307dd270b5?w=400&h=400&fit=crop' },
      { name: 'Denim Trucker Jacket', price: 2499, description: 'Classic denim jacket with button front and chest pockets.', image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=400&fit=crop' },
      { name: 'Leather Biker Jacket', price: 5999, description: 'Edgy genuine leather jacket with asymmetric zip.', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop' },
      { name: 'Bomber Jacket', price: 3199, description: 'Casual bomber with ribbed cuffs and waistband.', image: 'https://images.unsplash.com/photo-1557398708-3c4a374489d6?w=400&h=400&fit=crop' },
      { name: 'Windbreaker Jacket', price: 1999, description: 'Lightweight wind-resistant jacket for outdoor activities.', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop' },
      { name: 'Corduroy Sherpa Jacket', price: 3799, description: 'Soft corduroy exterior with cozy sherpa lining.', image: 'https://images.unsplash.com/photo-1544923246-77307dd270b5?w=400&h=400&fit=crop' },
      { name: 'Rainproof Shell Jacket', price: 2799, description: 'Waterproof shell with sealed seams and adjustable hood.', image: 'https://images.unsplash.com/photo-1543076499-a6133cb932fd?w=400&h=400&fit=crop' },
      { name: 'Fleece Zip-Up Jacket', price: 2299, description: 'Warm fleece jacket ideal for layering in winter.', image: 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=400&h=400&fit=crop' },
      { name: 'Blazer Casual Jacket', price: 4499, description: 'Smart-casual blazer that transitions from office to evening.', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=400&fit=crop' },
    ],
  },
  suits: {
    products: [
      { name: 'Tailored Two-Piece Suit', price: 7999, description: 'Sharp modern suit designed for formal events and office wear.', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop' },
      { name: 'Slim Fit Blazer Set', price: 6499, description: 'Streamlined suit set with a lightweight, breathable finish.', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=400&fit=crop' },
      { name: 'Classic Black Suit', price: 8999, description: 'Timeless black suit perfect for any formal occasion.', image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400&h=400&fit=crop' },
      { name: 'Navy Blue Business Suit', price: 7499, description: 'Professional navy suit with a modern tailored fit.', image: 'https://images.unsplash.com/photo-1592878897400-43190a681e9a?w=400&h=400&fit=crop' },
      { name: 'Double Breasted Suit', price: 9499, description: 'Bold double-breasted design with peak lapels.', image: 'https://images.unsplash.com/photo-1560243563-062bfc001d68?w=400&h=400&fit=crop' },
      { name: 'Charcoal Grey Suit', price: 7999, description: 'Versatile grey suit that works for any dress code.', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop' },
      { name: 'Linen Summer Suit', price: 5999, description: 'Breathable linen suit designed for warm weather events.', image: 'https://images.unsplash.com/photo-1592878897400-43190a681e9a?w=400&h=400&fit=crop' },
      { name: 'Tuxedo Dinner Suit', price: 10999, description: 'Elegant tuxedo with satin lapels for black-tie events.', image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400&h=400&fit=crop' },
      { name: 'Three-Piece Waistcoat Suit', price: 9999, description: 'Complete three-piece suit with matching waistcoat.', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=400&fit=crop' },
      { name: 'Checked Pattern Suit', price: 8499, description: 'Contemporary checked pattern for a stylish statement.', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop' },
    ],
  },
  bags: {
    products: [
      { name: 'Canvas Weekender Bag', price: 1999, description: 'Spacious travel bag with durable canvas construction.', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop' },
      { name: 'Compact Crossbody Bag', price: 1299, description: 'Compact daily bag with adjustable strap and quick-access pockets.', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop' },
      { name: 'Leather Laptop Bag', price: 3499, description: 'Professional bag with padded laptop compartment and organizer pockets.', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop' },
      { name: 'Backpack Daypack', price: 1799, description: 'Lightweight everyday backpack with multiple compartments.', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop' },
      { name: 'Messenger Shoulder Bag', price: 2299, description: 'Classic messenger style with flap closure and adjustable strap.', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop' },
      { name: 'Duffle Gym Bag', price: 1599, description: 'Spacious duffle with shoe compartment and wet pocket.', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop' },
      { name: 'Mini Sling Bag', price: 899, description: 'Compact sling bag perfect for essentials on the go.', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop' },
      { name: 'Roll-Top Backpack', price: 2499, description: 'Water-resistant roll-top design with modern aesthetics.', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop' },
      { name: 'Tote Shopping Bag', price: 1199, description: 'Eco-friendly tote bag with reinforced handles and inner pocket.', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop' },
      { name: 'Travel Organiser Pouch Set', price: 749, description: 'Set of packing cubes and pouches for organised travel.', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop' },
    ],
  },
  watches: {
    products: [
      { name: 'Chronograph Steel Watch', price: 4499, description: 'Statement watch with a stainless steel band and precise movement.', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop' },
      { name: 'Minimal Mesh Watch', price: 3499, description: 'Clean dial watch with a slim mesh strap and understated styling.', image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400&h=400&fit=crop' },
      { name: 'Digital Sport Watch', price: 1999, description: 'Feature-packed digital watch with stopwatch and alarm functions.', image: 'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=400&h=400&fit=crop' },
      { name: 'Leather Strap Dress Watch', price: 3999, description: 'Elegant dress watch with genuine leather strap.', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=400&fit=crop' },
      { name: 'Smart Fitness Watch', price: 5999, description: 'Track steps, heart rate, and more with this fitness watch.', image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop' },
      { name: 'Skeleton Mechanical Watch', price: 6999, description: 'See-through dial revealing the intricate mechanical movement.', image: 'https://images.unsplash.com/photo-1639037687665-c683c8b91a5a?w=400&h=400&fit=crop' },
      { name: 'Rose Gold Ladies Watch', price: 3799, description: 'Delicate rose gold timepiece with a slim bracelet.', image: 'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=400&h=400&fit=crop' },
      { name: 'Dive Watch 200m', price: 5499, description: 'Water-resistant dive watch with luminous hands and bezel.', image: 'https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=400&h=400&fit=crop' },
      { name: 'Wooden Bamboo Watch', price: 2499, description: 'Eco-friendly watch crafted from natural bamboo wood.', image: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=400&h=400&fit=crop' },
      { name: 'NATO Strap Field Watch', price: 2999, description: 'Rugged field watch with interchangeable NATO strap.', image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=400&h=400&fit=crop' },
    ],
  },
  gadgets: {
    products: [
      { name: 'Portable Smart Speaker', price: 2499, description: 'Compact speaker with rich sound and easy wireless pairing.', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop' },
      { name: 'Wireless Charging Pad', price: 999, description: 'Fast charging pad designed for tidy desks and nightstands.', image: 'https://images.unsplash.com/photo-1591815302525-756a9bcc3425?w=400&h=400&fit=crop' },
      { name: 'Noise Cancelling Earbuds', price: 3999, description: 'Premium earbuds with active noise cancellation technology.', image: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop' },
      { name: 'Bluetooth Fitness Tracker', price: 1999, description: 'Wristband tracker monitoring steps, sleep, and heart rate.', image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop' },
      { name: 'USB-C Hub Multiport', price: 1499, description: '7-in-1 hub with HDMI, USB, SD card, and power delivery.', image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&h=400&fit=crop' },
      { name: 'Mini Portable Projector', price: 8999, description: 'Compact projector for movies and presentations anywhere.', image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=400&fit=crop' },
      { name: 'Mechanical Keyboard RGB', price: 3499, description: 'Tactile mechanical switches with customizable RGB lighting.', image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=400&fit=crop' },
      { name: 'Wireless Gaming Mouse', price: 2499, description: 'Precision gaming mouse with adjustable DPI and ergonomic grip.', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop' },
      { name: 'Smart LED Desk Lamp', price: 1799, description: 'Adjustable brightness and colour temperature desk lamp.', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400&h=400&fit=crop' },
      { name: 'Power Bank 20000mAh', price: 1299, description: 'High-capacity power bank with fast charging output.', image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop' },
    ],
  },
  accessories: {
    products: [
      { name: 'Leather Belt', price: 899, description: 'Versatile belt with a clean buckle and durable finish.', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop' },
      { name: 'Knitted Scarf', price: 649, description: 'Soft scarf that adds warmth without extra bulk.', image: 'https://images.unsplash.com/photo-1457545195570-67f207084966?w=400&h=400&fit=crop' },
      { name: 'Canvas Baseball Cap', price: 499, description: 'Classic cap with adjustable back strap and curved brim.', image: 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=400&h=400&fit=crop' },
      { name: 'Stainless Steel Chain', price: 1299, description: 'Polished steel chain necklace with a modern look.', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop' },
      { name: 'Leather Wallet Bifold', price: 799, description: 'Slim bifold wallet with card slots and ID window.', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop' },
      { name: 'Sunglasses Carrying Case', price: 349, description: 'Hard-shell case to protect your sunglasses on the go.', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop' },
      { name: 'Patterned Pocket Square', price: 299, description: 'Silk-feel pocket square to elevate any suit.', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop' },
      { name: 'Beanie Winter Hat', price: 449, description: 'Warm ribbed beanie perfect for cold weather.', image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=400&h=400&fit=crop' },
      { name: 'Cufflinks Set Silver', price: 999, description: 'Elegant silver-toned cufflinks for formal shirts.', image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&fit=crop' },
      { name: 'Phone Lanyard Strap', price: 249, description: 'Stylish and secure strap to keep your phone handy.', image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop' },
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
        image: product.image,
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
