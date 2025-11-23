# Setup MongoDB Lokal di VS Code

## Option 1: MongoDB Community Edition (Recommended)

### macOS dengan Homebrew

```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Check if running
brew services list | grep mongodb

# Stop MongoDB
brew services stop mongodb-community
```

### Linux (Ubuntu/Debian)

```bash
# Install MongoDB
sudo apt-get install -y mongodb

# Start service
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### Windows

- Download dari: https://www.mongodb.com/try/download/community
- Install dan pilih "Install MongoDB as a Service"
- MongoDB akan auto-start

## Option 2: MongoDB Atlas (Cloud - Optional)

Jika tidak ingin MongoDB lokal:

1. Pergi ke https://www.mongodb.com/cloud/atlas
2. Buat account gratis
3. Create cluster
4. Copy connection string
5. Update MONGO_URI di `.env` backend:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/cinesolve
   ```

## Verifikasi MongoDB Berjalan

### Dengan MongoDB Shell (mongosh)

```bash
# Connect ke MongoDB lokal
mongosh

# Show databases
show dbs

# Use cinesolve database
use cinesolve

# Show collections
show collections

# Exit
exit
```

### Dengan VS Code Extension

Recommended: Install extension "MongoDB for VS Code"

1. Open VS Code
2. Go to Extensions (Cmd+Shift+X)
3. Search "MongoDB for VS Code"
4. Install dari MongoDB Inc.
5. Click MongoDB icon di sidebar
6. Add connection dengan:
   - Connection String: `mongodb://127.0.0.1:27017`
   - Connection Name: local
7. Expand dan lihat databases real-time

## Troubleshoot

### MongoDB tidak berjalan?

```bash
# Check if MongoDB process running
ps aux | grep mongod

# macOS: check logs
brew services list | grep mongodb

# Linux: check status
sudo systemctl status mongodb

# Windows: check Services tab
```

### Port 27017 sudah digunakan?

```bash
# Find what's using port 27017
lsof -i :27017

# Kill process (careful!)
kill -9 <PID>
```

### Connection refused?

1. Pastikan MongoDB service berjalan
2. Pastikan MONGO_URI benar di `.env`
3. Test connection:
   ```bash
   mongosh mongodb://127.0.0.1:27017
   ```

## Backend Setup Lengkap

Setelah MongoDB running:

```bash
# Navigate to backend folder
cd backend

# Copy env example
cp .env.example .env

# Install dependencies
npm install

# Seed database (create admin user + sample films)
npm run seed

# Run server
npm run dev
```

Server akan running di: http://localhost:5000
