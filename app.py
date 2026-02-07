import streamlit as st
import os
import sys
import subprocess

# --- HACKATHON "EMERGENCY FIX" ---
# This forces the server to upgrade the library even if requirements.txt fails
try:
    import google.generativeai as genai
    # specific check for the new version feature
    if not hasattr(genai, 'GenerativeModel'): 
        raise ImportError
except (ImportError, AttributeError):
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-U", "google-generativeai"])
    import google.generativeai as genai
# ---------------------------------

from PIL import Image

# 1. Setup
st.set_page_config(page_title="Recovery Agent", page_icon="🏥")
st.title("🏥 Post-Op Recovery Assistant")

# Sidebar
with st.sidebar:
    st.header("Settings")
    api_key = st.text_input("Enter Google Gemini API Key", type="password")
    
    # DEBUG INFO: Show the user what version is actually running
    try:
        ver = genai.__version__
    except:
        ver = "Unknown"
    st.caption(f"System Version: {ver}")
    
    st.info("Get key: [aistudio.google.com](https://aistudio.google.com/)")

if api_key:
    genai.configure(api_key=api_key)

# 2. History
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
            
            # Smart Model Selector
            # This asks Google: "What models do you actually have available right now?"
            active_model = None
            try:
                # Try the standard Flash model first
                active_model = genai.GenerativeModel('gemini-1.5-flash')
            except:
                st.error("Could not load Flash model. Trying fallback...")

            # Prompt
            prompt = f"""
            Act as a medical triage system.
            PATIENT: {history}
            PAIN: {pain}/10
            MOBILITY: {mobility}
            TASK: Analyze image for infection/pain.
            OUTPUT: Status (GREEN/YELLOW/RED) and advice.
            """

            image = Image.open(img_file)

            try:
                response = active_model.generate_content([prompt, image])
                
                st.write("---")
                st.subheader("Results")
                
                if "RED" in response.text:
                    st.error(response.text)
                elif "YELLOW" in response.text:
                    st.warning(response.text)
                else:
                    st.success(response.text)
                    
            except Exception as e:
                st.error(f"Connection Error: {e}")
                st.info("Tip: If this fails, your API Key might be invalid or needs to be refreshed in Google AI Studio.")
