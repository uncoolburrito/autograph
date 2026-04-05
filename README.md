# AutoGraph 📊

AutoGraph is a web application that automatically detects data structures from uploaded files and generates optimal, interactive visualizations.

## 📂 Project Structure

This repository is split into two main parts:
* **`frontend/`**: The Next.js user interface and web application.
* **`backend/`**: The FastAPI server that handles data processing logic.

---

## 🛠️ Installation & Setup (First Time Only)

To run this project, you first need to generate the dependency folders for both the frontend and backend on your local machine.

### 1. Backend Setup (Python)
Ensure you have Python 3 installed, then open your terminal at the root of the project and run:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..
```

### 2. Frontend Setup (Node.js)
Ensure you have Node.js installed, then run:
```bash
cd frontend
npm install
cd ..
```

---

## 🚀 Running the Application

Once dependencies are installed, you don't need to manually start each server. Just run the unified bash script at the root directory to boot up both the frontend and backend simultaneously!

```bash
./run.sh
```

*(Note: If you get a "permission denied" error, make the script executable by running `chmod +x run.sh` first).*

**That's it!** You can now visit the application at:
* 🌐 **Frontend**: http://localhost:3000
* ⚙️ **Backend API**: http://127.0.0.1:8000

When you are done, simply press `Ctrl+C` in your terminal to gracefully stop both servers.
