# AutoGraph - Technical Documentation 📊

## 1. System Overview
AutoGraph is an intelligent data analysis platform that automatically converts raw datasets into interactive, optimal visual dashboards. It removes the need for manual data cleaning, column type identification, and chart selection by utilizing a rule-based inference engine.

## 2. Technology Stack
The application utilizes a decoupled, modern architecture:

### Frontend
- **Framework**: Next.js (React)
- **Styling**: Vanilla CSS (specifically targeting an Apple-style, "glassmorphism" aesthetic)
- **Data Visualization UI**: Plotly.js (via `react-plotly.js`)

### Backend 
- **Framework**: FastAPI (Python)
- **Data Manipulation**: Pandas & NumPy
- **Chart Generation**: Plotly Express (Python)
- **Server**: Uvicorn

---

## 3. Core Architecture & Data Flow

When a user interacts with the AutoGraph application, data flows through the following pipeline:

1. **Upload Phase**: User securely submits a file (`.csv`, `.xlsx`, or `.json`) via the drag-and-drop Next.js frontend.
2. **Ingestion & Parsing**: FastAPI catches the upload stream, loads the data into isolated memory (using `io.BytesIO`), and converts it into a universally operable Pandas `DataFrame`.
3. **Data Cleaning (`services/data_processing.py`)**: 
   - Empty or NA-exclusive columns are automatically dropped.
   - Rows containing missing data are trimmed for visualization accuracy (while safely returning the original set if the trimming is considered too destructive).
4. **Type Detection (`detect_column_types`)**: 
   - The engine iterates through the dataframe's headers and logically deduces the contextual type of each column. 
   - Available internal typings match to: `time-series`, `numerical`, `categorical`, or `text`.
5. **Intelligent Chart Engine (`services/chart_engine.py`)**: 
   - The backend runs a matching algorithm against the detected data types to pair column combinations with their optimal visualization counterparts.
6. **Frontend Rendition**: Plotly figures are serialized to JSON and delivered back to the React UI, which renders fully interactive, responsive charts.

---

## 4. The Intelligence Engine (Chart Selection Logic)

The core brain of AutoGraph is its ability to map abstract data types to visual charts. The engine supports the following chart heuristics out of the box:

* **Line Chart (Trend Analysis)**: Automatically generated if the dataset contains both a `time-series` column and at least one `numerical` column. 
* **Bar Chart (Comparative Total)**: Selected when a dataset contains a `categorical` grouping and a `numerical` column. Limits to the top 10 categories to avoid visual clutter.
* **Donut Chart (Part-to-Whole)**: Instantiated if a standalone `categorical` demographic is detected, breaking down its internal proportions.
* **Scatter Plot (Correlation Analysis)**: Deployed if the engine spots at least 2 distinct `numerical` columns, useful for identifying relationships between separate metrics.
* **Distribution Histogram**: Generated to analyze the spread, frequency, and density of a primary `numerical` column.

---

## 5. API Reference

### `GET /`
Standard health check.
**Returns**: `{"status": "ok", "message": "AutoGraph API is running"}`

### `POST /api/upload`
The primary endpoint for file processing.
* **Form Data**: `file` (UploadFile object)
* **Accepted Formats**: `text/csv`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, `application/json`

**Response Structure (JSON):**
```json
{
  "filename": "sales_data.csv",
  "summary": {
    "original_rows": 1000,
    "columns": 5,
    "dropped_na_rows": 12,
    "final_rows": 988
  },
  "columns": {
    "Date": "time-series",
    "Revenue": "numerical",
    "Region": "categorical"
  },
  "charts": [
    {
      "title": "Revenue Trend",
      "explanation": "Line chart selected because 'Date' acts as a logical timeline for 'Revenue'.",
      "plotly_data": { 
         // ... Plotly JSON figure schema 
      }
    }
  ]
}
```
