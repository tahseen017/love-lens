# Love Lens - Test Examples

## Sample Text for Testing

You can test the analysis by using these sample conversation snippets:

### Power Couple Example (High Vibe Score ~85+)
```
Hey beautiful! Just wanted to say I miss you so much 💕
Aww baby you're the best! I was thinking about you too
Can't wait to see you tonight! You're absolutely amazing
You make my heart smile every single day
Love you so much, you're my favorite person in the whole world
```

### Situationship Example (Medium Vibe Score ~50-70)
```
Hey what's up?
nm you?
same here
 wanna hang out later?
maybe
cool
```

### Emotional Damage Example (Low Vibe Score ~20-40)
```
ok
k
whatever
fine
nevermind then
```

### Toxic/Red Flag Example (Very Low Vibe Score ~0-20)
```
you're being annoying
whatever I don't care
leave me alone
toxic behavior
this is the worst
I regret this
```

## Testing the App

1. Take a screenshot of any of the above conversations (or use your real chat)
2. Open Love Lens at http://localhost:3000
3. Click "Upload Chat Screenshot"
4. Select your screenshot
5. Click "Analyze Chat"
6. Wait for the analysis to complete
7. View your relationship aura and stats
8. Download or share your results!

## OCR Accuracy Tips

For best results with Tesseract.js:
- Use high-quality screenshots
- Ensure text is clear and readable
- Avoid blurry or low-resolution images
- Standard chat fonts work best
- Good lighting in screenshots helps

## Testing Download Feature

1. Run the app and analyze a chat
2. Click the "Download" button
3. The result card will be saved as PNG
4. Check your downloads folder

## Testing Share Feature

1. Analyze a chat
2. Click the "Share" button
3. If on mobile, select where to share (Instagram Stories, etc.)
4. If on desktop, it will download the image
5. You can manually share the downloaded image

## Expected Behavior

- **Vibe Score**: 0-100 rating of relationship positivity
- **Aura Color**: Changes based on score (pink/blue/grey/orange/purple)
- **Title**: Fun relationship descriptor (Power Couple, Situationship, etc.)
- **Dry Text Count**: Number of low-effort responses
- **Red Flags**: Warning signs detected
- **Investment Balance**: Who's more engaged in the conversation
