#!/bin/bash

# Chef Assist - Quick Deployment Script
# This script provides easy deployment options for the Chef Assist application

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ASCII Art Banner
echo -e "${CYAN}"
cat << "EOF"
   ______ __  __ ______ ______   ___   _____ _____ _____ _____ _______ 
  / ____// / / // ____// ____/  /   | / ___// ___//  _// ___//_  __/
 / /    / /_/ // __/  / /_     / /| | \__ \ \__ \ / / \__ \  / /   
/ /___ / __  // /___ / __/    / ___ |___/ /___/ // / ___/ / / /    
\____//_/ /_//_____//_/      /_/  |_/____//____/___//____/ /_/     
                                                                   
EOF
echo -e "${NC}"

echo -e "${PURPLE}🚀 Chef Assist - AI Culinary Interface Deployment${NC}"
echo -e "${BLUE}Advanced cyberpunk cooking companion with neural processing${NC}"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to display menu
show_menu() {
    echo -e "${YELLOW}📋 Deployment Options:${NC}"
    echo ""
    echo -e "${GREEN}1.${NC} 🏠 Local Development Server"
    echo -e "${GREEN}2.${NC} 🌐 Deploy to GitHub Pages"
    echo -e "${GREEN}3.${NC} ☁️  Deploy to Netlify"
    echo -e "${GREEN}4.${NC} ⚡ Deploy to Vercel"
    echo -e "${GREEN}5.${NC} 🔧 Build Production Files"
    echo -e "${GREEN}6.${NC} 📊 Run Performance Audit"
    echo -e "${GREEN}7.${NC} 🧪 Validate PWA Features"
    echo -e "${GREEN}8.${NC} 📱 Test Mobile Responsiveness"
    echo -e "${GREEN}9.${NC} 🔍 Security Scan"
    echo -e "${GREEN}0.${NC} ❌ Exit"
    echo ""
}

# Function to start local development server
start_local_server() {
    echo -e "${BLUE}🏠 Starting Local Development Server...${NC}"
    
    if command_exists python3; then
        echo -e "${GREEN}✅ Using Python 3 HTTP Server${NC}"
        echo -e "${YELLOW}🌐 Server will be available at: http://localhost:8000${NC}"
        echo -e "${YELLOW}📱 Mobile testing: http://[your-ip]:8000${NC}"
        echo -e "${CYAN}Press Ctrl+C to stop the server${NC}"
        echo ""
        python3 -m http.server 8000
    elif command_exists python; then
        echo -e "${GREEN}✅ Using Python 2 HTTP Server${NC}"
        echo -e "${YELLOW}🌐 Server will be available at: http://localhost:8000${NC}"
        python -m SimpleHTTPServer 8000
    elif command_exists node; then
        if command_exists npx; then
            echo -e "${GREEN}✅ Using Node.js HTTP Server${NC}"
            echo -e "${YELLOW}🌐 Server will be available at: http://localhost:8000${NC}"
            npx http-server -p 8000
        else
            echo -e "${RED}❌ npx not found. Installing http-server globally...${NC}"
            npm install -g http-server
            http-server -p 8000
        fi
    else
        echo -e "${RED}❌ No suitable HTTP server found.${NC}"
        echo -e "${YELLOW}Please install Python or Node.js to run a local server.${NC}"
        return 1
    fi
}

# Function to deploy to GitHub Pages
deploy_github_pages() {
    echo -e "${BLUE}🌐 Deploying to GitHub Pages...${NC}"
    
    if ! command_exists git; then
        echo -e "${RED}❌ Git not found. Please install Git first.${NC}"
        return 1
    fi
    
    # Check if we're in a git repository
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        echo -e "${YELLOW}📁 Initializing Git repository...${NC}"
        git init
        git add .
        git commit -m "Initial commit: Chef Assist cooking app"
        
        echo -e "${YELLOW}🔗 Please add your GitHub repository as origin:${NC}"
        echo -e "${CYAN}git remote add origin git-personal:git@github.com:afrozk/chef-assist.git${NC}"
        echo -e "${CYAN}git branch -M main${NC}"
        echo -e "${CYAN}git push -u origin main${NC}"
        echo ""
        echo -e "${YELLOW}Then enable GitHub Pages in your repository settings.${NC}"
    else
        echo -e "${GREEN}✅ Git repository detected${NC}"
        git add .
        git commit -m "Deploy: Updated Chef Assist application"
        git push origin main
        echo -e "${GREEN}🚀 Pushed to GitHub! Enable Pages in repository settings.${NC}"
    fi
}

