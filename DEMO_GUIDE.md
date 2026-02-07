# 🎯 HACKATHON DEMO GUIDE

## Setup (2 minutes)

1. **Get API Key**
   - Go to: https://makersuite.google.com/app/apikey
   - Click "Create API Key"
   - Copy the key

2. **Open App**
   - Open `index.html` in browser
   - Enter name: "Demo Patient"
   - Enter email: "demo@example.com"
   - (Medical history prompt - just click OK)

3. **Configure**
   - Click ⚙️ Settings
   - Paste API key
   - Click "Save Settings"

## Demo Script (5 minutes)

### Introduction (30 seconds)
"Recovery Agent is an AI-powered post-operative health monitoring system. It helps knee replacement patients track their recovery daily and get instant AI analysis."

### Problem Statement (30 seconds)
"Post-op patients need daily monitoring, but can't always visit doctors. Missing warning signs can lead to complications. Our solution: AI-powered daily check-ins with wound photo analysis."

### Live Demo (3 minutes)

**Step 1: Daily Questions**
- Pain Level: Slide to 5
- Insulin: Type "120 mg/dL"
- Feeling: Type "Feeling better, less swelling today"

**Step 2: Wound Photo**
- Click "Upload Image"
- Select ANY image (for demo, any photo works)
- Show preview

**Step 3: AI Analysis**
- Click "Submit Daily Check-in"
- Watch loading animation
- **HIGHLIGHT:** "AI is analyzing both the patient data AND the wound photo"

**Step 4: Results**
- Show comprehensive health report
- Point out:
  - Overall health status
  - Wound assessment
  - Personalized recommendations
  - Alert level (GREEN/YELLOW/RED)

### Key Features to Mention (1 minute)

✅ **Multi-modal AI Analysis**
- Text + Image analysis using Gemini 1.5 Flash
- Comprehensive health reports

✅ **User-Friendly**
- Simple daily check-in
- One submission per day
- Mobile-friendly design

✅ **Smart Tracking**
- Stores historical data
- Prevents duplicate submissions
- Daily completion tracking

## Judges' Questions - Prepared Answers

**Q: How does it work?**
A: Patients complete daily questions and upload wound photos. Our AI (Gemini 1.5 Flash) analyzes both the data and images to generate comprehensive health reports with alert levels.

**Q: What makes it innovative?**
A: We combine patient-reported outcomes with AI vision analysis of wound photos. This multi-modal approach gives more accurate health assessments than data or images alone.

**Q: How is data stored?**
A: Currently localStorage for prototype. Production would use secure cloud database with HIPAA compliance.

**Q: What about privacy?**
A: All data stored locally in browser. API calls go directly to Google's Gemini API. No intermediate servers. Production would add encryption and proper medical data handling.

**Q: Future plans?**
A: 
- Doctor portal to view patient reports
- Trend analysis and charts
- Medication tracking
- Real email/SMS notifications
- Integration with hospital systems

**Q: Why this problem?**
A: Post-op complications cost healthcare systems billions. Early detection through daily monitoring can prevent hospital readmissions and improve patient outcomes.

**Q: Technical stack?**
A: Frontend: HTML, TailwindCSS, JavaScript. AI: Google Gemini 1.5 Flash API. Storage: localStorage (prototype), would use PostgreSQL/MongoDB for production.

## Backup Demo (if internet fails)

Show the code:
1. Open `app.js` - show AI prompt engineering
2. Explain multi-modal API call (text + image)
3. Show localStorage data structure
4. Demonstrate responsive design (resize browser)

## Closing Statement

"Recovery Agent demonstrates how AI can make healthcare more accessible and proactive. By combining daily monitoring with advanced AI analysis, we can catch complications early and improve patient outcomes. Thank you!"

---

## Quick Fixes

**If API fails:**
- Check API key in Settings
- Verify internet connection
- Show code instead

**If image won't upload:**
- Try different image
- Use camera button instead
- Explain feature verbally

**If already submitted today:**
- Clear localStorage: Press F12 → Console → Type: `localStorage.clear()` → Refresh page

---

**GOOD LUCK! 🚀**
