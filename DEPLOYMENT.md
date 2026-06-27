# 🚀 Deployment Guide - Laxmi Narsimha Medical

This guide walks you through deploying the Express backend, the React frontend, and the static root frontend for the **Laxmi Narsimha Medical & General Store** project.

---

## 📦 Step 1: Push the Latest Code to GitHub

We have committed all your local changes (including dynamic production API configurations, database connections, catalog expansion to 40 items, and scrolling filters sidebar). 

To push the code to your repository [Medical-Website](https://github.com/uppunutulaharshith/Medical-Website), open a terminal in your project root and run:

```bash
git push -u origin main
```

> [!NOTE]
> If Git prompts you for authentication, you can sign in via the browser popup or supply a GitHub Personal Access Token (PAT).
> If you have existing code on the remote that you want to overwrite, you can use the force flag: `git push -u origin main --force`.

---

## 🗄️ Step 2: Deploy the Express Backend on Render

The Express backend handles the API routes, saves orders/contacts/prescriptions into JSON files, and serves uploaded prescription documents.

### Option A: One-Click Deploy (Recommended)
Click the button below to instantly configure and deploy your backend server using the repository's Blueprint:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/uppunutulaharshith/Medical-Website)

---

### Option B: Manual Configuration
If you prefer to configure the service manually:

1. Go to [Render](https://render.com/) and log in.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository `uppunutulaharshith/Medical-Website`.
4. Configure the Web Service with the following details:
   - **Name**: `medical-website-backend`
   - **Environment**: `Node`
   - **Region**: Select the region closest to you
   - **Branch**: `main`
   - **Root Directory**: Leave blank (or set as `backend` if you only want to deploy backend files)
     - *Recommended*: Leave it blank to install all workspace dependencies.
   - **Build Command**: `npm install`
   - **Start Command**: `node backend/server.js` (or `npm start -w backend`)
   - **Instance Type**: **Free** (or Starter for persistent disks)

### 💾 Enabling Data Persistence (Highly Recommended)
Because Render's Free tier uses an ephemeral filesystem, any files written (such as `orders.json`, `contacts.json`, `prescriptions.json`, and uploaded prescriptions) will be lost when the instance sleeps or redeploys.
* To preserve data, upgrade to Render's **Starter** tier ($7/mo) and add a **Persistent Disk**:
  - **Mount Path**: `/opt/render/project/src/backend/data`
  - **Size**: `1 GB`
* Alternatively, you can use Render's Free tier for testing, keeping in mind that local database modifications reset daily.

---

## ⚛️ Step 3: Deploy the React Admin/User Panel on Vercel

The React frontend handles the catalog browsing, ordering checkout, prescription upload forms, and the Admin panel management tabs.

1. Go to [Vercel](https://vercel.com/) and log in.
2. Click **Add New** > **Project**.
3. Import your GitHub repository `uppunutulaharshith/Medical-Website`.
4. Configure the Project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
5. Expand the **Build and Output Settings**:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Expand **Environment Variables** and add:
   - **Key**: `VITE_API_URL`
   - **Value**: The URL of your deployed Render backend (e.g., `https://medical-website-backend.onrender.com/api`)
7. Click **Deploy**.

---

## 📄 Step 4: Deploy the Static Root Website

The static website consists of `index.html`, `style.css`, and `app.js` in the root directory.

### Option A: Deploy to Vercel (Recommended)
1. In Vercel, click **Add New** > **Project**.
2. Import the `uppunutulaharshith/Medical-Website` repository again.
3. Configure the settings:
   - **Framework Preset**: `Other` (or No Build)
   - **Root Directory**: Leave blank (project root)
   - **Build Command**: Leave empty / disabled
   - **Output Directory**: `./` (or leave empty)
4. Click **Deploy**.

### Option B: Deploy to GitHub Pages
1. Go to your repository **Settings** on GitHub.
2. Scroll to the **Pages** section in the left sidebar.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Choose `main` branch and `/ (root)` folder.
5. Click **Save**.

### 🔗 Connecting Static Website to Production Backend
Before or after deploying the static website, make sure to update the `API_URL` variable at the top of your root [app.js](file:///c:/Users/HARSHITH/Downloads/medical/app.js) file:

```javascript
// Already pre-configured for your live Render API url
const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5003/api'
    : 'https://medical-website-fefj.onrender.com/api'; 
```
Once updated, push the change to GitHub to trigger automatic redeployment!
