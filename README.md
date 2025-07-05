# Chrome Extension - Cookie Setter

[![Version](https://img.shields.io/badge/version-2.0-blue.svg)](https://github.com/nghiaomg/ChromeExtension-CookieSetter)
[![Chrome Web Store](https://img.shields.io/badge/Chrome-Extension-green.svg)](https://chrome.google.com/webstore)
[![License](https://img.shields.io/badge/license-MIT-orange.svg)](LICENSE)

> **Advanced Cookie Management Tool for Developers**  
> A powerful Chrome extension designed to streamline cookie management for web developers and testers with intelligent features and intuitive interface.

## 🚀 Features

### 🍪 **Smart Cookie Management**
- **Auto-load Current Cookies**: Automatically displays current website cookies when extension opens
- **One-Click Copy**: Copy cookies to clipboard with visual feedback
- **Intelligent Set**: Apply custom cookies to current tab with automatic page reload
- **Smart Duplicate Prevention**: Advanced algorithm prevents saving similar/duplicate cookies

### 📚 **Cookie History**
- **Organized History**: View previously set cookies organized by domain
- **Quick Apply**: Click any saved cookie to open new tab and apply automatically  
- **Bulk Management**: Clear all saved cookies with one click
- **Compact Display**: Long cookie strings are truncated for better readability

### 🎯 **Developer-Friendly**
- **Real-time URL Display**: Always shows current tab URL
- **Visual Feedback**: Color-coded status messages for all operations
- **Error Handling**: Graceful error handling with user-friendly messages
- **Responsive UI**: Clean, modern interface with DaisyUI components

## 🛠️ Installation

### From Source (Developer Mode)
1. Clone this repository:
   ```bash
   git clone https://github.com/nghiaomg/ChromeExtension-CookieSetter.git
   cd ChromeExtension-CookieSetter
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable **Developer mode** (toggle in top-right corner)

4. Click **Load unpacked** and select the project folder

5. The extension will appear in your Chrome toolbar

### From Chrome Web Store
*Coming soon - Extension will be published to Chrome Web Store*

## 📖 Usage Guide

### Basic Cookie Operations

1. **View Current Cookies**
   - Click the extension icon
   - Current cookies automatically load in the text area
   - Empty message appears if no cookies found

2. **Copy Cookies**
   - Click the green **Copy** button
   - Success feedback: "Copied!" (blue)
   - Error feedback: "No cookies!" or "Failed!" (red)

3. **Set New Cookies**
   - Edit cookies in the text area or paste new ones
   - Click **Set Cookies** button
   - Page automatically reloads with new cookies applied

### Advanced Features

4. **Cookie History Management**
   - View all previously set cookies organized by domain
   - Click any cookie entry to apply it to a new tab
   - Use **Clear All** to remove all saved cookies

5. **Smart Duplicate Prevention**
   - Extension automatically detects similar cookies (>90% similarity)
   - Prevents cluttering history with near-identical entries
   - Shows warning: "Cookie not saved - similar cookie already exists!"

## 🔧 Technical Details

### Architecture
- **Manifest V3**: Latest Chrome extension standard
- **Permissions**: `activeTab`, `scripting`, `storage`
- **Host Permissions**: `<all_urls>` for cross-domain cookie management
- **Storage**: Chrome local storage for cookie history persistence

### Key Components
- **popup.html**: Main UI with responsive design
- **popup.js**: Core logic with smart cookie management
- **manifest.json**: Extension configuration and permissions
- **icons/**: Extension icons in multiple sizes (16px, 48px, 128px)

### Cookie Similarity Algorithm
```javascript
// Normalizes cookies for comparison
function normalizeCookieString(cookieStr) {
  return cookieStr
    .split(';')
    .map(cookie => cookie.trim())
    .filter(cookie => cookie.length > 0)
    .sort() // Handle order differences
    .join(';')
    .toLowerCase();
}

// Calculates similarity percentage
function calculateCookieSimilarity(str1, str2) {
  // Returns 0.0 to 1.0 similarity score
  // Threshold: 0.9 (90% similar = duplicate)
}
```

## 🎨 UI/UX Features

- **Modern Design**: Clean interface with DaisyUI components
- **Responsive Layout**: Optimized 320px width for extension popup
- **Visual Feedback**: Color-coded messages and button states
- **Accessibility**: Proper focus management and keyboard navigation
- **Error Prevention**: Input validation and graceful error handling

## 🔄 Version History

### v2.0 (Current)
- ✨ **NEW**: Auto-load current website cookies
- ✨ **NEW**: One-click copy functionality with visual feedback
- ✨ **NEW**: Smart duplicate prevention algorithm
- ✨ **NEW**: Enhanced status messages with color coding
- 🔧 **IMPROVED**: UI/UX with better layout and responsiveness
- 🔧 **IMPROVED**: Code cleanup and performance optimization
- 🐛 **FIXED**: Removed duplicate functions and unused permissions

### v1.2 (Previous)
- Cookie history management
- Multi-domain support
- Automatic page reload
- Basic cookie setting functionality

## 🎯 Use Cases

### For Web Developers
- **Session Testing**: Quickly switch between different user sessions
- **Authentication Testing**: Test login states and user permissions
- **Feature Flags**: Toggle feature flags stored in cookies
- **A/B Testing**: Switch between different experiment variants

### For QA Testers
- **User Simulation**: Simulate different user types and preferences
- **Cross-browser Testing**: Maintain consistent cookie states
- **Bug Reproduction**: Recreate specific cookie-dependent scenarios
- **Performance Testing**: Test with various cookie loads

### For Security Researchers
- **Cookie Analysis**: Examine cookie structures and values
- **Session Management**: Test session handling and security
- **XSS Testing**: Analyze cookie-based vulnerabilities

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style
- Use consistent indentation (2 spaces)
- Follow JavaScript ES6+ standards
- Add comments for complex logic
- Test thoroughly before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**nghiaomg**
- GitHub: [@nghiaomg](https://github.com/nghiaomg)
- Extension: [Chrome Web Store](https://chrome.google.com/webstore) *(Coming Soon)*

## 🙏 Acknowledgments

- DaisyUI for the beautiful UI components
- Chrome Extension API documentation
- Open source community for inspiration and feedback

---

⭐ **Star this repository if you find it useful!**