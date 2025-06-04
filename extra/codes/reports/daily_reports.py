import os
import json
import logging
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
load_dotenv()

# Minimal logging configuration
logging.basicConfig(
    level=logging.INFO,
    format='[%(levelname)s] %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

def sort_issues(issues):
    """Sort issues, placing 'Missing information' issues first."""
    missing = [i for i in issues if i['issues'][0]['type'] == 'Missing information']
    others = [i for i in issues if i['issues'][0]['type'] != 'Missing information']
    return missing + others

def get_openai_model(api_key):
    """Initialize ChatOpenAI with JSON output format."""
    try:
        return ChatOpenAI(
            model_name='gpt-4o-mini',
            temperature=0.5,
            openai_api_key=api_key
        ).bind(response_format={"type": "json_object"})
    except Exception as e:
        logger.error(f"Failed to configure model: {e}")
        raise

def generate_recommendations(context, api_key):
    """Send a structured prompt to the model and return its JSON response."""
    prompt = """
You are a recommendation generator for improving a virtual assistant that uses a RAG (Retrieval-Augmented Generation) system and custom workflows.

Your response will go into a report presented to the assistant's owner.

There are three types of issues: "Missing information", "Incomplete answer", and "Other".

Return your response strictly in this JSON format:

{
    "missing_information": [
        {
            "recommendation": "...",
            "conversation_id": "xxxx"
        }
    ],
    "incomplete_answer": [
        {
            "recommendation": "...",
            "conversation_id": "xxxx"
        }
    ]
}

Context:
- The assistant is powered by a RAG knowledge base.
- It also has custom workflows for specific scenarios.

Rules:
- Keep each recommendation short and specific (max 15 words).
- Avoid unnecessary or repeated advice.
- Always include the related thread ID as 'conversation_id'.

Here are the issues to analyze:\n\n\n
""" + context

    llm = get_openai_model(api_key)
    response = llm.invoke(prompt)
    return response.content

def split_list(data, parts):
    """Split a list into approximately equal parts."""
    size = len(data)
    base = size // parts
    remainder = size % parts
    result = []
    start = 0

    for i in range(parts):
        end = start + base + (1 if i < remainder else 0)
        result.append(data[start:end])
        start = end

    return result

def main():
    logger.info("Generating assistant improvement recommendations...")

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        logger.error("OPENAI_API_KEY is not set.")
        return

    base_dir = os.path.dirname(__file__)
    issues_path = os.path.join(base_dir, "issues.json")
    output_path = os.path.join(base_dir, "recommendations_output.json")

    try:
        with open(issues_path, 'r', encoding='utf-8') as f:
            issues = json.load(f)
    except FileNotFoundError:
        logger.error(f"Issues file not found: {issues_path}")
        return

    # Split issues into 7 parts.
    # This is intentional: in production, we generate a daily report from all conversations,
    # so each part corresponds to one day of the week.
    # This script (daily_reports.py) summarizes all issues across conversations into a daily summary.
    # In contrast, `threads_report.py` analyzes each conversation individually.
    # Later, a `weekly_reports.py` script will aggregate 7 daily summaries into a weekly report.
    parts = split_list(issues, 7)
    all_recommendations = []

    for idx, part in enumerate(parts, start=1):
        logger.info(f"Processing part {idx}/7...")
        sorted_part = sort_issues(part)
        context = "\n".join(str(issue) for issue in sorted_part)
        try:
            result = generate_recommendations(context, api_key)
            all_recommendations.append({
                "part": idx,
                "recommendations": json.loads(result)
            })
        except Exception as e:
            logger.error(f"Error in part {idx}: {e}")

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(all_recommendations, f, ensure_ascii=False, indent=2)

    logger.info(f"Recommendations saved to '{output_path}'.")

if __name__ == "__main__":
    main()
