# AutoGraph 📊

AutoGraph is a web application that automatically detects data structures from uploaded files and generates optimal, interactive visualizations built by none other than your's truly.

## 📂 Project Structure

This repository is split into two main parts:
* **`frontend/`**: The Next.js user interface and web application.
* **`backend/`**: The FastAPI server that handles data processing logic.

---

## 🛠️ Installation & Setup (First Time Only)

now to run this project, you first need to generate the dependency folders for both the frontend and backend on your local machine.

### 1. Backend Setup (Python)
make sure you have Python 3 installed (ik u do, still make sure), then open your terminal at the root of the project and run:
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

once dependencies are installed, you don't need to manually start each server. just run the unified bash script that I wrote at the root directory to boot up both the frontend and backend simultaneously!

i wrote the bash script so that you dont have to run many commands in the terminal. it will start both the frontend and backend servers simultaneously and its executable.

```bash
./run.sh
```

*(Note: If you get a "permission denied" error, make the script executable by running `chmod +x run.sh` first).*

**That's it!** You can now visit the application at:
* 🌐 **Frontend**: http://localhost:3000
* ⚙️ **Backend API**: http://127.0.0.1:8000

when you are done, simply press `Ctrl+C` in your terminal to gracefully stop both servers.


you're welcome.