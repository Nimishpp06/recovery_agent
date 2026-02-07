# 🚀 Deploy to GitHub Pages (2 Minutes!)

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `recovery-agent`
3. Make it **Public**
4. Click "Create repository"

## Step 2: Upload Your Files

### Option A: Using GitHub Web Interface (Easiest!)

1. On your new repository page, click "uploading an existing file"
2. Drag and drop these 3 files:
   - `index.html`
   - `app.js`
   - `README.md`
3. Click "Commit changes"

### Option B: Using Git (If you have it installed)

Open terminal in your project folder and run:

```bash
cd "c:\Users\nimis\OneDrive\Documents\college\grasp"
git init
git add index.html app.js README.md DEMO_GUIDE.md
git commit -m "Initial commit - Recovery Agent prototype"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/recovery-agent.git
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to your repository Settings
2. Click "Pages" in left sidebar
3. Under "Source", select "main" branch
4. Click "Save"
5. Wait 1-2 minutes

## Step 4: Get Your Public Link

Your app will be live at:
```
https://YOUR_USERNAME.github.io/recovery-agent/
```

**That's your public link for the hackathon!** 🎉

---

# Alternative: Netlify Drop (Even Faster!)

## Option 2: Netlify Drop (30 seconds!)

1. Go to https://app.netlify.com/drop
2. Drag your entire `grasp` folder onto the page
3. Get instant public link!

**No account needed for demo!**

---

# Alternative: Vercel (Also Fast!)

## Option 3: Vercel (1 minute)

1. Go to https://vercel.com/new
2. Sign in with GitHub
3. Import your repository
4. Click "Deploy"
5. Get public link!

---

# 🎯 Recommended for Hackathon

**Use Netlify Drop** - Fastest, no setup needed!

1. Open https://app.netlify.com/drop
2. Drag the `grasp` folder
3. Copy the link they give you
4. Submit to hackathon!

**Done in 30 seconds!** ✨
