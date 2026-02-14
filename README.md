# Love Lens 💕

A viral social app that analyzes chat screenshots to determine relationship compatibility, emotion, and "vibe." Upload your conversation screenshots and get instant insights with dynamic visual auras!

## ✨ Features

### 🎯 Core Features
- **OCR Text Extraction**: Uses Tesseract.js to extract text from uploaded images (client-side, no API keys needed)
- **Sentiment Analysis**: Analyzes extracted text for emotional keywords and calculates a Vibe Score (0-100)
- **Relationship Aura**: Dynamic glowing orb that changes color based on your relationship energy
- **Simp Score**: Analyzes text volume to show investment balance between partners
- **Dry Text Detector**: Identifies short, low-effort responses
- **Red Flag Counter**: Detects warning signs in your conversations
- **Download & Share**: Generate beautiful shareable images for Instagram Stories

### 🎨 Visual Design
- **Dark Mode**: Deep black/purple gradient background
- **Glassmorphism**: Modern frosted glass card effects
- **Neon Gradients**: Glowing buttons and accents
- **Animated Auras**: Pulsing, rotating relationship orbs
- **Mobile Responsive**: Perfect on iPhone and Android

### 🔥 Viral Elements
- Shareable result cards
- Eye-catching animations
- Instant feedback
- Social media optimized

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router) with TypeScript
- **Styling**: Tailwind CSS 4 with custom glassmorphism effects
- **UI Components**: shadcn/ui (Radix UI primitives)
- **OCR**: Tesseract.js (client-side text recognition)
- **Animations**: Framer Motion
- **Image Generation**: html-to-image (for downloadable results)

## 📦 Installation

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Check code quality
bun run lint
```

## 🎯 How It Works

### 1. Upload
- Click the glowing "Upload Chat Screenshot" button
- Select any chat screenshot from your device
- Preview your image before analysis

### 2. Analyze
- Tesseract.js extracts text from your image
- Sentiment analysis algorithms calculate:
  - Vibe Score (0-100)
  - Relationship Title (Power Couple, Situationship, etc.)
  - Investment balance
  - Dry text count
  - Red flag count

### 3. Discover Your Aura
- **Pink/Rose**: Romantic, strong connection (75+ vibe score)
- **Purple**: Something special, developing (50-74 vibe score)
- **Blue**: Trust-based, friendzone territory (25-49 vibe score)
- **Grey**: Fading, needs work (0-24 vibe score)
- **Orange**: Chaotic, red flags detected

### 4. Share
- Download the beautiful result card
- Share directly to Instagram Stories
- Tag your partner and spark conversations!

## 🎨 Customization

### Adjust Sentiment Keywords
Edit `src/lib/analyze-chat.ts` to modify keyword lists:

```typescript
const POSITIVE_KEYWORDS = [
  'love', 'baby', 'miss', 'beautiful', // Add your keywords
];

const NEGATIVE_KEYWORDS = [
  'ok', 'fine', 'whatever', 'idk', // Add your keywords
];
```

### Modify Aura Colors
Adjust color schemes in the same file:

```typescript
const gradients = {
  pink: 'radial-gradient(...)',
  blue: 'radial-gradient(...)',
  // Customize colors
};
```

### Change Titles
Edit relationship titles based on vibe score ranges in the analysis function.

## 📱 Mobile Optimization

The app is designed with mobile-first approach:
- Touch-friendly buttons (minimum 44px)
- Responsive layouts with Tailwind breakpoints
- Optimized for iPhone and Android screens
- Fast loading with client-side processing

## 🔒 Privacy

- All processing happens client-side
- No data is sent to external servers
- Images are processed locally in your browser
- No API keys required

## 📄 License

MIT License - feel free to use and modify!

## 🤝 Contributing

Ideas for improvements:
- Add more sentiment analysis algorithms
- Support multiple chat platforms
- Export analysis as PDF
- Save history of analyses
- Compare multiple conversations

Built with ❤️ using Next.js, TypeScript, and AI-powered insights
