import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/ProductModel.js';

dotenv.config();

const products = [
  {
    name: 'TECNO POVA 6 Pro 5G',
    description: 'Powerful gaming smartphone popular in Ethiopia with large battery, bright display, and excellent value for money',
    price: 45000,  
    stock: 60,
    category: 'electronics',
    imageUrl: 'https://example.com/tecno-pova6.jpg',
    rating: 4.6
  },
  {
    name: 'Samsung Galaxy A35 5G',
    description: 'Reliable mid-range Android phone with great camera and 5G support – very popular in Addis Ababa',
    price: 38000,  
    stock: 80,
    category: 'electronics',
    imageUrl: 'https://example.com/samsung-a35.jpg',
    rating: 4.5
  },
  {
    name: 'Yirgacheffe Premium Washed Coffee Beans',
    description: 'Single-origin Ethiopian Arabica from Yirgacheffe – floral, bright acidity, citrus notes (1 kg bag)',
    price: 1200,   
    stock: 250,
    category: 'food',
    imageUrl: 'https://example.com/yirgacheffe-coffee.jpg',
    rating: 4.9
  },
  {
    name: 'Sidama Natural Coffee Beans',
    description: 'Fruity and full-bodied Ethiopian coffee from Sidama region – berry & wine-like flavors (1 kg bag)',
    price: 1100,   
    stock: 180,
    category: 'food',
    imageUrl: 'https://example.com/sidama-coffee.jpg',
    rating: 4.7
  },
  {
    name: 'Modern Habesha Kemis Dress',
    description: 'Elegant contemporary Ethiopian traditional dress with beautiful embroidery – perfect for Timket, weddings, or special events',
    price: 25000, 
    stock: 40,
    category: 'fashion',
    imageUrl: 'https://example.com/habesha-kemis-modern.jpg',
    rating: 4.8
  },
  {
    name: 'Handwoven Cotton Netela Shawl',
    description: 'Traditional Ethiopian white cotton shawl with colorful borders – versatile for everyday wear or cultural occasions',
    price: 4500,   
    stock: 120,
    category: 'fashion',
    imageUrl: 'https://example.com/netela-shawl.jpg',
    rating: 4.6
  },
  {
    name: 'Teff Injera Making Kit',
    description: 'Premium teff flour set + fermentation starter for authentic homemade injera – enough for multiple batches',
    price: 2500,   
    stock: 100,
    category: 'food',
    imageUrl: 'https://example.com/teff-injera-kit.jpg',
    rating: 4.4
  },
  {
    name: 'Traditional Ethiopian Coffee Pot (Jebena) Set',
    description: 'Handcrafted ceramic jebena with cups and stand – ideal for traditional buna ceremony at home',
    price: 3500,  
    stock: 90,
    category: 'home',
    imageUrl: 'https://example.com/jebena-set.jpg',
    rating: 4.5
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products`);

    // Display created products
    const createdProducts = await Product.find({});
    console.log('\nCreated Products:');
    createdProducts.forEach(p => {
      console.log(`- ${p.name} (${p.category}): ${p.price} ETB`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
