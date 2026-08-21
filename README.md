# ✨ Quote Studio

> A modern, client-side social card & spiritual quote creator with full Gujarati & multilingual typography support.

## 🚀 Features

- **Live Responsive Canvas**: Real-time rendering with instant aspect ratio switching (`1:1` Square, `4:5` Portrait, `9:16` Story/Reel, `16:9` Landscape).
- **Profile Identity**:
  - Author Name & customizable font colors.
  - Social handle subtitle (`@vachanamrutquotes`, etc.).
  - Verified Blue Tick toggle (Twitter / Instagram style SVG).
  - Avatar picker with presets (Harikrishna Maharaj, Lotus, Sun, Feather) + Custom Image Upload.
- **Gujarati & Indic Typography**:
  - Bundled with Google Fonts: *Mukta Vaani*, *Noto Sans Gujarati*, *Anek Gujarati*, *Hind Vadodara*, *Baloo 2*, *Rasa Serif*, *Inter*, *Outfit*, *Playfair Display*.
  - Font weight selector (Light 300 to ExtraBold 800).
  - Font size, line spacing, letter spacing, and text alignment controls.
- **Card Aesthetics**:
  - Customizable Card Curves / Border Radius (0px to 48px).
  - Background Opacity & Frosted Glass Backdrop Blur.
  - Elevation shadows and borders.
- **Background & Atmospheric Filters**:
  - High-res preset gallery (sunset oceans, misty mountains, lush waterfalls, ambient lighting, gradients).
  - Custom background photo upload.
  - Blur slider, dim/darken overlay tint, and brightness controls.
- **Exporting**:
  - High-DPI Lossless PNG and optimized JPEG downloads.
  - Direct **"Copy Image"** to clipboard for pasting anywhere.

---

## 🛠️ Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev

# 3. Build for production
npm run build
```

---

## 🌐 Deployment to GitHub Pages

This project is configured for **GitHub Pages** (`username.github.io/quotes-creator`):
1. Push this repository to GitHub.
2. In your repository settings: **Settings > Pages > Build and deployment > Source**, select **GitHub Actions**.
3. The `.github/workflows/deploy.yml` workflow will automatically build and publish the app!
