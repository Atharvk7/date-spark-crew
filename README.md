# TDC Matchmakers - Matchmaking Management Web App

A comprehensive matchmaking management system built with React, Vite, Tailwind CSS, Firebase, and OpenAI integration.

## 🚀 Features

- **Authentication System**: Secure login/logout with Firebase Auth
- **Customer Management**: View and manage customer profiles with comprehensive biodata
- **Smart Matching**: AI-powered matching algorithm with gender-specific preferences
- **Notes System**: Save and manage matchmaker notes for each customer
- **AI Integration**: OpenAI-powered match explanations and introduction emails
- **Responsive Design**: Modern, mobile-friendly UI built with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Firebase (Auth + Firestore)
- **AI**: OpenAI GPT-4o-mini API
- **Routing**: React Router DOM
- **State Management**: React Context + Hooks

## 📋 Prerequisites

- Node.js 18+ and npm
- Firebase project with Authentication and Firestore enabled
- OpenAI API key

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd date-spark-crew
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your_app_id

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here

# App Configuration
VITE_APP_NAME=TDC Matchmakers
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Authentication (Email/Password)
4. Enable Firestore Database
5. Get your project configuration from Project Settings
6. Update the `.env` file with your Firebase config

### 4. OpenAI Setup

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account and get your API key
3. Add the API key to your `.env` file

### 5. Run the App

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🔐 Demo Credentials

For testing purposes, you can use these demo credentials:

- **Email**: `demo@tdcmatchmakers.com`
- **Password**: `demo123`

**Note**: These are demo credentials. In production, you'll need to create real user accounts in Firebase Authentication.

## 📱 App Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components (shadcn/ui)
│   ├── features/     # Feature-specific components
│   └── ProtectedRoute.tsx
├── pages/
│   ├── Login.tsx     # Authentication page
│   ├── Dashboard.tsx # Customer list and overview
│   ├── CustomerDetail.tsx # Detailed customer view
│   ├── Index.tsx     # Landing page (redirects to login)
│   └── NotFound.tsx  # 404 page
├── lib/
│   ├── firebase.ts   # Firebase configuration
│   ├── authContext.tsx # Authentication context
│   ├── aiUtils.ts    # OpenAI integration
│   └── matchingLogic.ts # Matching algorithms
├── data/
│   └── profiles.json # Sample customer profiles
└── styles/
    └── index.css     # Global styles
```

## 🔍 Key Features Explained

### Authentication
- Firebase Email/Password authentication
- Protected routes for authenticated users
- Automatic redirect to login for unauthenticated users

### Customer Management
- View all customers assigned to the logged-in matchmaker
- Search and filter customers
- Comprehensive customer profiles with all biodata fields

### Matching Algorithm
- Gender-specific matching preferences
- Compatibility scoring (0-100)
- Top 10 matches with detailed explanations

### AI Integration
- **Match Explanations**: AI-generated explanations for compatibility scores
- **Introduction Emails**: Personalized emails for potential matches
- Uses OpenAI's GPT-4o-mini model for natural language generation

### Notes System
- Save and manage matchmaker notes for each customer
- Notes are stored locally (can be extended to Firestore)

## 🚀 Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Build the project:
```bash
npm run build
```

3. Deploy:
```bash
vercel
```

4. Set environment variables in Vercel dashboard

### Deploy to Firebase Hosting

1. Install Firebase CLI:
```bash
npm i -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase:
```bash
firebase init hosting
```

4. Build and deploy:
```bash
npm run build
firebase deploy
```

## 🔧 Customization

### Adding New Customer Fields

1. Update the `Customer` interface in `src/lib/aiUtils.ts`
2. Add the field to `src/data/profiles.json`
3. Update the UI components to display the new field

### Modifying Matching Logic

Edit `src/lib/matchingLogic.ts` to customize:
- Compatibility scoring algorithms
- Gender-specific preferences
- Match filtering criteria

### Styling Changes

- Modify `src/index.css` for global styles
- Update Tailwind classes in components
- Customize `tailwind.config.ts` for theme changes

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Connection Error**
   - Verify your Firebase config in `.env`
   - Check if Firestore rules allow read/write access

2. **OpenAI API Error**
   - Verify your OpenAI API key
   - Check API usage limits and billing

3. **Build Errors**
   - Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
   - Check TypeScript compilation: `npm run build`

### Development Tips

- Use browser dev tools to debug Firebase connections
- Check Firebase console for authentication and database logs
- Monitor OpenAI API usage in the OpenAI dashboard

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the Firebase and OpenAI documentation
- Review the troubleshooting section above

---

**Happy Matchmaking! 💕**
