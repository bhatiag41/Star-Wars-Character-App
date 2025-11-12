# Star Wars Character Databank

A modern, Star Wars-themed React application for browsing and exploring characters from the Star Wars universe using the SWAPI (Star Wars API).

## Features

- 🌌 **Star Wars Themed UI** - Dark space background with Star Wars color palette (yellow, blue, red)
- 👥 **Character Browsing** - Browse through all Star Wars characters with pagination
- 🔍 **Search Functionality** - Search characters by name with debounced input
- 🎯 **Advanced Filtering** - Filter by homeworld, films, and species
- 📱 **Responsive Design** - Mobile-first design that works on all devices
- 🔐 **Authentication** - Mock authentication system with protected routes
- 🎨 **Beautiful Animations** - Hover effects, transitions, and Star Wars-themed animations
- 📊 **Character Details** - Detailed modal view with all character information

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Vitest** - Testing framework
- **SWAPI** - Star Wars API

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Run Tests

```bash
npm test
```

## Demo Credentials

- Username: `luke` / Password: `skywalker`
- Username: `leia` / Password: `organa`
- Username: `han` / Password: `solo`
- Username: `admin` / Password: `admin123`

## Project Structure

```
star-wars-app/
├── src/
│   ├── components/       # React components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API and auth services
│   ├── utils/            # Utility functions
│   ├── context/          # React context providers
│   └── App.jsx           # Main app component
├── tests/                # Test files
└── package.json
```

## Features in Detail

### Character Cards
- Random images from Picsum Photos
- Species-based color schemes
- Hover effects with glow animations
- Scan line effects

### Character Modal
- Complete character information
- Homeworld details
- Species information
- Formatted data (height in meters, formatted dates)

### Search & Filters
- Real-time search with debouncing
- Filter by homeworld, films, and species
- Combined search and filter logic

### Authentication
- Mock JWT-based authentication
- Protected routes
- Auto token refresh
- Login/logout functionality

## Design System

### Colors
- **Primary Yellow**: `#FFE81F` - Star Wars logo yellow
- **Primary Blue**: `#4BD5EE` - Lightsaber blue
- **Space Background**: `#0A0E27` - Deep space
- **Dark Surface**: `#1a1d3a` - Space blue-black

### Typography
- **Display Font**: Orbitron, Rajdhani (futuristic, tech feel)
- **Body Font**: Roboto, Inter (clean readability)

## License

MIT

