import streamlit as st
import google.generativeai as genai
from PIL import Image

# 1. Setup
st.set_page_config(page_title="Recovery Agent", page_icon="🏥")
st.title("🏥 Post-Op Recovery Assistant")

# Sidebar for API key
with st.sidebar:
    st.header("Settings")
    api_key = st.text_input("Enter Google Gemini API Key", type="password")
    st.info("Get your free key at [aistudio.google.com](https://aistudio.google.com/)")

if api_key:
    genai.configure(api_key=api_key)

# 2. History (The new feature!)
with st.expander("📝 Patient History (One-time Setup)", expanded=True):
    history = st.text_area("Enter allergies/conditions:", "No known allergies. Surgery: Knee Replacement (3 days ago).")

# 3. Daily Check-in
st.subheader("Daily Check-in")
col1, col2 = st.columns(2)
with col1:
    pain = st.slider("Current Pain Level", 0, 10, 2)
with col2:
    mobility = st.selectbox("Mobility Status", ["Moving freely", "Stiff but moving", "Difficult to move", "Cannot move"])

img_file = st.camera_input("📸 Scan Wound / Face")

if img_file and st.button("Analyze Recovery"):
    if not api_key:
        st.error("Please enter an API key in the sidebar first!")
    else:
        with st.spinner("Analyzing with Gemini AI..."):
            
            # Prompt combines History + Vitals + Visuals
            prompt = f"""
            Act as a medical triage system for post-op recovery.
            
            PATIENT CONTEXT:
            - History: {history}
            - Reported Pain: {pain}/10
            - Mobility: {mobility}
            
            TASK:
            1. Analyze the image for visual signs of infection (redness, swelling, pus) or pain expressions.
            2. Combine visual data with the reported pain score.
            3. Determine a Triage Status: GREEN (Safe), YELLOW (Caution), or RED (Danger).
            
            OUTPUT FORMAT:
            - Status: [GREEN/YELLOW/RED]
            - Assessment: [1 sentence explanation]
            - Recommendation: [1 clear action step]
            """

            # Process image
            image = Image.open(img_file)

            try:
                # 4. The AI Brain (With Auto-Fallback)
                try:
                    # Try the fast, new model first
                    model = genai.GenerativeModel('gemini-1.5-flash')
                    response = model.generate_content([prompt, image])
                except Exception:
                    # If that fails (404 error), use the "Old Reliable" model
                    st.warning("⚠️ Using legacy model due to server version...")
                    model = genai.GenerativeModel('gemini-pro-vision')
                    response = model.generate_content([prompt, image])

                # 5. The Output
                st.write("---")
                st.subheader("Triage Results")

                if "RED" in response.text:
                    st.error(response.text)
                    st.warning("⚠️ Generating SBAR Report for Doctor...")
                elif "YELLOW" in response.text:
                    st.warning(response.text)
                    st.info("🤖 AI Follow-up: 'I noticed some swelling. Have you been icing it?'")
                else:
                    st.success(response.text)

            except Exception as e:
                st.error(f"Error connecting to AI: {e}")
