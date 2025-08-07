# Chef Assist - Deployment Manual

## 🚀 Deployment Guide for Chef Assist AI Culinary Interface

This comprehensive guide covers all deployment options for the Chef Assist cyberpunk cooking companion application.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [File Structure](#file-structure)
3. [Local Development](#local-development)
4. [Static Web Hosting](#static-web-hosting)
5. [Cloud Deployment](#cloud-deployment)
6. [PWA Installation](#pwa-installation)
7. [Performance Optimization](#performance-optimization)
8. [Security Considerations](#security-considerations)
9. [Troubleshooting](#troubleshooting)
10. [Maintenance](#maintenance)

---

## 🔧 Prerequisites

### System Requirements
- **Web Server**: Any HTTP server (Apache, Nginx, or static hosting)
- **Browser Support**: Modern browsers with ES6+ support
- **HTTPS**: Required for PWA features and voice recognition
- **Storage**: ~2MB for application files

### Required Files
```
chef-assist/
├── index.html          # Main application file
├── styles.css          # Cyberpunk styling
├── script.js           # Application logic
├── sw.js              # Service worker
├── manifest.json      # PWA manifest
└── DEPLOYMENT.md      # This file
```

---

## 🏠 Local Development

### Option 1: Python HTTP Server
```bash
# Navigate to project directory
cd chef-assist

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Access at: http://localhost:8000
```

### Option 2: Node.js HTTP Server
```bash
# Install http-server globally
npm install -g http-server

# Navigate to project directory
cd chef-assist

# Start server
http-server -p 8000

# Access at: http://localhost:8000
```

### Option 3: Live Server (VS Code)
1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

---

## 🌐 Static Web Hosting

### GitHub Pages

1. **Create Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Chef Assist cyberpunk app"
   git branch -M main
   git remote add origin https://github.com/username/chef-assist.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch
   - Select "/ (root)" folder
   - Click "Save"

3. **Access URL**: `https://username.github.io/chef-assist`

### Netlify

1. **Drag & Drop Deployment**
   - Visit [netlify.com](https://netlify.com)
   - Drag project folder to deploy area
   - Get instant URL

2. **Git Integration**
   ```bash
   # Connect GitHub repository
   # Netlify will auto-deploy on commits
   ```

3. **Custom Domain** (Optional)
   - Add custom domain in Netlify dashboard
   - Configure DNS records

### Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd chef-assist
   vercel
   # Follow prompts
   ```

3. **Production URL**: Provided after deployment

---

## ☁️ Cloud Deployment

### AWS S3 + CloudFront

1. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://chef-assist-app
   ```

2. **Upload Files**
   ```bash
   aws s3 sync . s3://chef-assist-app --exclude "*.md"
   ```

3. **Configure Static Website**
   ```bash
   aws s3 website s3://chef-assist-app \
     --index-document index.html \
     --error-document index.html
   ```

4. **Set Bucket Policy**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::chef-assist-app/*"
       }
     ]
   }
   ```

5. **Create CloudFront Distribution**
   - Origin: S3 bucket website endpoint
   - Enable HTTPS redirect
   - Configure caching rules

### Google Cloud Storage

1. **Create Bucket**
   ```bash
   gsutil mb gs://chef-assist-app
   ```

2. **Upload Files**
   ```bash
   gsutil -m cp -r * gs://chef-assist-app
   ```

3. **Make Public**
   ```bash
   gsutil iam ch allUsers:objectViewer gs://chef-assist-app
   ```

4. **Enable Website**
   ```bash
   gsutil web set -m index.html -e index.html gs://chef-assist-app
   ```

### Azure Static Web Apps

1. **Create Resource**
   - Use Azure Portal or CLI
   - Connect to GitHub repository

2. **Configuration File** (`.github/workflows/azure-static-web-apps.yml`)
   ```yaml
   name: Azure Static Web Apps CI/CD
   
   on:
     push:
       branches:
         - main
   
   jobs:
     build_and_deploy_job:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - name: Build And Deploy
           uses: Azure/static-web-apps-deploy@v1
           with:
             azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
             repo_token: ${{ secrets.GITHUB_TOKEN }}
             action: "upload"
             app_location: "/"
             output_location: "/"
   ```

---

## 📱 PWA Installation

### Enable PWA Features

1. **HTTPS Requirement**
   - PWA features require HTTPS
   - Use SSL certificate on production

2. **Service Worker Registration**
   - Already included in `script.js`
   - Handles offline caching

3. **Manifest Configuration**
   - `manifest.json` configured for installation
   - Custom icons and branding included

### Installation Process

1. **Desktop Installation**
   - Chrome: Click install icon in address bar
   - Edge: Click "Install Chef Assist" in menu
   - Firefox: Add to home screen option

2. **Mobile Installation**
   - iOS Safari: Share → Add to Home Screen
   - Android Chrome: Add to Home Screen prompt
   - Automatic installation banner

### Offline Functionality
- Recipe data cached locally
- Core functionality available offline
- Settings persist across sessions

---

## ⚡ Performance Optimization

### File Optimization

1. **Minify CSS**
   ```bash
   # Using cssnano
   npm install -g cssnano-cli
   cssnano styles.css styles.min.css
   ```

2. **Minify JavaScript**
   ```bash
   # Using terser
   npm install -g terser
   terser script.js -o script.min.js -c -m
   ```

3. **Optimize Images**
   - Use WebP format for better compression
   - Implement lazy loading for images

### Caching Strategy

1. **Service Worker Caching**
   ```javascript
   // Already implemented in sw.js
   // Caches core files for offline use
   ```

2. **HTTP Headers**
   ```apache
   # .htaccess for Apache
   <IfModule mod_expires.c>
     ExpiresActive On
     ExpiresByType text/css "access plus 1 year"
     ExpiresByType application/javascript "access plus 1 year"
     ExpiresByType text/html "access plus 1 hour"
   </IfModule>
   ```

3. **CDN Configuration**
   - Use CloudFlare or similar CDN
   - Enable Brotli compression
   - Configure edge caching rules

### Performance Monitoring

1. **Lighthouse Audit**
   ```bash
   # Install Lighthouse CLI
   npm install -g lighthouse
   
   # Run audit
   lighthouse https://your-domain.com --output html --output-path report.html
   ```

2. **Core Web Vitals**
   - Monitor LCP (Largest Contentful Paint)
   - Track FID (First Input Delay)
   - Measure CLS (Cumulative Layout Shift)

---

## 🔒 Security Considerations

### Content Security Policy

Add to `index.html` `<head>` section:
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com;
  font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com;
  script-src 'self';
  img-src 'self' data:;
  connect-src 'self';
">
```

### HTTPS Configuration

1. **Let's Encrypt (Free SSL)**
   ```bash
   # Using Certbot
   sudo certbot --nginx -d your-domain.com
   ```

2. **Force HTTPS Redirect**
   ```apache
   # .htaccess
   RewriteEngine On
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   ```

### Privacy Considerations
- Voice data processed locally (not sent to servers)
- Recipe data stored in browser localStorage
- No external tracking or analytics by default

---

## 🔧 Troubleshooting

### Common Issues

1. **Service Worker Not Registering**
   ```javascript
   // Check browser console for errors
   // Ensure HTTPS is enabled
   // Verify sw.js is accessible
   ```

2. **Voice Recognition Not Working**
   - Requires HTTPS connection
   - Check microphone permissions
   - Verify browser support

3. **PWA Not Installing**
   - Ensure manifest.json is valid
   - Check service worker registration
   - Verify HTTPS requirement

4. **Particles Not Animating**
   - Check JavaScript console for errors
   - Verify browser supports requestAnimationFrame
   - Ensure sufficient device performance

### Debug Mode

Enable debug logging:
```javascript
// Add to script.js for debugging
console.log('Chef Assist Debug Mode Enabled');
localStorage.setItem('chefAssistDebug', 'true');
```

### Performance Issues

1. **Reduce Particle Count**
   ```javascript
   // In script.js, reduce particle count
   for (let i = 0; i < 25; i++) { // Reduced from 50
   ```

2. **Disable Animations**
   ```css
   /* Add to styles.css for low-end devices */
   @media (prefers-reduced-motion: reduce) {
     * {
       animation: none !important;
       transition: none !important;
     }
   }
   ```

---

## 🔄 Maintenance

### Regular Updates

1. **Security Updates**
   - Monitor for browser security updates
   - Update external dependencies
   - Review and update CSP headers

2. **Performance Monitoring**
   - Run monthly Lighthouse audits
   - Monitor Core Web Vitals
   - Check for broken external links

3. **Browser Compatibility**
   - Test on latest browser versions
   - Verify PWA functionality
   - Check voice recognition features

### Backup Strategy

1. **Code Repository**
   ```bash
   # Regular commits to version control
   git add .
   git commit -m "Update: [description]"
   git push origin main
   ```

2. **Deployment Backup**
   - Keep previous deployment versions
   - Document configuration changes
   - Maintain rollback procedures

### Analytics (Optional)

1. **Google Analytics 4**
   ```html
   <!-- Add to index.html head -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'GA_MEASUREMENT_ID');
   </script>
   ```

2. **Privacy-Focused Analytics**
   - Consider Plausible or Fathom Analytics
   - Respect user privacy preferences
   - Implement cookie consent if required

---

## 📞 Support

### Documentation
- **GitHub Issues**: Report bugs and feature requests
- **Wiki**: Additional documentation and examples
- **Discussions**: Community support and questions

### Contact Information
- **Developer**: [Your contact information]
- **Repository**: [GitHub repository URL]
- **Demo**: [Live demo URL]

---

## 📄 License

This deployment manual is part of the Chef Assist project. Please refer to the main project license for usage terms.

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Compatibility**: Modern browsers with ES6+ support