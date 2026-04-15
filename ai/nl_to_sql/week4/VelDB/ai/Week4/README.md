# VelDB AI Module (Week 4)

## Project Overview
VelDB is an AI-powered database system where users enter natural language queries, which are converted into SQL and executed. The results are further enriched by smart features to generate business reports and detect key insights from the data.

## Features
- **NL to SQL:** Converts natural language queries to SQL using rule-based/prompt-based templates.
- **Insights Engine:** Detects trends, minimums, and maximum values from query responses.
- **Report Generator:** Formats raw query data into a professional textual report.
- **Accuracy Tracking:** Evaluates the conversion quality between User NL and SQL generation.

## Setup Steps
1. Ensure Python 3 is installed.
2. Install the necessary requirements:
   ```bash
   pip install -r requirements.txt
   ```

## How to Run API
Start the FastAPI server:
```bash
uvicorn app:app --reload
```
The API will be available at `http://127.0.0.1:8000`. 
Interactive Swagger docs are auto-generated at: `http://127.0.0.1:8000/docs`

## Example Requests

### Generate Report
```bash
curl -X 'POST' \
  'http://127.0.0.1:8000/generate_report' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "results": [
    {"month": "Jan", "sales": 10000},
    {"month": "Feb", "sales": 15000},
    {"month": "Mar", "sales": 8000}
  ]
}'
```

### Get Data Insights
```bash
curl -X 'POST' \
  'http://127.0.0.1:8000/insights' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "results": [
    {"month": "Jan", "sales": 10000},
    {"month": "Feb", "sales": 15000},
    {"month": "Mar", "sales": 8000}
  ]
}'
```
