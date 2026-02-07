// Recovery Agent - Hackathon Prototype
// All-in-one JavaScript file

// Initialize user on first load
function initUser() {
    let userProfile = JSON.parse(localStorage.getItem('userProfile') || 'null');

    if (!userProfile) {
        const name = prompt('Welcome! Please enter your name:') || 'Patient';
        const email = prompt('Please enter your email:') || 'patient@example.com';
        const medicalHistory = prompt('Brief medical history (optional):') || 'Post-operative knee replacement patient';

        userProfile = {
            userId: 'user_' + Date.now(),
            name: name,
            email: email,
            medicalHistory: medicalHistory,
            registrationDate: new Date().toISOString()
        };

        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        localStorage.setItem('dailySubmissions', JSON.stringify([]));
        localStorage.setItem('reports', JSON.stringify([]));
    }

    return userProfile;
}

const userProfile = initUser();
document.getElementById('user-greeting').textContent = `Welcome back, ${userProfile.name}! 👋`;

// DOM Elements
const painSlider = document.getElementById('pain-slider');
const painValue = document.getElementById('pain-value');
const insulinLevel = document.getElementById('insulin-level');
const feeling = document.getElementById('feeling');
const uploadBtn = document.getElementById('upload-btn');
const cameraBtn = document.getElementById('camera-btn');
const imageUpload = document.getElementById('image-upload');
const cameraCapture = document.getElementById('camera-capture');
const previewContainer = document.getElementById('image-preview-container');
const previewImage = document.getElementById('preview-image');
const removeImageBtn = document.getElementById('remove-image');
const submitDailyBtn = document.getElementById('submit-daily-btn');
const loading = document.getElementById('loading');
const results = document.getElementById('results');
const resultsContent = document.getElementById('results-content');
const completionStatus = document.getElementById('completion-status');
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeSettings = document.getElementById('close-settings');
const apiKeyInput = document.getElementById('api-key');
const saveSettings = document.getElementById('save-settings');
const profileName = document.getElementById('profile-name');
const profileEmail = document.getElementById('profile-email');

let imageBase64 = null;

// Pain slider
painSlider.addEventListener('input', (e) => {
    painValue.textContent = e.target.value;
});

// Image upload
uploadBtn.addEventListener('click', () => imageUpload.click());
cameraBtn.addEventListener('click', () => cameraCapture.click());

imageUpload.addEventListener('change', (e) => {
    if (e.target.files.length > 0) handleImageUpload(e.target.files[0]);
});

cameraCapture.addEventListener('change', (e) => {
    if (e.target.files.length > 0) handleImageUpload(e.target.files[0]);
});

removeImageBtn.addEventListener('click', () => {
    imageUpload.value = '';
    cameraCapture.value = '';
    imageBase64 = null;
    previewContainer.classList.add('hidden');
});

function handleImageUpload(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
        previewImage.src = event.target.result;
        previewContainer.classList.remove('hidden');
        imageBase64 = event.target.result.split(',')[1];
    };
    reader.readAsDataURL(file);
}

// Check daily completion
function checkDailyCompletion() {
    const today = new Date().toISOString().split('T')[0];
    const dailySubmissions = JSON.parse(localStorage.getItem('dailySubmissions') || '[]');
    const todaySubmission = dailySubmissions.find(sub => sub.date === today);

    if (todaySubmission && todaySubmission.completed) {
        completionStatus.classList.remove('hidden');
        submitDailyBtn.disabled = true;
        submitDailyBtn.textContent = '✅ Today\'s Check-in Already Completed';
        submitDailyBtn.classList.add('opacity-50', 'cursor-not-allowed');
        return true;
    }
    return false;
}

