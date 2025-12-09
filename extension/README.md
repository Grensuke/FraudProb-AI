# Veritas Browser Extension

A powerful browser extension that automatically scans every website you visit for scams, phishing, and malicious content in real-time.

## Features

✅ **Automatic Scanning** - Scans every URL you visit automatically
✅ **Real-Time Results** - Displays safety verdict instantly in a sidebar
✅ **Color-Coded Verdicts** - Green (Safe), Yellow (Warning), Red (Danger)
✅ **Detailed Analysis** - Shows technical analysis of URL features
✅ **Easy Reports** - Quick access to report phishing links
✅ **Privacy Focused** - Works with your local Veritas API

## Installation Steps

### Step 1: Generate Extension Icons
1. Open `extension/icon-generator.html` in your browser
2. Click "Download" for each icon (icon-16.png, icon-48.png, icon-128.png)
3. Save them to the `extension/icons/` folder

### Step 2: Load Extension in Chrome
1. Make sure your Veritas backend is running:
   ```bash
   cd backend
   npm run dev
   ```
   Should show: "Veritas API running on http://localhost:3000"

2. Open Chrome and go to: `chrome://extensions/`

3. Enable "Developer mode" (top-right toggle)

4. Click "Load unpacked"

5. Navigate to your `extension/` folder and select it

6. The extension should now appear in your Chrome toolbar!

### Step 3: Use the Extension

**Automatic Scanning:**
- Visit any website
- A sidebar will appear on the right side
- Shows: URL, Risk Score, Verdict, and Technical Analysis
- Close the sidebar with the X button

**Quick Access:**
- Click the Veritas icon in toolbar to see:
  - Current website URL
  - Links to Veritas Dashboard
  - Button to report phishing

**Quick Report:**
- If you see a suspicious site, click the extension icon
- Click "Report Phishing"
- Fill out the report form

## File Structure

```
extension/
├── manifest.json          # Chrome extension configuration
├── background.js          # Service worker - handles scanning
├── content.js             # Content script - injects sidebar
├── popup.html             # Extension popup UI
├── popup.js               # Popup functionality
├── icon-generator.html    # Generate icons
└── icons/                 # Extension icons
    ├── icon-16.png
    ├── icon-48.png
    └── icon-128.png
```

## How It Works

1. **URL Detected** - When you load a page, background.js detects the URL
2. **API Call** - Sends URL to Veritas backend at `localhost:3000/api/analyze`
3. **AI Analysis** - Backend analyzes URL with ML model (8 features)
4. **Risk Score** - Calculates 0-100% risk score
5. **Verdict** - Returns High/Medium/Low Risk verdict
6. **Display** - content.js injects sidebar with results

## Risk Score Interpretation

| Score | Verdict | Color |
|-------|---------|-------|
| 70-100% | High Risk ⚠️ | Red |
| 40-69% | Medium Risk ⚡ | Yellow |
| 0-39% | Low Risk ✓ | Green |

## Configuration

To change the API URL:
1. Edit `background.js` line 4:
   ```javascript
   const API_URL = 'http://localhost:3000/api/analyze';
   ```

2. Edit `popup.html` - change the links URLs:
   ```html
   <a href="http://localhost:5173" target="_blank">Veritas Home</a>
   ```

## Troubleshooting

**Extension not scanning sites?**
- Make sure backend is running: `npm run dev` in backend/
- Check browser console (F12) for errors
- Reload the extension from `chrome://extensions/`

**Sidebar not appearing?**
- Some websites have security policies that block extensions
- Try refreshing the page
- Try a different website

**Icons not showing?**
- Make sure you downloaded all 3 icons to `extension/icons/`
- Reload the extension from `chrome://extensions/`

**"Scan failed" message?**
- Backend might not be running
- Check that `http://localhost:3000/api/analyze` is accessible
- Try again in a moment

## Browser Compatibility

- ✅ Chrome (v88+)
- ✅ Edge (based on Chromium)
- ✅ Brave (Chromium-based)
- ✅ Opera (Chromium-based)
- ⚠️ Firefox (requires manifest v2 conversion)

## Security Notes

- Extension only sends URLs to your local Veritas API
- No data is sent to external services
- All scans happen in real-time locally
- No personal browsing history is stored
- Icons and styles loaded locally

## Tips for Best Results

1. **Keep Backend Running** - Extension needs the API available
2. **Use HTTPS sites** - HTTPS status is one of the 8 analyzed features
3. **Report Suspicious Sites** - Help improve the scam database
4. **Check Admin Dashboard** - View all scanned sites and reports

## Support

For issues or suggestions:
- Check the Admin Dashboard
- View recent scans
- Report false positives
- Contact the Veritas team

---

**Made with ❤️ for the Veritas Scam Detection System**
