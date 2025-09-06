# Wildlife Safety Web Site

A comprehensive web application for wildlife safety and identification, built with React and Vite. This project helps users identify dangerous wildlife, access emergency resources, and connect with medical officers through an integrated chat system.

## Features

- **Animal Identification**: AI-powered wildlife identification using TensorFlow.js
- **Emergency Resources**: Quick access to emergency contacts and medical officers
- **Community Feed**: User-generated content and discussions about wildlife safety
- **Interactive Maps**: Location-based wildlife tracking and safety zones
- **Real-time Chat**: Communication with medical officers and community members
- **Admin Dashboard**: Management tools for administrators and medical officers

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Backend**: Firebase (Authentication, Database, Storage)
- **Maps**: Google Maps API, Leaflet
- **AI/ML**: TensorFlow.js for animal identification
- **State Management**: React Context API
- **Routing**: React Router DOM

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wildlife-safty-web-site
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env` (if available)
   - Configure Firebase credentials
   - Set up Google Maps API key

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Dependencies

All project dependencies are listed in `requirements.txt` for reference. This project uses npm for dependency management, not pip.

## Project Structure

```
src/
├── assets/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── data/          # Static data files
│   └── Database/      # Firebase configuration
├── App.jsx           # Main app component
└── main.jsx          # App entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
