<div align="center">

# 🎬 CinePulse

### Your Premium Movie Companion

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blueviolet?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">

  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase">
</p>

<p align="center">
  <strong>A premium, feature-rich movie discovery platform with intelligent recommendations, comprehensive analytics, and social interactions.</strong>
</p>

<p align="center">
  <a href="#-download">📱 Download</a> •
  <a href="#-features">🌟 Features</a> •
  <a href="#-quick-start">🚀 Quick Start</a> •
  <a href="#-tech-stack">🛠️ Tech Stack</a> •
  <a href="#-developer">👨‍💻 Developer</a>
</p>

</div>

## 📱 Download

<div align="center">

### Get CinePulse on Android

<p>
  <a href="https://github.com/Neel-SoftwarePRYM/React-native-movie-app/releases">
    <img src="https://img.shields.io/badge/Download_APK-3DDC84?style=for-the-badge&logo=android&logoColor=white" alt="Download APK">
  </a>
</p>

<p>
  Download the latest version from the <strong>Releases</strong> tab
</p>

</div>

## 🌟 Features

<table>
<tr>
<td width="50%">

### 🏆 Premium Features

#### 📚 Watchlist with Categories
- Organize movies into **Want to Watch**, **Watching**, and **Completed**
- Smart category filters with live counts
- Single-tap category switching
- Premium gradient badges
- Seamless migration from saved movies

#### 📊 Movie Statistics Dashboard
- **Total watch time** calculator (days/hours/minutes)
- **Genre breakdown** with visual progress bars
- **Watchlist breakdown** by category
- **Movie records** (longest/shortest)
- **Reviews this month/year** tracking
- Real-time aggregate calculations

#### 🧠 Personalized Recommendations
- Smart **genre preference** analysis
- "**Because you like [Genre]**" suggestions
- Top 5 favorite genres with statistics
- Similar movies based on viewing history
- Fallback to popular movies for new users

</td>
<td width="50%">

### ✨ Core Features

#### 📝 Rating Analytics
- Comprehensive **rating analytics** dashboard
- Visual **rating distribution** charts
- Recent ratings timeline
- Color-coded rating badges
- Average rating calculations

#### 👍 Review Reactions
- **Like** (❤️) and **Helpful** (👍) reactions
- Real-time reaction counts
- Toggle reactions on/off
- Guest-friendly viewing
- Prevents self-reactions

#### 🔥 Trending & Discovery
- Algorithm-based trending (top 9 movies)
- Smart search with history
- Movie details with cast & crew
- Guest mode for browsing
- Pull-to-refresh everywhere

</td>
</tr>
</table>


## 🛠️ Tech Stack

<div align="center">

<table>
<tr>
<td align="center" width="25%">
<img src="https://skillicons.dev/icons?i=react" width="48" height="48" alt="React Native" />
<br><strong>React Native</strong>
<br><sub>CLI v0.82</sub>
</td>
<td align="center" width="25%">
<img src="https://skillicons.dev/icons?i=typescript" width="48" height="48" alt="TypeScript" />
<br><strong>TypeScript</strong>
<br><sub>Type Safety</sub>
</td>
<td align="center" width="25%">
<img src="https://skillicons.dev/icons?i=tailwind" width="48" height="48" alt="NativeWind" />
<br><strong>NativeWind v4</strong>
<br><sub>Styling</sub>
</td>
<td align="center" width="25%">
<img src="https://skillicons.dev/icons?i=supabase" width="48" height="48" alt="Supabase" />
<br><strong>Supabase</strong>
<br><sub>Backend & Auth</sub>
</td>
</tr>
<tr>
<td align="center" width="25%">
<img src="https://skillicons.dev/icons?i=postgres" width="48" height="48" alt="PostgreSQL" />
<br><strong>PostgreSQL</strong>
<br><sub>Database</sub>
</td>
<td align="center" width="25%">
<img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg" width="48" height="48" alt="TMDB" />
<br><strong>TMDB API</strong>
<br><sub>Movie Data</sub>
</td>
<td align="center" width="25%">
<img src="https://skillicons.dev/icons?i=github" width="48" height="48" alt="GitHub" />
<br><strong>GitHub</strong>
<br><sub>Version Control</sub>
</td>
<td align="center" width="25%">
<img src="https://skillicons.dev/icons?i=vscode" width="48" height="48" alt="VS Code" />
<br><strong>VS Code</strong>
<br><sub>IDE</sub>
</td>
</tr>
</table>

