# Loop — Social Media Feed Web App

A responsive social media feed demo built with React, TypeScript, Vite, CSS, REST APIs, and JSON. Designed to run on Windows with VS Code.

## Features
- Fetches posts and user profiles from JSONPlaceholder
- Responsive feed with reusable post cards
- Search posts by title, content, or author
- Like/unlike posts (client-side demo state)
- Filter between all posts and liked posts
- Refresh feed from the API
- Asynchronous image loading with fallbacks
- Loading, error, and empty states
- Responsive desktop and mobile layout

## Requirements
- Node.js 20.19+ or 22.12+ recommended
- npm
- VS Code (optional but recommended)
- Internet connection for the public demo API and images

## Run on Windows
1. Extract the ZIP.
2. Open the `Social_Media_Feed_Web_App` folder in VS Code.
3. Open **Terminal → New Terminal**.
4. Run these commands:

```bash
npm install
npm run dev
```

5. Open the local URL printed in the terminal, usually `http://localhost:5173`.

To create a production build:

```bash
npm run build
```

## API
- Posts: `https://jsonplaceholder.typicode.com/posts`
- Users: `https://jsonplaceholder.typicode.com/users`
- Images: `https://picsum.photos/seed/<post-id>/900/600`

This is a demo application. Likes are stored only in browser memory and reset on refresh; it is not connected to a real social network or user authentication.

## Suggested resume entry
**Social Media Feed Web App | React, TypeScript, REST APIs, JSON**
- Built a responsive social feed with reusable React components, post cards, search, and like/unlike interactions.
- Integrated REST APIs and JSON parsing to retrieve posts and user profiles, with asynchronous image loading.
- Used component state and modular UI structure to manage feed updates and improve maintainability.

Only claim features and results you have personally run and verified.
