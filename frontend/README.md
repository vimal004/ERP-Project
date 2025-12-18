# Frontend Setup (React + Vite + Tailwind CSS)

![React](https://img.shields.io/badge/React-v18.0.0-blue)
![Vite](https://img.shields.io/badge/Vite-v5.0.0-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.4.0-teal)
![Node](https://img.shields.io/badge/Node.js-v22.13.0-green)

---

  
## Overview

This is the **frontend setup** for a MERN stack project built using **React + Vite** and styled with **Tailwind CSS**.
It is designed for fast development, modularity, and seamless integration with your backend API.

---

## Features

* ⚡ Fast bundling using Vite
* 🎨 Styling with Tailwind CSS
* 🧩 Modular React component structure
* 🔄 API integration with backend (Express/MongoDB)
* 🧠 State management ready (optional Redux/Zustand)
* 📱 Fully responsive layout support

---

## Prerequisites

Before starting, ensure you have the following installed:

* [Node.js](https://nodejs.org/en/) >= 18.x
* npm >= 9.x

---

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-git-repo-url>
cd front-end
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

This will start the development server, and you can view the app at:

👉 **[http://localhost:5173](http://localhost:5173)** (default Vite port)

---

## Folder Structure

```
front-end/
│
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Page-level React components
│   ├── assets/            # Images, icons, etc.
│   ├── App.jsx            # Main React component
│   ├── main.jsx           # Entry point
│   └── styles/            # Custom CSS (if needed)
│
├── public/                # Static files
├── package.json
├── vite.config.js         # Vite configuration
└── tailwind.config.js     # Tailwind CSS configuration
```

---

## Tailwind CSS Setup

If Tailwind is not installed, follow these commands:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Then update your `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

And add the Tailwind directives to your CSS file (`src/index.css` or `App.css`):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Environment Variables

Create a `.env` file in the **root directory** of your frontend project:

```env
VITE_API_URL=http://localhost:5000
```

Then access it inside your code:

```js
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## NPM Commands

| Command           | Description                               |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Start the local dev server                |
| `npm run build`   | Build for production                      |
| `npm run preview` | Preview production build locally          |
| `npm run lint`    | Lint project files (if ESLint configured) |

---

## Connecting to Backend

1. Ensure your **backend server** is running (default port: 5000).
2. Update the `.env` file with your backend API URL.

Example API Call:

```js
fetch(`${import.meta.env.VITE_API_URL}/api/example`)
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

---

## Best Practices

* Use **React Router** for navigation:

  ```bash
  npm install react-router-dom
  ```
* Maintain clean component structure.
* Keep API calls in a dedicated `/services` folder.
* Add proper error handling and loading states.
* Use environment variables for all API URLs.

---

## Deployment

### Build the Project

```bash
npm run build
```

### Deploy to GitHub Pages / Vercel / Netlify

* **Vercel:** Just link your GitHub repo, it auto-detects Vite.
* **Netlify:** Drag & drop the `/dist` folder.
* **GitHub Pages:** Use `npm run build` and deploy the `dist` folder manually or via CI/CD.

---

## Author

* **Your Name**
* GitHub: [YourGitHubUsername](https://github.com/YourGitHubUsername)
* Email: [youremail@example.com](mailto:youremail@example.com)

---

## License

This project is licensed under the **MIT License**.
