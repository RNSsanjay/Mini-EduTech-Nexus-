@echo off
echo 🚀 Setting up Mini EduTech Nexus...

REM Install root dependencies
echo 📦 Installing root dependencies...
call npm install

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install

REM Generate Prisma client
echo 🗄️ Setting up database...
call npx prisma generate
call npx prisma migrate dev --name init
call npx prisma db seed

cd ..

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
call npm install

cd ..

echo ✅ Setup complete!
echo.
echo 🎯 To start development:
echo npm run dev
echo.
echo 📚 Demo accounts:
echo Student: john@student.com / password123
echo Professor: jane@professor.com / password123
