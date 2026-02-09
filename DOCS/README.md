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
