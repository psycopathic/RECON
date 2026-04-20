import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Product from '../src/models/productModel.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecom';

const categorySeedData = [
  {
    category: 'jeans',
    products: [
      ['Classic Blue Jeans', 59, 'Everyday denim with a straight fit and soft stretch comfort.'],
      ['Vintage Wash Jeans', 72, 'Relaxed-fit jeans with a faded wash for casual styling.'],
    ],
  },
  {
    category: 't-shirts',
    products: [
      ['Organic Cotton Tee', 24, 'Soft staple t-shirt made for daily wear and easy layering.'],
      ['Oversized Graphic Tee', 31, 'Roomy t-shirt with a bold front print and dropped shoulders.'],
    ],
  },
  {
    category: 'shoes',
    products: [
      ['Street Runner Sneakers', 88, 'Lightweight sneakers with cushioned support for all-day use.'],
      ['Minimal Leather Trainers', 110, 'Clean low-top trainers with a sleek leather upper.'],
    ],
  },
  {
    category: 'glasses',
    products: [
      ['Round Frame Glasses', 45, 'Slim round frames that add a modern touch to any outfit.'],
      ['Clear Lens Square Frames', 52, 'Square glasses with lightweight frames and everyday comfort.'],
    ],
  },
  {
    category: 'jackets',
    products: [
      ['Utility Field Jacket', 95, 'Structured jacket with roomy pockets and a clean finish.'],
      ['Quilted Puffer Jacket', 129, 'Warm puffer jacket built for cooler weather and layered looks.'],
    ],
  },
  {
    category: 'suits',
    products: [
      ['Tailored Two-Piece Suit', 210, 'Sharp modern suit designed for formal events and office wear.'],
      ['Slim Fit Blazer Set', 189, 'Streamlined suit set with a lightweight, breathable finish.'],
    ],
  },
  {
    category: 'bags',
    products: [
      ['Canvas Weekender Bag', 67, 'Spacious travel bag with durable canvas construction.'],
      ['Compact Crossbody Bag', 49, 'Compact daily bag with adjustable strap and quick-access pockets.'],
    ],
  },
  {
    category: 'watches',
    products: [
      ['Chronograph Steel Watch', 145, 'Statement watch with a stainless steel band and precise movement.'],
      ['Minimal Mesh Watch', 118, 'Clean dial watch with a slim mesh strap and understated styling.'],
    ],
  },
  {
    category: 'gadgets',
    products: [
      ['Portable Smart Speaker', 79, 'Compact speaker with rich sound and easy wireless pairing.'],
      ['Wireless Charging Pad', 39, 'Fast charging pad designed for tidy desks and nightstands.'],
    ],
  },
  {
    category: 'accessories',
    products: [
      ['Leather Belt', 34, 'Versatile belt with a clean buckle and durable finish.'],
      ['Knitted Scarf', 27, 'Soft scarf that adds warmth without extra bulk.'],
    ],
  },
];

const seededDescriptionSuffix = ' [seeded-category-demo]';
const expansionDescriptors = [
  ['Essential', 8, 'Built as a reliable everyday pick with clean styling.'],
  ['Premium', 16, 'Upgraded materials and detailing give it a sharper finish.'],
  ['Sport', 12, 'Designed for easy movement and all-day comfort.'],
  ['Studio', 14, 'A polished option made to fit into dressed-up looks.'],
  ['Street', 10, 'Leans into a modern casual look with easy layering appeal.'],
  ['Travel', 18, 'Made to stay comfortable through commutes, trips, and long days.'],
  ['Core', 6, 'A versatile staple that works across seasons and occasions.'],
  ['Signature', 20, 'A standout version with elevated finish and stronger presence.'],
  ['Weekend', 9, 'Relaxed styling that fits casual plans and off-duty wear.'],
  ['Modern', 13, 'Clean lines and updated proportions keep the look current.'],
];

const expandedCategorySeedData = categorySeedData.map((categoryData) => ({
  ...categoryData,
  products: [
    ...categoryData.products,
    ...expansionDescriptors.map(([descriptor, priceOffset, description], index) => {
      const [seedName, seedPrice] = categoryData.products[index % categoryData.products.length];

      return [
        `${descriptor} ${seedName}`,
        seedPrice + priceOffset,
        `${description} ${categoryData.category} collection exclusive.`,
      ];
    }),
  ],
}));

const sampleProducts = expandedCategorySeedData.flatMap(({ category, products }, categoryIndex) =>
  products.map(([name, price, description], productIndex) => ({
    name,
    description: `${description}${seededDescriptionSuffix}`,
    price,
    image: `https://via.placeholder.com/400x400?text=${encodeURIComponent(name)}`,
    category,
    isFeatured: categoryIndex < 3 && productIndex === 0,
  }))
);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding');

    await Product.deleteMany({
      description: { $regex: `${seededDescriptionSuffix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$` },
    });

    const created = await Product.insertMany(sampleProducts);
    console.log(`Inserted ${created.length} products`);
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
