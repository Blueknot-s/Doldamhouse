# GitHub & Vercel Deployment Guide

Since I am an AI assistant running in a sandboxed environment, I cannot directly access your personal GitHub account or Vercel dashboard to set up the integration automatically. However, you can easily do this yourself by following these steps.

## 1. Push to GitHub

First, you need to push this code to a GitHub repository.

1.  **Create a new repository** on GitHub (e.g., `doldam-house`).
2.  **Initialize Git** in your project folder (if you haven't already):
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```
3.  **Link to your GitHub repository**:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/doldam-house.git
    git branch -M main
    git push -u origin main
    ```

## 2. Deploy to Vercel

Once your code is on GitHub, Vercel can deploy it automatically.

1.  Go to [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Select your GitHub repository (`doldam-house`).
4.  **Configure Project**:
    *   **Framework Preset**: Vercel should automatically detect **Vite**.
    *   **Root Directory**: `./` (default)
    *   **Build Command**: `npm run build` (default)
    *   **Output Directory**: `dist` (default)
    *   **Environment Variables**:
        *   **Key**: `GEMINI_API_KEY`
        *   **Value**: Your Gemini API Key (get it from [Google AI Studio](https://aistudio.google.com/app/apikey))
5.  Click **"Deploy"**.

> **Note:** A `vercel.json` file has been added to the project to ensure proper routing for the Single Page Application (SPA), preventing 404 errors on page refresh.

## 3. Automatic Deployments

After this setup, every time you push changes to the `main` branch on GitHub, Vercel will automatically rebuild and deploy your website.

## 4. Firebase Configuration (Important)

If you are using Firebase Authentication, make sure your Firebase project's "Authorized Domains" includes your Vercel deployment domain (e.g., `doldam-house.vercel.app`).

1.  Go to [Firebase Console](https://console.firebase.google.com/).
2.  Select your project -> **Authentication** -> **Settings** -> **Authorized Domains**.
3.  Add your Vercel domain (e.g., `your-project.vercel.app`).
