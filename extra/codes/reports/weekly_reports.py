import os
import json
import logging
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
load_dotenv()

# Minimal logging
logging.basicConfig(
    level=logging.INFO,
    format='[%(levelname)s] %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

def get_openai_model(api_key):
    """Configure ChatOpenAI model."""
    try:
        return ChatOpenAI(
            model_name='gpt-4o-mini',
            temperature=0.5,
            openai_api_key=api_key
        ).bind(response_format={"type": "json_object"})
    except Exception as e:
        logger.error(f"Failed to configure model: {e}")
        raise

def generate_consolidated_report(context, api_key):
    """Generate a weekly consolidated report from recommendations."""
    prompt = """
You are a summarizer and organizer of weekly assistant improvement recommendations.

Your task is to group, deduplicate, and merge similar recommendations, appending conversation IDs.

Your final response must strictly follow this JSON format:

{
    "missing_information": [
        {
            "recommendation": "...",
            "conversation_id": ["xxxx", "yyyy"]
        }
    ],
    "incomplete_answer": [
        {
            "recommendation": "...",
            "conversation_id": ["zzzz"]
        }
    ]
}

Guidelines:
- If a recommendation repeats, just merge the IDs into one entry.
- Keep responses compact, structured, and useful.
- No extra explanation or comments.

Here are the recommendations to consolidate:\n\n\n
""" + context

    model = get_openai_model(api_key)
    response = model.invoke(prompt)
    return response.content

def main():
    logger.info("Generating weekly consolidated report...")

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        logger.error("OPENAI_API_KEY is not set.")
        return

    base_dir = os.path.dirname(__file__)
    input_path = os.path.join(base_dir, "recommendations_output.json")
    output_path = os.path.join(base_dir, "weekly_report.json")

    try:
        with open(input_path, 'r', encoding='utf-8') as f:
            recommendations_data = json.load(f)
    except FileNotFoundError:
        logger.error(f"File not found: {input_path}")
        return

    # Combine all recommendation sections into one unified string
    all_text_blocks = []
    for part in recommendations_data:
        json_block = json.dumps(part["recommendations"], ensure_ascii=False)
        all_text_blocks.append(json_block)
    context = "\n".join(all_text_blocks)

    try:
        report = generate_consolidated_report(context, api_key)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(report)
        logger.info(f"Weekly report saved to '{output_path}'.")

    except Exception as e:
        logger.error(f"Error generating report: {e}")

if __name__ == "__main__":
    main()
