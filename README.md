# 💩 Poopy Adventure Tracker

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-Private-red.svg)

**A comprehensive digestive health tracking app with medical-grade features**

[Features](#features) • [Tech Stack](#tech-stack) • [Setup](#setup) • [Usage](#usage)

</div>

---

## 💝 Dedication

<div align="center">

### This app was made with love exclusively for

# ✨ Aeri Victoria ✨

*Your health, your adventure, your tracker*

🌸 💕 🌟

</div>

---

## 🎯 Features

### Core Tracking
- 📊 **Bristol Stool Scale** - Medical-grade classification (Types 1-7)
- ⏱️ **Duration Tracking** - Monitor bathroom visit times
- 🎨 **Color Analysis** - 8 color options with visual indicators
- 📏 **Volume & Shape** - Comprehensive physical characteristics
- 😣 **Pain Level** - 0-10 scale with visual feedback
- 🩸 **Health Indicators** - Blood & mucus detection
- 💊 **Symptom Logging** - Track cramping, bloating, nausea, gas, urgency

### Smart Analytics
- 📈 **8 Interactive Charts** - Bristol type, color, frequency, time patterns
- 🎯 **Health Score** - Real-time digestive health rating
- 📅 **Calendar View** - Visual monthly overview
- 📊 **Time Filters** - View data by day, week, month, or all time
- 🔥 **Streak Tracking** - Maintain daily logging consistency

### Modern UI/UX
- 📱 **Mobile-First Design** - Optimized for smartphones
- 🎨 **Royal Blue Theme** - Professional medical aesthetic
- ✨ **Smooth Animations** - Card hover effects, transitions
- 🌈 **Color-Coded Data** - Bristol scale indicators
- 📲 **PWA Ready** - Install as native app

### Data Management
- ☁️ **Supabase Integration** - Cloud database storage
- 🔐 **Authentication** - Email/password with RLS security
- 💾 **Offline Support** - Guest mode with localStorage
- 📤 **Data Export** - Share reports with doctors
- 🔄 **Sync Across Devices** - When logged in

---

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **Tailwind CSS 3.x** - Utility-first styling
- **JavaScript (ES6+)** - Modern async/await patterns
- **Chart.js** - Data visualization
- **Font Awesome 6.5.1** - Icons

### Backend
- **Supabase** - PostgreSQL database
- **Supabase Auth** - User authentication
- **Row Level Security** - Data privacy

### Design
- **Mobile-First** - Responsive breakpoints
- **Royal Blue (#4169E1)** - Primary brand color
- **Gradient Accents** - Visual hierarchy
- **Glassmorphism** - Modern UI effects

---

## 📁 Project Structure

```
poopy-adventure-tracker/
├── mobile-index.html          # Main dashboard (today's focus)
├── add-entry.html             # 4-section entry wizard
├── overall-history.html       # Complete history view
├── reports.html               # Analytics & charts
├── settings.html              # User preferences
├── auth.html                  # Authentication page
├── supabase-config.js         # Database helpers
├── supabase-setup.sql         # Database schema
├── email-template-signup.html # Welcome email
├── email-template-recovery.html # Password reset
└── README.md                  # This file
```

---

## 🚀 Setup

### 1. Database Setup (Supabase)

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to SQL Editor
4. Run the script from `supabase-setup.sql`
5. Copy your project URL and anon key

### 2. Configuration

Update `supabase-config.js`:

```javascript
const SUPABASE_URL = 'YOUR_PROJECT_URL';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
```

### 3. Email Templates (Optional)

1. Go to Authentication > Email Templates
2. Paste content from `email-template-signup.html` for signup
3. Paste content from `email-template-recovery.html` for recovery

### 4. Run Locally

Simply open `mobile-index.html` in a browser, or:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit: `http://localhost:8000/mobile-index.html`

---

## 📱 Usage

### First Time Setup

1. **Sign Up**: Open `auth.html` and create an account
2. **Add Entry**: Click "Add New Entry" button
3. **Fill Details**: Complete the 4-section wizard
   - When: Date & time
   - Type: Bristol scale & color
   - Health: Volume, pain, symptoms
   - Notes: Additional observations
4. **Save**: Data syncs to Supabase automatically

### Daily Tracking

1. **Quick Entry**: Add entries throughout the day
2. **View Today**: See today's history on home page
3. **Check Score**: Monitor your health score
4. **Maintain Streak**: Track daily consistency

### Analytics

1. **Reports Page**: View 8 comprehensive charts
2. **Time Filters**: Analyze by period
3. **Overall History**: Browse all entries
4. **Calendar View**: Visual monthly patterns

---

## 🎨 Design System

### Colors

```css
Royal Blue: #4169E1 (Primary)
Dark Blue:  #002BD8 (Accents)
Emerald:    #10B981 (Positive)
Red:        #EF4444 (Alerts)
Amber:      #F59E0B (Warning)
Purple:     #8B5CF6 (Analytics)
```

### Typography

```css
Font: Inter (Google Fonts)
Weights: 400, 500, 600, 700, 800
```

### Bristol Scale Colors

1. 🔴 Red - Type 1 (Constipation)
2. 🟠 Orange - Type 2 (Mild Constipation)
3. 🟢 Green - Type 3-5 (Ideal)
4. 🟡 Yellow - Type 6 (Mild Diarrhea)
5. 🔴 Red - Type 7 (Diarrhea)

---

## 🔐 Security

- **Row Level Security (RLS)** - Users can only access their own data
- **JWT Authentication** - Secure token-based auth
- **HTTPS Only** - Encrypted data transmission
- **No Analytics** - No tracking, no cookies
- **Local First** - Guest mode for offline use

---

## 📊 Database Schema

### Tables

**user_profiles**
- id (UUID)
- email
- full_name
- theme_preference
- notifications_enabled
- reminder_time

**poop_entries**
- id (TEXT)
- user_id (UUID)
- timestamp (TIMESTAMPTZ)
- duration (INTEGER)
- bristol (TEXT) - '1' to '7'
- color (TEXT)
- volume (TEXT) - 'small', 'medium', 'large'
- shape (TEXT)
- smell (TEXT)
- pain (INTEGER) - 0 to 10
- has_blood (BOOLEAN)
- has_mucus (BOOLEAN)
- symptoms (JSONB)
- notes (TEXT)

---

## 🤝 Contributing

This is a private project made exclusively for **Aeri Victoria**. 
Not open for public contributions.

---

## 📄 License

**Private & Proprietary**

This application is exclusively created for personal use by Aeri Victoria.
All rights reserved. Not for redistribution or commercial use.

---

## 👨‍💻 Developer

Created with ❤️ by **John Mark**

- GitHub: [@thatdevjohnmark](https://github.com/thatdevjohnmark)

---

## 💌 Special Thanks

To **Aeri Victoria** - may your digestive adventures be smooth and healthy! 🌸✨

---

<div align="center">

**Made with 💝 exclusively for Aeri Victoria**

*Track your health, one adventure at a time* 💩🗺️

</div>