// Submit daily check-in
submitDailyBtn.addEventListener('click', async () => {
    const pain = painSlider.value;
    const insulin = insulinLevel.value.trim();
    const feelingText = feeling.value.trim();

    if (!insulin) {
        alert('⚠️ Please enter your insulin level.');
        return;
    }

    if (!feelingText) {
        alert('⚠️ Please describe how you\'re feeling.');
        return;
    }

    if (!imageBase64) {
        alert('⚠️ Please upload or capture a photo of your wound.');
        return;
    }

    const settings = JSON.parse(localStorage.getItem('settings') || '{}');
    const apiKey = settings.apiKey;

    if (!apiKey) {
        alert('⚠️ Please configure your Gemini API Key in Settings.');
        settingsModal.classList.add('active');
        return;
    }

    loading.classList.remove('hidden');
    results.classList.add('hidden');
    submitDailyBtn.disabled = true;

    try {
        const dailyData = {
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString(),
            painLevel: parseInt(pain),
            insulinLevel: insulin,
            feeling: feelingText,
            woundImage: imageBase64,
            completed: true
        };

        const aiReport = await analyzeWithAI(dailyData, apiKey);

        // Save submission
        const dailySubmissions = JSON.parse(localStorage.getItem('dailySubmissions') || '[]');
        dailySubmissions.push(dailyData);
        localStorage.setItem('dailySubmissions', JSON.stringify(dailySubmissions));

        // Save report
        const reports = JSON.parse(localStorage.getItem('reports') || '[]');
        let alertLevel = 'GREEN';
        if (aiReport.includes('YELLOW')) alertLevel = 'YELLOW';
        if (aiReport.includes('RED')) alertLevel = 'RED';

        reports.push({
            reportId: 'report_' + Date.now(),
            date: dailyData.date,
            timestamp: dailyData.timestamp,
            dailyData: dailyData,
            aiAnalysis: aiReport,
            alertLevel: alertLevel
        });
        localStorage.setItem('reports', JSON.stringify(reports));

        // Display results
        displayResults(aiReport);

        // Show completion
        completionStatus.classList.remove('hidden');
        submitDailyBtn.textContent = '✅ Today\'s Check-in Already Completed';
        submitDailyBtn.classList.add('opacity-50', 'cursor-not-allowed');

        console.log('📧 Report would be sent to:', userProfile.email);

    } catch (error) {
        alert(`Error: ${error.message}`);
        console.error(error);
        submitDailyBtn.disabled = false;
    } finally {
        loading.classList.add('hidden');
    }
});

// AI Analysis
async function analyzeWithAI(dailyData, apiKey) {
    const prompt = `You are a medical monitoring AI for post-operative knee replacement patients.

**Patient:** ${userProfile.name}
**Medical History:** ${userProfile.medicalHistory}

**Today's Data (${dailyData.date}):**
- Pain Level: ${dailyData.painLevel}/10
- Insulin Level: ${dailyData.insulinLevel}
- Patient's Feeling: ${dailyData.feeling}

**Task:** Analyze the wound image and health data. Generate a comprehensive daily health report.

**Include:**
1. Overall Health Status
2. Wound Assessment
3. Pain Analysis
4. Insulin Level Commentary
5. Recommendations for next 24 hours
6. Alert Level: GREEN (good), YELLOW (monitor), or RED (seek medical attention)

**Format:** Start with alert level, then detailed analysis.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{
                parts: [
                    { text: prompt },
                    { inline_data: { mime_type: "image/jpeg", data: dailyData.woundImage } }
                ]
            }]
        })
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();

    if (data.candidates && data.candidates.length > 0) {
        return data.candidates[0].content.parts[0].text;
    } else {
        throw new Error('No response from AI');
    }
}

// Display results
function displayResults(aiReport) {
    results.classList.remove('hidden');
    const formattedReport = aiReport
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
    resultsContent.innerHTML = formattedReport;
    results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Settings
settingsBtn.addEventListener('click', () => {
    settingsModal.classList.add('active');
    profileName.textContent = userProfile.name;
    profileEmail.textContent = userProfile.email;
    const settings = JSON.parse(localStorage.getItem('settings') || '{}');
    apiKeyInput.value = settings.apiKey || '';
});

closeSettings.addEventListener('click', () => {
    settingsModal.classList.remove('active');
});

settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
        settingsModal.classList.remove('active');
    }
});

saveSettings.addEventListener('click', () => {
    const settings = { apiKey: apiKeyInput.value.trim() };
    localStorage.setItem('settings', JSON.stringify(settings));
    alert('✅ Settings saved!');
    settingsModal.classList.remove('active');
});

// Check completion on load
checkDailyCompletion();