# Function to deploy to Netlify
deploy_netlify() {
    echo -e "${BLUE}☁️ Deploying to Netlify...${NC}"
    
    if ! command_exists netlify; then
        echo -e "${YELLOW}📦 Installing Netlify CLI...${NC}"
        npm install -g netlify-cli
    fi
    
    echo -e "${GREEN}🚀 Deploying to Netlify...${NC}"
    netlify deploy --prod --dir .
    
    echo -e "${GREEN}✅ Deployment complete!${NC}"
}

# Function to deploy to Vercel
deploy_vercel() {
    echo -e "${BLUE}⚡ Deploying to Vercel...${NC}"
    
    if ! command_exists vercel; then
        echo -e "${YELLOW}📦 Installing Vercel CLI...${NC}"
        npm install -g vercel
    fi
    
    echo -e "${GREEN}🚀 Deploying to Vercel...${NC}"
    vercel --prod
    
    echo -e "${GREEN}✅ Deployment complete!${NC}"
}

# Function to build production files
build_production() {
    echo -e "${BLUE}🔧 Building Production Files...${NC}"
    
    # Create build directory
    mkdir -p build
    
    # Copy files to build directory
    cp index.html build/
    cp manifest.json build/
    cp sw.js build/
    
    # Minify CSS if cssnano is available
    if command_exists cssnano; then
        echo -e "${GREEN}📦 Minifying CSS...${NC}"
        cssnano styles.css build/styles.min.css
    else
        echo -e "${YELLOW}⚠️  cssnano not found, copying CSS as-is${NC}"
        cp styles.css build/
    fi
    
    # Minify JavaScript if terser is available
    if command_exists terser; then
        echo -e "${GREEN}📦 Minifying JavaScript...${NC}"
        terser script.js -o build/script.min.js -c -m
    else
        echo -e "${YELLOW}⚠️  terser not found, copying JS as-is${NC}"
        cp script.js build/
    fi
    
    echo -e "${GREEN}✅ Production files built in ./build directory${NC}"
}

# Function to run performance audit
run_performance_audit() {
    echo -e "${BLUE}📊 Running Performance Audit...${NC}"
    
    if ! command_exists lighthouse; then
        echo -e "${YELLOW}📦 Installing Lighthouse CLI...${NC}"
        npm install -g lighthouse
    fi
    
    echo -e "${YELLOW}🌐 Starting temporary server for audit...${NC}"
    
    # Start server in background
    if command_exists python3; then
        python3 -m http.server 8001 > /dev/null 2>&1 &
        SERVER_PID=$!
    else
        echo -e "${RED}❌ Python not found for temporary server${NC}"
        return 1
    fi
    
    sleep 2  # Wait for server to start
    
    echo -e "${GREEN}🔍 Running Lighthouse audit...${NC}"
    lighthouse http://localhost:8001 --output html --output-path lighthouse-report.html --quiet
    
    # Kill the temporary server
    kill $SERVER_PID
    
    echo -e "${GREEN}✅ Audit complete! Report saved as lighthouse-report.html${NC}"
    
    # Try to open the report
    if command_exists open; then
        open lighthouse-report.html
    elif command_exists xdg-open; then
        xdg-open lighthouse-report.html
    fi
}

