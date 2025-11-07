# GoSupportMe - 
FULL STACK WEB APPLICATION

LIVE - https://684e83d19867bbc810407659--delicate-mermaid-d2d796.netlify.app/login

PROJECT WALKTHROUGH VIDEO - https://www.youtube.com/watch?v=mbZ-lnZeR9U

A modern crowdfunding platform built with React, enabling users to create and manage fundraising campaigns with ease.

## Features

- **User Authentication**: Secure login and user management powered by Firebase Authentication
- **Campaign Creation**: Multi-step campaign creation process with:
  - Basic information (title, goal, end date)
  - Detailed description
  - Media upload support
  - Milestone tracking
- **Real-time Dashboard**: View and manage all your campaigns
- **Live Preview**: See how your campaign looks while creating it
- **Firebase Integration**: Real-time database and storage for campaigns and media

## Tech Stack

- **Frontend**: React 19.1.0
- **Build Tool**: Vite 6.3.5
- **Routing**: React Router
- **State Management**: Redux Toolkit
- **Backend**: Firebase (Realtime Database)
- **Authentication**: Firebase Authentication
- **Styling**: CSS (inline styles)

## Prerequisites

Before running this project, make sure you have:

- Node.js (v18 or higher recommended)
- npm or yarn
- A Firebase project with:
  - Realtime Database enabled
  - Authentication enabled
  - Storage enabled (for media uploads)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd GoSupportMe/my-react-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a Firebase configuration file at `src/firebase.js` with your Firebase credentials:
```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  databaseURL: "your-database-url",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
```

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will start on `http://localhost:5173` (or another available port).

### Build for Production

```bash
npm run build
```

This will create an optimized production build in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## Project Structure

```
my-react-app/

