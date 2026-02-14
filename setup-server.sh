#!/bin/bash
# Love Lens - Server Setup Script
# Run this after uploading your code to Oracle Cloud

echo "🚀 Love Lens Server Setup"
echo "========================="

# Create necessary directories
mkdir -p db public/uploads

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << 'EOF'
DATABASE_URL=file:/app/db/prod.db
AUTH_SECRET=398e6b7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f
AUTH_GOOGLE_ID=your_google_id
AUTH_GOOGLE_SECRET=your_google_secret
EOF
    echo "⚠️  Please edit .env with your Google credentials!"
    echo "Run: nano .env"
fi

# Build and start
echo "Building and starting Docker containers..."
docker compose up -d --build

echo ""
echo "✅ Setup complete!"
echo ""
echo "Your app should be running at: http://$(curl -s ifconfig.me):3000"
echo ""
echo "Commands:"
echo "  docker compose logs -f     - View logs"
echo "  docker compose down        - Stop the app"
echo "  docker compose up -d       - Start the app"
