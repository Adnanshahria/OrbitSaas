# ORBIT SaaS - Project Documentation

## Overview
A tech agency website showcasing full-stack software solutions for eCommerce, education platforms, mobile apps, cloud solutions, and enterprise applications.

## Tech Stack
- **Framework**: React + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State**: React Context (Language)
- **Icons**: Lucide React

## Key Features
- **Bilingual Support**: English & Bengali translations
- **Opening Animation**: IntroSplash component with logo reveal
- **Services**: 6 tech services displayed in 2x3 grid layout
- **Responsive Design**: Mobile-first approach

## Services Offered (6 items)
1. Custom eCommerce Solutions
2. Educational & Study Platforms
3. Personal Portfolios & Blogging Sites
4. Enterprise Web Applications
5. Mobile App Development
6. Cloud & DevOps Solutions

## File Structure
```
src/
├── components/
│   ├── IntroSplash.tsx      # Opening animation
│   ├── Navbar.tsx           # Navigation with language toggle
│   ├── HeroSection.tsx      # Hero with particles
│   ├── ServicesSection.tsx  # 6 service cards (2x3 grid)
│   └── ...other components
├── contexts/
│   └── LanguageContext.tsx  # English/Bengali toggle
├── lib/
│   └── translations.ts      # All text translations
└── pages/
    └── Index.tsx            # Main page with IntroSplash
```

## Running the Project
```bash
npm install
npm run dev    # Runs on http://localhost:8080
```

## SEO Optimizations
- **Domain**: orbitsaas.cloud
- **Canonical URL**: https://orbitsaas.cloud/
- **Keywords**: web development bangladesh, app development dhaka, ecommerce, mobile apps, cloud solutions + Bengali keywords
- **Structured Data**: Organization, LocalBusiness, WebSite schemas (JSON-LD)
- **Sitemap**: /sitemap.xml with hreflang support
- **Robots.txt**: All major search engine bots enabled
- **Open Graph & Twitter Cards**: Full social media previews
- **Geo Tags**: Bangladesh local SEO

## Post-Deployment Checklist
1. Submit sitemap to Google Search Console
2. Submit sitemap to Bing Webmaster Tools
3. Verify domain ownership in Google Search Console
4. Test structured data with Google Rich Results Test
5. Check page speed with Google PageSpeed Insights
