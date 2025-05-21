# 🚨 LeetCode Anti-Cheat System

## **🔍 Overview**
Cheating in online coding competitions is a growing problem, with AI-generated and plagiarized solutions undermining fair play. This **LeetCode Anti-Cheat System** is designed to detect and **automatically flag AI-generated and copied code** in **real-time** during live contests.

## **🚀 Features**
✅ **Live Monitoring:** Tracks live LeetCode contest submissions automatically.  
✅ **AI-Detection:** Uses **local Mistral LLM** to determine if the code was AI-generated.  
✅ **Plagiarism Check:** Searches for duplicate code using **FAISS-based vector similarity**.  
✅ **Auto Ban System:** Instantly flags and stores banned users in **Redis**.  
✅ **Admin Dashboard:** A **Gradio-based UI** to review flagged users in real time.  
✅ **Email Alerts:** Notifies contest admins whenever a user is flagged.  
✅ **Fully Open-Source & Self-Hosted:** No external APIs required!  

---

## **🛠 Installation & Setup**

### **1️⃣ Install Dependencies**
Ensure you have Python **3.10+** installed. Then, run:
```bash
pip install fastapi gradio torch transformers faiss-cpu redis requests smtplib uvicorn
```
Also, make sure **Redis** is installed:
```bash
sudo apt install redis-server  # Ubuntu
brew install redis             # macOS
```
Start Redis:
```bash
redis-server --daemonize yes
```

### **2️⃣ Download & Load Mistral Model Locally**
```python
from transformers import AutoModelForCausalLM, AutoTokenizer

model_name = "mistralai/Mistral-7B-v0.1"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)
model.save_pretrained("./mistral_local/")
tokenizer.save_pretrained("./mistral_local/")
```

### **3️⃣ Run the Anti-Cheat System**
```bash
python leetcode_anti_cheat.py
```
This will launch both **FastAPI & Gradio UI**.

---

## **📡 How It Works**
1️⃣ **Fetches live contest submissions** via the LeetCode API.  
2️⃣ **Detects AI-generated code** using Mistral LLM.  
3️⃣ **Checks for plagiarism** using FAISS vector search.  
4️⃣ **Flags suspicious users** in Redis & logs them.  
5️⃣ **Admin can monitor flagged users** via the Gradio UI.  

---

## **📊 Monitoring & Admin Dashboard**
Open the **Gradio Admin Dashboard** to see flagged users:
```bash
http://127.0.0.1:7860
```
👀 **Admins can check all flagged users in real time!**

---

## **🖥️ Docker Deployment (Optional)**
For an easy setup, use Docker:

### **1️⃣ Create `Dockerfile`**
```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY . /app
RUN pip install --no-cache-dir fastapi gradio torch transformers faiss-cpu redis requests smtplib uvicorn
RUN apt-get update && apt-get install -y redis-server
CMD ["uvicorn", "leetcode_anti_cheat:app", "--host", "0.0.0.0", "--port", "8000"]
```

### **2️⃣ Build & Run the Docker Container**
```bash
docker build -t leetcode-anti-cheat .
docker run -p 8000:8000 leetcode-anti-cheat
```
The **Anti-Cheat UI** will now be available at:
```bash
http://localhost:8000
```

---

## **📢 Future Enhancements**
🔹 **Leaderboard Monitoring** – Detect sudden jumps in rankings.  
🔹 **Contest Analytics Dashboard** – Track flagged users over multiple contests.  
🔹 **Live Moderation Panel** – Admins can manually review & unban users.  

💡 *Have ideas? Open an issue or contribute!* 🙌

---

## **🎯 Contributing**
This project is **open-source**! Feel free to fork, improve, and submit PRs.

💬 **For questions or collaborations, reach out!**

🚀 **Let's keep coding competitions fair!** 🔥

# LeetCode Anti-Cheat Extension

A Chrome extension that helps detect potential cheating during LeetCode contests and MAANG interviews by monitoring suspicious activities.

## Features

- Monitors for suspicious activities during LeetCode contests and interviews:
  - Multiple tabs/windows open
  - Copy-paste operations
  - Switching between applications
  - Unusual typing patterns
  - Multiple submissions in short time intervals
- Real-time notifications for suspicious activities
- Activity log with timestamps
- Easy-to-use popup interface

## Installation

1. Clone this repository or download the files
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory

## Usage

1. Click the extension icon in your Chrome toolbar to open the popup
2. Click "Start Monitoring" to begin monitoring for suspicious activities
3. The extension will automatically detect when you're in a LeetCode contest or interview
4. Suspicious activities will be logged and displayed in the popup
5. Click "Stop Monitoring" to stop the monitoring

## Privacy

This extension:
- Only monitors activities on LeetCode domains
- Stores all data locally in your browser
- Does not send any data to external servers
- Can be easily disabled or removed

## Development

The extension consists of:
- `manifest.json`: Extension configuration
- `background.js`: Background monitoring service
- `content.js`: Page interaction monitoring
- `popup.html` & `popup.js`: User interface

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License

