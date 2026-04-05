import pandas as pd
import numpy as np

def process_dataframe(df: pd.DataFrame):
    """
    Cleans the dataframe by handling basic missing values and returns a summary.
    """
    # basic summary
    rows, cols = df.shape
    
    # Simple cleaning: drop columns that are entirely NA
    df = df.dropna(axis=1, how='all')
    
    original_len = len(df)
    df_cleaned = df.dropna()
    dropped = original_len - len(df_cleaned)
    
    summary = {
        "original_rows": rows,
        "columns": cols,
        "dropped_na_rows": dropped,
        "final_rows": len(df_cleaned)
    }
    
    # if it drops too many rows on naive dropna, just return original to let Plotly handle missing
    if len(df_cleaned) == 0 and original_len > 0:
        return df, summary
        
    return df_cleaned, summary

def detect_column_types(df: pd.DataFrame):
    """
    Infers the types of columns (numerical, categorical, time-series)
    """
    col_types = {}
    for col in df.columns:
        # Check if it can be converted to datetime
        is_datetime = False
        if df[col].dtype == 'object':
            try:
                # Try parsing the first few non-null elements
                sample = df[col].dropna().head(10)
                if not sample.empty:
                    # check if the sample looks like dates, avoid parsing plain numbers as dates
                    if any('-' in str(x) or '/' in str(x) for x in sample):
                        # check if we can parse it
                        pd.to_datetime(sample)
                        col_types[col] = "time-series"
                        is_datetime = True
            except:
                pass
                
        if is_datetime:
            continue
            
        if pd.api.types.is_numeric_dtype(df[col]):
            # Check if it's actually categorical (like an ID or year)
            unique_vals = df[col].nunique()
            if unique_vals < 10 and unique_vals < len(df) * 0.1:
                col_types[col] = "categorical"
            else:
                col_types[col] = "numerical"
        else:
            # Check unique values to ensure it's categorical
            unique_vals = df[col].nunique()
            if unique_vals < 20 or unique_vals < len(df) * 0.5:
                 col_types[col] = "categorical"
            else:
                 col_types[col] = "text"
                 
    return col_types
