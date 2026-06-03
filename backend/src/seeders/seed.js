import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { Cart } from "../models/Cart.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";

dotenv.config();

const products = [
  {
    name: "AeroBook Pro 14",
    brand: "NovaTech",
    category: "Laptops",
    description: "A lightweight laptop with a bright display, fast SSD storage, and all-day battery life for students and professionals.",
    price: 89999,
    stock: 12,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
    rating: 4.7,
    numReviews: 86,
    isFeatured: true
  },
  {
    name: "Pulse X Wireless Headphones",
    brand: "SoundCraft",
    category: "Audio",
    description: "Noise-cancelling wireless headphones with deep bass, clear calls, and 40 hours of playback.",
    price: 6999,
    stock: 34,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    rating: 4.5,
    numReviews: 142,
    isFeatured: true
  },
  {
    name: "Orbit Smart Watch",
    brand: "FitLoop",
    category: "Wearables",
    description: "Track workouts, sleep, heart rate, and notifications with a sharp AMOLED display.",
    price: 12999,
    stock: 22,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    rating: 4.4,
    numReviews: 74,
    isFeatured: false
  },
  {
    name: "PixelWave 5G Phone",
    brand: "PixelWave",
    category: "Mobiles",
    description: "A fast 5G smartphone with a high-refresh display and a reliable camera system.",
    price: 54999,
    stock: 18,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
    rating: 4.6,
    numReviews: 119,
    isFeatured: true
  },
  {
    name: "Creator Mechanical Keyboard",
    brand: "KeyForge",
    category: "Accessories",
    description: "A compact mechanical keyboard with hot-swappable switches and white backlighting.",
    price: 4999,
    stock: 40,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80",
    rating: 4.3,
    numReviews: 63,
    isFeatured: false
  },
  {
    name: "FocusDesk LED Lamp",
    brand: "Deskly",
    category: "Home Office",
    description: "Adjustable desk lamp with touch controls, warm and cool light modes, and USB charging.",
    price: 2499,
    stock: 55,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
    rating: 4.2,
    numReviews: 41,
    isFeatured: false
  },
  {
    name: "FrameShot Mirrorless Camera",
    brand: "LensPro",
    category: "Cameras",
    description: "Compact mirrorless camera with 4K video, fast autofocus, and a beginner-friendly control layout.",
    price: 64999,
    stock: 9,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80",
    rating: 4.6,
    numReviews: 52,
    isFeatured: true
  },
  {
    name: "GlideTab 11 Tablet",
    brand: "Tabora",
    category: "Tablets",
    description: "Slim 11-inch tablet for notes, streaming, online classes, and everyday productivity.",
    price: 31999,
    stock: 21,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=80",
    rating: 4.4,
    numReviews: 68,
    isFeatured: false
  },
  {
    name: "ThunderPlay Gaming Console",
    brand: "PlayCore",
    category: "Gaming",
    description: "Next-generation gaming console with fast loading, wireless controller, and immersive visuals.",
    price: 44999,
    stock: 14,
    image: "https://images.unsplash.com/photo-1605901309584-818e25960a8f?auto=format&fit=crop&w=900&q=80",
    rating: 4.8,
    numReviews: 156,
    isFeatured: true
  },
  {
    name: "VisionView 27 Monitor",
    brand: "ViewCraft",
    category: "Home Office",
    description: "27-inch QHD monitor with sharp colors, slim bezels, and eye-care display modes.",
    price: 22999,
    stock: 19,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80",
    rating: 4.5,
    numReviews: 91,
    isFeatured: false
  },
  {
    name: "BassCube Bluetooth Speaker",
    brand: "SoundCraft",
    category: "Audio",
    description: "Portable waterproof Bluetooth speaker with punchy sound and 18-hour battery backup.",
    price: 3499,
    stock: 48,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80",
    rating: 4.3,
    numReviews: 104,
    isFeatured: false
  },
  {
    name: "SwiftCharge Power Bank",
    brand: "VoltEdge",
    category: "Accessories",
    description: "20000mAh fast-charging power bank with dual USB output and compact travel design.",
    price: 2199,
    stock: 60,
    image: "https://urbnworld.com/cdn/shop/files/20000compact25Wblue-01.webp?v=1747720151&width=900",
    rating: 4.1,
    numReviews: 87,
    isFeatured: false
  },
  {
    name: "UrbanPack Tech Backpack",
    brand: "CarryLab",
    category: "Accessories",
    description: "Water-resistant backpack with padded laptop storage, cable pockets, and commuter-friendly design.",
    price: 2999,
    stock: 37,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
    rating: 4.2,
    numReviews: 46,
    isFeatured: false
  },
  {
    name: "CleanAir Mini Purifier",
    brand: "HomePure",
    category: "Appliances",
    description: "Compact air purifier for bedrooms and study rooms with HEPA filtration and quiet sleep mode.",
    price: 7999,
    stock: 17,
    image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=900&q=80",
    rating: 4.0,
    numReviews: 38,
    isFeatured: false
  },
  {
    name: "BrewMate Smart Coffee Maker",
    brand: "Kitchenly",
    category: "Appliances",
    description: "Programmable coffee maker with temperature control, auto shutoff, and a modern steel finish.",
    price: 9999,
    stock: 11,
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=900&q=80",
    rating: 4.3,
    numReviews: 57,
    isFeatured: true
  },
  {
    name: "ProClick Wireless Mouse",
    brand: "KeyForge",
    category: "Accessories",
    description: "Ergonomic wireless mouse with silent clicks, adjustable DPI, and long battery life.",
    price: 1499,
    stock: 72,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=80",
    rating: 4.2,
    numReviews: 123,
    isFeatured: false
  }
];

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin"
  },
  {
    name: "Demo Customer",
    email: "user@example.com",
    password: "user123",
    role: "user"
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Cart.deleteMany({}),
      Order.deleteMany({})
    ]);

    await User.create(users);
    await Product.insertMany(products);

    console.log("Seed data imported successfully");
    console.log("Admin login: admin@example.com / admin123");
    console.log("User login: user@example.com / user123");
  } catch (error) {
    console.error(`Seed failed: ${error.message}`);
  } finally {
    await mongoose.disconnect();
  }
};

seedDatabase();
