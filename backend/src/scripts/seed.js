require('dotenv').config();
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const User = require('../models/User');
const Film = require('../models/Film');
const Genre = require('../models/Genre');
const Country = require('../models/Country');
const Review = require('../models/Review');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cinesolve';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');

    // Clear existing data
    await User.deleteMany({});
    await Film.deleteMany({});
    await Genre.deleteMany({});
    await Country.deleteMany({});
    await Review.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminPassword = await bcryptjs.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin CineSolve',
      email: 'admin@cinesolve.com',
      password: adminPassword,
      role: 'admin',
    });
    console.log('✓ Admin created:', admin.email);

    // Create regular user
    const userPassword = await bcryptjs.hash('user123', 10);
    const user = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: userPassword,
      role: 'user',
    });
    console.log('✓ User created:', user.email);

    // Create genres
    const genres = await Genre.create([
      { name: 'Action', description: 'High-energy, exciting films', icon: '⚡' },
      { name: 'Drama', description: 'Emotional and character-driven stories', icon: '🎭' },
      { name: 'Sci-Fi', description: 'Science fiction and futuristic themes', icon: '🚀' },
      { name: 'Thriller', description: 'Suspenseful and intense stories', icon: '😰' },
      { name: 'Comedy', description: 'Funny and lighthearted films', icon: '😂' },
      { name: 'Horror', description: 'Scary and frightening content', icon: '👻' },
      { name: 'Romance', description: 'Love and relationship stories', icon: '💕' },
      { name: 'Adventure', description: 'Epic journeys and quests', icon: '🗺️' },
      { name: 'Fantasy', description: 'Magical and mythical worlds', icon: '✨' },
      { name: 'Mystery', description: 'Suspenseful puzzle-solving stories', icon: '🔍' }
    ]);
    console.log('✓ Genres created:', genres.length);

    // Create countries
    const countries = await Country.create([
      { name: 'USA', code: 'US', flag: '🇺🇸' },
      { name: 'United Kingdom', code: 'GB', flag: '🇬🇧' },
      { name: 'Japan', code: 'JP', flag: '🇯🇵' },
      { name: 'South Korea', code: 'KR', flag: '🇰🇷' },
      { name: 'France', code: 'FR', flag: '🇫🇷' },
      { name: 'Germany', code: 'DE', flag: '🇩🇪' },
      { name: 'Italy', code: 'IT', flag: '🇮🇹' },
      { name: 'Spain', code: 'ES', flag: '🇪🇸' },
      { name: 'India', code: 'IN', flag: '🇮🇳' },
      { name: 'Indonesia', code: 'ID', flag: '🇮🇩' }
    ]);
    console.log('✓ Countries created:', countries.length);    

    // Database Collections Structure
    console.log('\n📋 Database Collections Structure:');
    
    console.log('\n📍 User Collection:');
    console.log('  {');
    console.log('    _id: ObjectId,');
    console.log('    name: String,');
    console.log('    email: String (unique),');
    console.log('    password: String (hashed),');
    console.log('    role: String (admin | user),');
    console.log('    createdAt: Date,');
    console.log('    updatedAt: Date');
    console.log('  }');

    console.log('\n🎬 Film Collection:');
    console.log('  {');
    console.log('    _id: ObjectId,');
    console.log('    title: String (required),');
    console.log('    description: String,');
    console.log('    posterType: String (upload | url),');
    console.log('    posterUpload: String (path file: /uploads/posters/filename.jpg),');
    console.log('    posterUrl: String (external image URL),');
    console.log('    poster: String (auto-filled dari posterUpload atau posterUrl),');
    console.log('    genre: [String] (array of genre names),');
    console.log('    country: String,');
    console.log('    moodTags: [String],');
    console.log('    releaseYear: Number,');
    console.log('    watchSources: [{');
    console.log('      platformName: String,');
    console.log('      platformIcon: String,');
    console.log('      platformUrl: String');
    console.log('    }],');
    console.log('    createdAt: Date,');
    console.log('    updatedAt: Date');
    console.log('  }');

    console.log('\n🎭 Genre Collection:');
    console.log('  {');
    console.log('    _id: ObjectId,');
    console.log('    name: String (unique, required),');
    console.log('    description: String,');
    console.log('    icon: String (emoji),');
    console.log('    createdAt: Date');
    console.log('  }');

    console.log('\n🌍 Country Collection:');
    console.log('  {');
    console.log('    _id: ObjectId,');
    console.log('    name: String (unique, required),');
    console.log('    code: String (ISO 3166-1 alpha-2, unique),');
    console.log('    flag: String (emoji),');
    console.log('    createdAt: Date');
    console.log('  }');

    console.log('\n⭐ Review Collection:');
    console.log('  {');
    console.log('    _id: ObjectId,');
    console.log('    film_id: ObjectId (ref: Film, required),');
    console.log('    user_id: ObjectId (ref: User, required),');
    console.log('    description: String,');
    console.log('    rating: Number (1-5),');
    console.log('    createdAt: Date,');
    console.log('    updatedAt: Date');
    console.log('  }');

    console.log('\n📸 Poster Flow:');
    console.log('  Option 1: Upload Manual File');
    console.log('    - Frontend: Form dengan file input');
    console.log('    - Multer: Upload ke /uploads/posters/');
    console.log('    - Backend: posterType = "upload"');
    console.log('    - Backend: posterUpload = "/uploads/posters/filename.jpg"');
    console.log('    - Backend: poster = posterUpload (auto-filled)');
    console.log('    ');
    console.log('  Option 2: URL External');
    console.log('    - Frontend: Form dengan URL input');
    console.log('    - Backend: posterType = "url"');
    console.log('    - Backend: posterUrl = "https://image.example.com/poster.jpg"');
    console.log('    - Backend: poster = posterUrl (auto-filled)');
    console.log('    ');
    console.log('  Frontend Display:');
    console.log('    - Gunakan field "poster" untuk src image');
    console.log('    - Otomatis akan menampilkan baik dari upload maupun URL');

    console.log('\n✅ Seed completed successfully!');
    console.log('\nCredentials:');
    console.log('Admin Email: admin@cinesolve.com');
    console.log('Admin Password: admin123');
    console.log('\nUser Email: john@example.com');
    console.log('User Password: user123');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
