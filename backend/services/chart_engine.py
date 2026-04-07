import pandas as pd
import plotly.express as px
import plotly.io as pio
import json
import traceback

def safe_json_dump(fig, title, explanation):
    try:
        # returns dict which can be json serialized by FastAPI
        chart_json = json.loads(pio.to_json(fig, engine="json"))
        return {
            "title": title,
            "explanation": explanation,
            "plotly_data": chart_json
        }
    except Exception as e:
        print(f"Error converting chart to JSON: {e}")
        return None

def generate_charts(df: pd.DataFrame, col_types: dict):
    """
    Recommends and generates charts based on column types and data structure.
    Returns a list of plotly JSON figures with explanations.
    """
    charts = []
    
    numerics = [k for k, v in col_types.items() if v == 'numerical']
    categoricals = [k for k, v in col_types.items() if v == 'categorical']
    timeseries = [k for k, v in col_types.items() if v == 'time-series']
    
    # Transparent background logic for Plotly
    template = "plotly_white"
    layout_update = dict(
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        font=dict(family="Inter, sans-serif", color="#333"),
        title_font=dict(size=18, family="Inter, sans-serif", color="#111"),
        margin=dict(l=40, r=40, t=60, b=40)
    )
    
    # 1. Provide a Line Chart if Time-Series + Numeric exists
    if timeseries and numerics:
        time_col = timeseries[0]
        val_col = numerics[0]
        try:
            df_plot = df.copy()
            df_plot[time_col] = pd.to_datetime(df_plot[time_col])
            df_plot = df_plot.sort_values(by=time_col)
            
            fig = px.line(df_plot, x=time_col, y=val_col, title=f"Trend of {val_col} over Time", template=template)
            fig.update_layout(**layout_update)
            fig.update_traces(line=dict(width=3, color='#4A90E2'))
            
            explanation = f"Line chart selected because '{time_col}' acts as a logical timeline for '{val_col}'."
            chart_data = safe_json_dump(fig, f"{val_col} Trend", explanation)
            if chart_data: charts.append(chart_data)
        except Exception as e:
            print("Failed generating line chart", traceback.format_exc())

    # 2. Bar chart if Categorical + Numeric
    if categoricals and numerics:
        cat_col = categoricals[0]
        val_col = numerics[0]
        try:
            df_agg = df.groupby(cat_col)[val_col].sum().reset_index()
            if len(df_agg) > 10:
                df_agg = df_agg.sort_values(by=val_col, ascending=False).head(10)
                
            fig = px.bar(df_agg, x=cat_col, y=val_col, title=f"Top {cat_col} by {val_col}", template=template, color=cat_col, color_discrete_sequence=px.colors.qualitative.Pastel)
            fig.update_layout(**layout_update)
            explanation = f"Bar chart chosen to compare the total '{val_col}' across different '{cat_col}' groups."
            chart_data = safe_json_dump(fig, f"{cat_col} Distribution", explanation)
            if chart_data: charts.append(chart_data)
        except Exception as e:
            print("Failed generating bar chart", traceback.format_exc())

    # 3. Pie Chart if single categorical (Part-to-whole)
    if categoricals:
        cat_col = categoricals[0]
        try:
            df_counts = df[cat_col].value_counts().reset_index()
            df_counts.columns = [cat_col, 'count']
            if len(df_counts) > 10:
                df_counts = df_counts.head(10)
                
            fig = px.pie(df_counts, values='count', names=cat_col, title=f"Composition of {cat_col}", hole=0.4, color_discrete_sequence=px.colors.qualitative.Pastel)
            fig.update_layout(**layout_update)
            explanation = f"Donut chart generated to display the part-to-whole breakdown of '{cat_col}' categories."
            chart_data = safe_json_dump(fig, f"{cat_col} Proportions", explanation)
            if chart_data: charts.append(chart_data)
        except:
            pass

    # 4. Scatter plot if at least 2 numerics
    if len(numerics) >= 2:
        x_col = numerics[0]
        y_col = numerics[1]
        try:
            color_col = categoricals[0] if categoricals else None
            df_plot = df.sample(min(1000, len(df))) if len(df) > 1000 else df
            
            fig = px.scatter(df_plot, x=x_col, y=y_col, color=color_col, title=f"Relationship: {y_col} vs {x_col}", template=template, opacity=0.7, color_discrete_sequence=px.colors.qualitative.Pastel)
            fig.update_layout(**layout_update)
            explanation = f"Scatter plot included to visualize any possible correlation between '{x_col}' and '{y_col}'."
            chart_data = safe_json_dump(fig, "Correlation Analysis", explanation)
            if chart_data: charts.append(chart_data)
        except:
            pass

    # 5. Histogram for distribution of the primary numeric
    if numerics:
        val_col = numerics[0]
        try:
             # Just limit the rows if it's super huge
            df_plot = df.sample(min(5000, len(df))) if len(df) > 5000 else df
            fig = px.histogram(df_plot, x=val_col, title=f"Distribution map for {val_col}", template=template, marginal="box", opacity=0.8, color_discrete_sequence=['#50E3C2'])
            fig.update_layout(**layout_update)
            explanation = f"Histogram selected to detail the spread and common values of '{val_col}'."
            chart_data = safe_json_dump(fig, f"{val_col} Spread", explanation)
            if chart_data: charts.append(chart_data)
        except:
            pass

    return charts
