#!/bin/bash

echo "🚀 Setting up Mini EduTech Nexus..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Generate Prisma client
echo "🗄️ Setting up database..."
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed

cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

cd ..

echo "✅ Setup complete!"
echo ""
echo "🎯 To start development:"
echo "npm run dev"
echo ""
echo "📚 Demo accounts:"
echo "Student: john@student.com / password123"
echo "Professor: jane@professor.com / password123"