</div>

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Java Development Kit (JDK) 17
- Android Studio & Android SDK
- TMDB API key ([Get it here](https://www.themoviedb.org/settings/api))
- Supabase account ([Sign up here](https://supabase.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Neel-SoftwarePRYM/React-native-movie-app.git
   cd React-native-movie-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your keys:
   ```env
   MOVIE_API_KEY=your_tmdb_api_key_here
   SUPABASE_PROJECT_URL=https://your-project.supabase.co
   SUPABASE_API_KEY=your_supabase_anon_key_here
   ```

4. **Set up Supabase database**
   
   Run these SQL scripts in your Supabase SQL Editor (in order):
   ```bash
   1. SUPABASE_SCHEMA.sql              # Core tables
   2. TRENDING_MOVIES_SCHEMA.sql       # Trending algorithm
   3. WATCHLIST_CATEGORIES_SCHEMA.sql  # Watchlist features
   4. REVIEW_REACTIONS_SCHEMA.sql      # Review reactions
   5. FIX_ALL_RLS_POLICIES.sql         # Security policies
   ```

5. **Start the Metro Bundler**
   ```bash
   npm start
   ```

6. **Run on Android**
   ```bash
   npm run android
   ```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── MovieCard.tsx
│   ├── TrendingCard.tsx
│   ├── WatchlistCard.tsx
│   └── ...
├── screens/             # Application screens
│   ├── HomeScreen.tsx
│   ├── SearchScreen.tsx
│   ├── SavedScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── MovieDetailsScreen.tsx
│   └── ...
├── navigation/          # Navigation configuration
│   ├── RootNavigator.tsx
│   └── types.ts
├── services/            # API and backend services
│   ├── api.ts                   # TMDB API integration
│   ├── supabase.ts              # Supabase client
│   ├── authService.ts           # Authentication
│   ├── trendingService.ts       # Trending movies
│   └── ...
├── assets/              # Images, fonts, and static files
├── constants/           # App constants (colors, icons)
├── interfaces/          # TypeScript definitions
└── types/               # Global types
```

## 🗄️ Database Schema

### Tables
- **users** - User profiles with username, name, email, avatar
- **watchlist_categories** - User's custom watchlist categories
- **watchlist_items** - Movies in watchlist with category assignment
- **reviews** - Movie reviews with ratings and text
- **review_reactions** - Like and helpful reactions on reviews
- **movie_searches** - Tracks movie views for trending algorithm

### Views
- **trending_movies** - Top 9 most viewed movies in last 30 days
- **review_reaction_counts** - Aggregated reaction counts per review

### Functions & Triggers
- **check_username_available()** - Validates username uniqueness
- **create_default_categories()** - Auto-creates categories for new users
- **create_categories_for_existing_users()** - Migration for existing users

## 🔐 Security

- **Row Level Security (RLS)** enabled on all tables
- **Secure database functions** for username validation
- **Password hashing** handled by Supabase Auth
- **Environment variables** for sensitive API keys
- **Guest mode** with read-only permissions
- **User-scoped data** with proper RLS policies
- **Public read access** for reviews and user profiles
- **Authenticated write access** for user data

## 🎯 Key Features Explained

### 🔥 Trending Algorithm
Movies are ranked by view count in the last 30 days. Every time a user views a movie details page, it's tracked in the `movie_searches` table. The `trending_movies` view aggregates this data to show the top 9 unique movies.

### 🧠 Recommendation Engine
Analyzes your watchlist and reviews to extract genre preferences. Fetches movie details from TMDB API, calculates genre weights, and provides personalized "Because you like [Genre]" suggestions from your top 3 favorite genres.

### 📊 Statistics Dashboard
Real-time aggregate calculations across multiple tables. Fetches runtime data from TMDB API to calculate total watch time. Groups movies by genre and category to provide visual breakdowns with percentages.

### 👍 Review Reactions
Users can react to reviews with Like (❤️) and Helpful (👍). Reactions are stored in a separate table with unique constraints to prevent duplicates. A PostgreSQL view efficiently aggregates reaction counts for display.

### 📚 Watchlist Categories
Each user gets three default categories (Want to Watch, Watching, Completed) automatically created via database triggers. Movies can be assigned to one category at a time, with easy switching through a premium modal interface.

## 📸 Screenshots

<div align="center">

### Authentication & Onboarding

<table>
<tr>
<td width="33%">
<img width="1080" height="2400" alt="image" src="https://github.com/user-attachments/assets/f46f8866-5799-4120-95bc-e06413bfa615" />
<p align="center"><strong>Login Screen</strong></p>
</td>
<td width="33%">
<img width="1080" height="2400" alt="image" src="https://github.com/user-attachments/assets/b4a3fc62-b0f5-4414-83a8-eeb15360e302" />
<p align="center"><strong>Sign Up Screen</strong></p>
</td>
</tr>
</table>

### Main Features

<table>
<tr>
<td width="33%">
<img width="1080" height="2304" alt="image" src="https://github.com/user-attachments/assets/cac0fa5f-fd20-4661-ae4e-9a03a33c861a" />
<p align="center"><strong>Home - Trending Movies</strong></p>
</td>
<td width="33%">
<img width="1080" height="2300" alt="image" src="https://github.com/user-attachments/assets/9c55d77f-c50b-4005-85cf-9b4662ded2fb" />
<p align="center"><strong>Search & Discovery</strong></p>
</td>
<td width="33%">
<img width="1080" height="2400" alt="image" src="https://github.com/user-attachments/assets/ad27c6b4-861d-4baa-a4e2-c00a55943ade" />
<p align="center"><strong>Movie Details</strong></p>
</td>
</tr>
</table>

### User Profile & Watchlist

<table>
<tr>
<td width="33%">
<img width="1080" height="2308" alt="image" src="https://github.com/user-attachments/assets/35426028-3059-4b34-9a56-b78b92fc3f84" />
<p align="center"><strong>Categorized Watchlist</strong></p>
</td>
<td width="33%">
<img width="1080" height="2312" alt="image" src="https://github.com/user-attachments/assets/b24d3376-9174-4350-a342-6a8fe6954998" />
<p align="center"><strong>Profile Overview</strong></p>
</td>
<td width="33%">
<img width="1080" height="2312" alt="image" src="https://github.com/user-attachments/assets/32dc0490-de62-459f-bb03-040c4943aa93" />
<p align="center"><strong>Statistics Dashboard</strong></p>
</td>
</tr>
</table>

</div>

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues and pull requests.

1. Fork the repository
2. Create your feature branch (e.g., `git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to your branch (e.g., `git push origin feature/AmazingFeature`)
5. Open a Pull Request

**Note:** Branch names are examples - create descriptive branch names based on your feature.

## 👨‍💻 Developer

<div align="center">

<img src="https://user-images.githubusercontent.com/74038190/212284158-e840e285-664b-44d7-b79b-e264b5e54825.gif" width="400">

### **Neel Sapariya**

<p>
<em>Full-Stack Developer | React Native Enthusiast | UI/UX Designer</em>
</p>

<p>
Passionate about creating beautiful, functional mobile applications with cutting-edge technology. <br>
Specializing in React Native, TypeScript, and modern backend solutions.
</p>

<p>
  <a href="https://github.com/sapariyaneel">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
  </a>
  <a href="mailto:workwithneel@outlook.com">
    <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email">
  </a>
</p>

<hr>

### 🌟 Project Highlights

<table>
<tr>
<td align="center">
<strong>5+</strong><br>
<sub>Premium Features</sub>
</td>
<td align="center">
<strong>15+</strong><br>
<sub>Custom Components</sub>
</td>
<td align="center">
<strong>10+</strong><br>
<sub>Database Tables</sub>
</td>
<td align="center">
<strong>100%</strong><br>
<sub>TypeScript</sub>
</td>
</tr>
</table>

</div>

---

## 🙏 Acknowledgments

<div align="center">

**Special thanks to:**

 [**TMDB**](https://www.themoviedb.org/) - For the comprehensive movie database API

 [**Supabase**](https://supabase.com/) - For the powerful backend infrastructure

 [**NativeWind**](https://www.nativewind.dev/) - For bringing Tailwind CSS to React Native

</div>

---

## 📝 License

<div align="center">

**MIT License**

Copyright 2025 Neel Sapariya

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

</div>

---

<div align="center">

### ⭐ If you like this project, please give it a star! ⭐

<hr>

**Made with ❤️ and ☕ by Neel Sapariya**

<sub>Built with React Native • Powered by Supabase • Designed with Passion</sub>

</div>
