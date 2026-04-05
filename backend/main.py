from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import pandas as pd
import io
import json

from services.data_processing import process_dataframe, detect_column_types
from services.chart_engine import generate_charts

app = FastAPI(title="AutoGraph API", description="Automatic Graph & Chart Generator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Since it's local dev, allow all for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "AutoGraph API is running"}

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    # Read file into memory
    content = await file.read()
    
    try:
        if file.filename.endswith('.csv'):
            try:
                df = pd.read_csv(io.BytesIO(content))
            except UnicodeDecodeError:
                 # fallback to robust encoding
                 df = pd.read_csv(io.BytesIO(content), encoding='latin1')
        elif file.filename.endswith('.xlsx') or file.filename.endswith('.xls'):
            df = pd.read_excel(io.BytesIO(content))
        elif file.filename.endswith('.json'):
            df = pd.read_json(io.BytesIO(content))
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format. Please upload CSV, Excel, or JSON.")
            
        # Process the dataframe
        df_cleaned, summary = process_dataframe(df)
        
        # Analyze data types
        col_types = detect_column_types(df_cleaned)
        
        # Generate optimal charts
        charts = generate_charts(df_cleaned, col_types)
        
        return {
            "filename": file.filename,
            "summary": summary,
            "columns": col_types,
            "charts": charts
        }
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")
