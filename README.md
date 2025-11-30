<div align="center">

# 🎬 CinePulse

### Your Premium Movie Companion

![Version](https://img.shields.io/badge/version-1.0.3-blueviolet?style=for-the-badge)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

**A premium, feature-rich movie discovery platform with intelligent recommendations, comprehensive analytics, and social interactions.**

[📱 Download](#-download) • [✨ Features](#-features) • [🚀 Quick Start](#-quick-start) • [🛠️ Tech Stack](#️-tech-stack)

</div>

---

## 📱 Download

<div align="center">

[![Download APK](https://img.shields.io/badge/Download_APK-3DDC84?style=for-the-badge&logo=android&logoColor=white)](https://github.com/sapariyaneel/CinePulse/releases)

**Get the latest version from the [Releases](https://github.com/sapariyaneel/CinePulse/releases) tab**

</div>

---

## ✨ Features

### 🏆 Premium Features

**📚 Smart Watchlist Management**
- Organize movies into Want to Watch, Watching, and Completed categories
- Quick category switching with live counts
- Premium gradient badges and seamless UI

**📊 Movie Statistics Dashboard**
- Total watch time calculator (days/hours/minutes)
- Genre breakdown with visual progress bars
- Watchlist analytics by category
- Movie records tracking (longest/shortest films)
- Monthly and yearly review statistics

**🧠 Personalized Recommendations**
- Genre preference analysis based on viewing history
- "Because you like [Genre]" intelligent suggestions
- Top 5 favorite genres with statistics
- Similar movies recommendations

### 🌟 Core Features

**📝 Rating & Reviews**
- Comprehensive rating analytics dashboard
- Visual rating distribution charts
- Recent ratings timeline with color-coded badges
- Write and manage detailed reviews

**👍 Social Engagement**
- Like ❤️ and Helpful 👍 reactions on reviews
- Real-time reaction counts
- Guest-friendly viewing mode
- Community interaction features

**🔥 Discovery & Trending**
- Algorithm-based trending (top 9 movies in 30 days)
- Smart search with history tracking
- Detailed movie information with cast & crew
- Pull-to-refresh across all screens
- Latest releases section

**📱 Responsive Design**
- Seamless adaptation to all screen sizes
- Portrait and landscape orientation support
- Optimized for phones and tablets
- Dynamic layouts using NativeWind v4

---

## 📊 Project Overview

<div align="center">

| Premium Features | Custom Components | Database Tables | TypeScript Coverage |
|:---------------:|:-----------------:|:---------------:|:-------------------:|
| **5+** | **15+** | **10+** | **100%** |

</div>

---

## 🆕 What's New in v1.0.3

**Automatic Update Detection**
  - Automatic update check on app launch
  - Semantic versioning used for accurate version comparison
  - Supports both forced and optional update flows

**Device-Specific APK Distribution**
  - Detects device CPU architecture automatically
  - Smart APK selection with universal fallback option
  - Reduced download size based on device ABI

**Intelligent Permission Management**
  - Pre-download permission checks to avoid wasted bandwidth
  - Detects when users return from Settings after granting permissions
  - Seamless continuation of downloads without manual retry
  - Clear visual guidance during permission requests

**⬇️ Download Management**
- Real-time download progress with visual indicators
- Cancellable downloads with automatic cleanup
- Resume support for interrupted downloads
- Efficient file handling in the app cache directory

**📦 Installation Flow**
- Integrated with native Android package installer (via FileProvider)
- Automatic handling of unknown-sources permissions (Android 8.0+)
- Direct navigation to installation-related settings
- Smart persistence of APK file until installation succeeds

**🧑‍💻 User Experience**
- Forced updates that prevent app usage until completed
- Optional updates with “Remind Me Later” option
- Full-screen modals covering system UI for consistent design
- Clear and actionable error messages
- Visually distinct states for each update phase

**🚀 Release Management**
- Interactive CLI tools for creating and updating releases
- Supabase integration for centralized release metadata handling
- Support for version-specific configurations and release notes
- URL validation and accessibility checks for APK links

---

## 🛠️ Tech Stack

<div align="center">

<table>
<tr>
<td align="center" width="20%">
<img src="https://skillicons.dev/icons?i=react" width="48" height="48" alt="React Native" />
<br><strong>React Native</strong>
<br><sub>CLI v0.82</sub>
</td>
<td align="center" width="20%">
<img src="https://skillicons.dev/icons?i=typescript" width="48" height="48" alt="TypeScript" />
<br><strong>TypeScript</strong>
<br><sub>Type Safety</sub>
</td>
<td align="center" width="20%">
<img src="https://skillicons.dev/icons?i=tailwind" width="48" height="48" alt="NativeWind" />
<br><strong>NativeWind v4</strong>
<br><sub>Styling</sub>
</td>
<td align="center" width="20%">
<img src="https://skillicons.dev/icons?i=supabase" width="48" height="48" alt="Supabase" />
<br><strong>Supabase</strong>
<br><sub>Backend & Auth</sub>
</td>
<td align="center" width="20%">
<img src="https://skillicons.dev/icons?i=postgres" width="48" height="48" alt="PostgreSQL" />
<br><strong>PostgreSQL</strong>
<br><sub>Database</sub>
</td>
</tr>
<tr>
<td align="center" width="20%">
<img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg" width="48" height="48" alt="TMDB" />
<br><strong>TMDB API</strong>
<br><sub>Movie Data</sub>
</td>
<td align="center" width="20%">
<img src="https://skillicons.dev/icons?i=github" width="48" height="48" alt="GitHub" />
<br><strong>GitHub</strong>
<br><sub>Version Control</sub>
</td>
<td align="center" width="20%">
<img src="https://skillicons.dev/icons?i=vscode" width="48" height="48" alt="VS Code" />
<br><strong>VS Code</strong>
<br><sub>IDE</sub>
</td>
<td align="center" width="20%">
</td>
<td align="center" width="20%">
</td>
</tr>
</table>

</div>

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Java Development Kit (JDK) 17
- Android Studio & Android SDK
- [TMDB API Key](https://www.themoviedb.org/settings/api)
- [Supabase Account](https://supabase.com)

### Installation Steps

**1. Clone the repository**
```bash
git clone https://github.com/sapariyaneel/CinePulse.git
cd CinePulse
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure environment variables**

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Update `.env` with your credentials:
```env
MOVIE_API_KEY=your_tmdb_api_key_here
SUPABASE_PROJECT_URL=https://your-project.supabase.co
SUPABASE_API_KEY=your_supabase_anon_key_here
```

**4. Set up Supabase database**

Run these SQL scripts in your Supabase SQL Editor (in order):
1. `SUPABASE_SCHEMA.sql` - Core tables
2. `TRENDING_MOVIES_SCHEMA.sql` - Trending algorithm
3. `WATCHLIST_CATEGORIES_SCHEMA.sql` - Watchlist features
4. `REVIEW_REACTIONS_SCHEMA.sql` - Review reactions
5. `FIX_ALL_RLS_POLICIES.sql` - Security policies

**5. Start development server**
```bash
npm start
```

**6. Run on Android**
```bash
npm run android
```

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── MovieCard.tsx
│   ├── TrendingCard.tsx
│   └── WatchlistCard.tsx
├── screens/             # Application screens
│   ├── HomeScreen.tsx
│   ├── SearchScreen.tsx
│   ├── SavedScreen.tsx
│   └── ProfileScreen.tsx
├── navigation/          # Navigation configuration
│   └── RootNavigator.tsx
├── services/            # API and backend services
│   ├── api.ts           # TMDB API integration
│   ├── supabase.ts      # Supabase client
│   └── authService.ts   # Authentication
├── assets/              # Images, fonts, static files
├── constants/           # App constants
├── interfaces/          # TypeScript definitions
└── types/               # Global types
```

---

## 🗄️ Database Architecture

### Core Tables
- **users** - User profiles with authentication data
- **watchlist_categories** - Custom watchlist categories
- **watchlist_items** - Movies with category assignments
- **reviews** - Movie reviews with ratings
- **review_reactions** - Social engagement (likes, helpful)
- **movie_searches** - View tracking for trending algorithm

### Views & Functions
- **trending_movies** - Top 9 most viewed movies (30 days)
- **review_reaction_counts** - Aggregated reaction statistics
- **check_username_available()** - Username validation
- **create_default_categories()** - Auto-setup for new users

### Security
- Row Level Security (RLS) enabled on all tables
- User-scoped data with proper RLS policies
- Public read access for reviews and profiles
- Authenticated write access for user data
- Environment variables for API keys

---

## 🎯 Key Technical Implementations

### 🔥 Trending Algorithm
Movies are ranked by view count over the last 30 days. Each movie detail view is tracked in the `movie_searches` table, and the `trending_movies` view aggregates this data to display the top 9 unique movies.

### 🧠 Recommendation Engine
The system analyzes watchlist and review data to extract genre preferences, calculates genre weights, and provides personalized suggestions based on your top 3 favorite genres using TMDB API data.

### 📊 Real-time Analytics
Statistics dashboard performs real-time aggregate calculations across multiple tables, fetches runtime data from TMDB API for total watch time, and groups movies by genre and category for visual breakdowns.

### 👍 Social Reactions
Users can react to reviews with Like and Helpful reactions. A PostgreSQL view efficiently aggregates reaction counts with unique constraints to prevent duplicate reactions.

---

## 📸 Screenshots

<div align="center">

### Authentication
<p>
  <img width="300" alt="login" src="https://github.com/user-attachments/assets/35356066-75a2-46d2-8752-1bbc90fe400c" />
  <img width="300" alt="register" src="https://github.com/user-attachments/assets/0a08fb6a-d433-4fb9-8988-079b02a9e54f" />
</p>

### Home & Details
<p>
  <img width="300" alt="home-screen" src="https://github.com/user-attachments/assets/aa2c7a33-af5a-41e9-9677-4fed46ecfb8f" />
  <img width="300" alt="movie-details" src="https://github.com/user-attachments/assets/195c779b-e052-4e29-b210-ed7ea9222f94" />
</p>

### Search & Watchlist
<p>
  <img width="300" alt="search-screen" src="https://github.com/user-attachments/assets/0e679805-f1fe-41a0-9576-c275fc36bf07" />
  <img width="300" alt="watchlist" src="https://github.com/user-attachments/assets/27013df5-37f8-4a03-8e0e-bcb3036629f5" />
</p>

### Profile & Analytics
<p>
  <img width="300" alt="profile-1" src="https://github.com/user-attachments/assets/7a9b4553-e72c-4a56-8627-d031d1ce499d" />
  <img width="300" alt="profile-2" src="https://github.com/user-attachments/assets/1664a187-d9f3-407a-a3aa-0550a4ba7597" />
</p>

<p>
  <img width="300" alt="profile-3" src="https://github.com/user-attachments/assets/96e99752-a61b-48a7-b357-f8d4d6a91b79" />
  <img width="300" alt="profile-4" src="https://github.com/user-attachments/assets/2af4882c-03db-4753-8320-0fb3c415206d" />
</p>

</div>

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 👨‍💻 Developer

<div align="center">

### Neel Sapariya

*Full-Stack Developer | React Native Enthusiast | UI/UX Designer*

Passionate about creating beautiful, functional mobile applications with cutting-edge technology.

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/sapariyaneel)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:workwithneel@outlook.com)

</div>

---

## 📝 License

MIT License - Copyright © 2025 Neel Sapariya

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software.

---

<div align="center">

**⭐ Star this project if you find it helpful! ⭐**

Made with ❤️ by Neel Sapariya

*Built with React Native • Powered by Supabase • Designed with Passion*

</div>