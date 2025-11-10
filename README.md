# Project README

This project is a web application built with modern technologies including React, TypeScript, and Zustand for state management. It features a mock backend server using JSON Server to simulate API interactions.

## Getting Started

To get started with the project, follow these steps:
1. **Clone the repository:**
   ```bash
   git clone ...
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```
4. **Run the JSON Server:**
   ```bash
   npm run json-server
   ```
    This will start the mock backend server at `http://localhost:3001`.
5. **Start the development server:**
   ```bash
   npm run dev
   ```
    This will start the frontend development server at `http://localhost:3000`.
6. **Open your browser:**
   Navigate to `http://localhost:3000` to view the application.

## Available Scripts
In the project directory, you can run:
- `npm run dev`: Starts the development server.
- `npm run json-server`: Starts the JSON Server for the mock backend.
- `npm run build`: Builds the app for production.
- `npm run lint`: Runs the linter to check for code quality issues. (Sun* Lint)
- `npm test`: Runs the test suite using Jest.

## Project Structure
- `src/`: Contains the source code of the application.
- `src/stores/`: Contains Zustand stores for state management.
- `src/lib/api/`: Contains API configuration and utility functions.
- `src/types/`: Contains TypeScript type definitions.
- `src/database/`: Contains the mock database file for JSON Server.
- `public/`: Contains static assets.