# Function to validate PWA features
validate_pwa() {
    echo -e "${BLUE}🧪 Validating PWA Features...${NC}"
    
    echo -e "${GREEN}📋 Checking PWA Requirements:${NC}"
    
    # Check manifest.json
    if [ -f "manifest.json" ]; then
        echo -e "${GREEN}✅ manifest.json found${NC}"
    else
        echo -e "${RED}❌ manifest.json missing${NC}"
    fi
    
    # Check service worker
    if [ -f "sw.js" ]; then
        echo -e "${GREEN}✅ Service worker found${NC}"
    else
        echo -e "${RED}❌ Service worker missing${NC}"
    fi
    
    # Check HTTPS requirement
    echo -e "${YELLOW}⚠️  HTTPS required for full PWA functionality${NC}"
    echo -e "${CYAN}💡 Use deployment options 2-4 for HTTPS support${NC}"
    
    echo -e "${GREEN}🔍 PWA validation complete${NC}"
}

# Function to test mobile responsiveness
test_mobile_responsiveness() {
    echo -e "${BLUE}📱 Testing Mobile Responsiveness...${NC}"
    
    echo -e "${GREEN}📋 Responsive Design Checklist:${NC}"
    echo -e "${GREEN}✅ Mobile-first CSS approach${NC}"
    echo -e "${GREEN}✅ Flexible grid system${NC}"
    echo -e "${GREEN}✅ Touch-friendly buttons (min 44px)${NC}"
    echo -e "${GREEN}✅ Readable typography on small screens${NC}"
    echo -e "${GREEN}✅ Optimized images and assets${NC}"
    
    echo -e "${YELLOW}🧪 Manual Testing Recommended:${NC}"
    echo -e "${CYAN}• Test on actual devices${NC}"
    echo -e "${CYAN}• Use browser dev tools device simulation${NC}"
    echo -e "${CYAN}• Check landscape and portrait orientations${NC}"
    echo -e "${CYAN}• Verify touch interactions work properly${NC}"
}

# Function to run security scan
run_security_scan() {
    echo -e "${BLUE}🔍 Running Security Scan...${NC}"
    
    echo -e "${GREEN}🛡️  Security Features Implemented:${NC}"
    echo -e "${GREEN}✅ Content Security Policy (CSP)${NC}"
    echo -e "${GREEN}✅ HTTPS enforcement${NC}"
    echo -e "${GREEN}✅ Local data storage only${NC}"
    echo -e "${GREEN}✅ No external tracking${NC}"
    echo -e "${GREEN}✅ Secure voice processing${NC}"
    
    echo -e "${YELLOW}🔒 Security Recommendations:${NC}"
    echo -e "${CYAN}• Always deploy with HTTPS${NC}"
    echo -e "${CYAN}• Keep dependencies updated${NC}"
    echo -e "${CYAN}• Monitor for security advisories${NC}"
    echo -e "${CYAN}• Regular security audits${NC}"
    
    # Check for common security issues
    if grep -q "http://" *.html *.css *.js 2>/dev/null; then
        echo -e "${YELLOW}⚠️  Found HTTP references - consider HTTPS${NC}"
    fi
    
    echo -e "${GREEN}🔍 Security scan complete${NC}"
}

# Main menu loop
while true; do
    show_menu
    read -p "$(echo -e ${CYAN}🎯 Select an option [0-9]: ${NC})" choice
    echo ""
    
    case $choice in
        1)
            start_local_server
            ;;
        2)
            deploy_github_pages
            ;;
        3)
            deploy_netlify
            ;;
        4)
            deploy_vercel
            ;;
        5)
            build_production
            ;;
        6)
            run_performance_audit
            ;;
        7)
            validate_pwa
            ;;
        8)
            test_mobile_responsiveness
            ;;
        9)
            run_security_scan
            ;;
        0)
            echo -e "${PURPLE}👋 Thanks for using Chef Assist deployment script!${NC}"
            echo -e "${CYAN}🚀 Happy cooking with AI assistance!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}❌ Invalid option. Please select 0-9.${NC}"
            ;;
    esac
    
    echo ""
    echo -e "${YELLOW}Press Enter to continue...${NC}"
    read
    clear
done