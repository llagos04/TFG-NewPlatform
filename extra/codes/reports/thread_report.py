import os
import json
import logging
from langchain_openai import ChatOpenAI
from colorama import Fore, Style
from dotenv import load_dotenv
load_dotenv()

# Logging configuration
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

def get_summary_model(api_key):
    """Configure and return the OpenAI model"""
    try:
        llm = ChatOpenAI(
            model_name='gpt-4o-mini',
            temperature=0.5,
            openai_api_key=api_key
        ).bind(response_format={"type": "json_object"})
        return llm
    except Exception as e:
        logger.error(f"Error configuring the ChatOpenAI model: {e}")
        raise

def generate_insights(context, api_key):
    """Generate summary, issues, and topic from a conversation at Atlanta Airport"""
    base_prompt = """
You are a conversation analyst for a Virtual Assistant (Assistant) interacting with passengers (User) at Hartsfield-Jackson Atlanta International Airport (ATL).

Analyze the following conversation and respond in **exactly** this JSON format without any extra explanation:

{
  "summary": "",  // 20 to 30 words describing the conversation.
  "issues": [
    {
      "type": "",  // ("Missing information", "Incomplete answer", "Other")
      "description": ""
    }
  ],
  "topic": ""  // Examples: Flight, Baggage, Security, Food, Transportation, Facilities, Other
}

Here is the conversation:\n\n
"""
    prompt = base_prompt + context
    llm = get_summary_model(api_key)
    response = llm.invoke(prompt)
    return response.content

def format_conversation(conversation):
    """Convert conversation to plain text prompt format"""
    return "\n".join(f"{msg['role']}: {msg['message']}" for msg in conversation)

def main():
    OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "sk-REPLACE-WITH-YOUR-KEY")
    if not OPENAI_API_KEY or "REPLACE-WITH-YOUR-KEY" in OPENAI_API_KEY:
        logger.error("The OpenAI API key is not properly configured.")
        return

    base_dir = os.path.dirname(__file__)
    threads_path = os.path.join(base_dir, "threads.json")
    insights_path = os.path.join(base_dir, "insights_output.json")
    issues_path = os.path.join(base_dir, "issues.json")

    try:
        with open(threads_path, 'r', encoding='utf-8') as f:
            threads = json.load(f)
    except FileNotFoundError:
        logger.error(f"File not found: '{threads_path}'.")
        return

    all_insights = []
    all_issues = []

    for thread in threads:
        thread_id = thread.get("thread_id")
        conversation = thread.get("conversation", [])
        if not conversation:
            logger.warning(f"Thread {thread_id} is empty or malformed. Skipping.")
            continue

        logger.info(f"Processing thread {thread_id}...")
        conversation_text = format_conversation(conversation)
        try:
            insight_json = generate_insights(conversation_text, OPENAI_API_KEY)

            print(f"{Fore.CYAN}Insights for thread {thread_id}:{Style.RESET_ALL}")
            print(insight_json)
            print("\n-----------------------------------")

            parsed = json.loads(insight_json)
            summary = parsed.get("summary", "")
            issues = parsed.get("issues", [])
            topic = parsed.get("topic", "")

            # Save full insight
            all_insights.append({
                "thread_id": thread_id,
                "summary": summary,
                "topic": topic,
                "issues": issues
            })

            # Save if any issues are present
            if issues:
                all_issues.append({
                    "thread_id": thread_id,
                    "summary": summary,
                    "issues": issues
                })

        except Exception as e:
            logger.error(f"Error processing thread {thread_id}: {e}")

    # Save results to JSON files
    with open(insights_path, 'w', encoding='utf-8') as out_json:
        json.dump(all_insights, out_json, ensure_ascii=False, indent=2)

    with open(issues_path, 'w', encoding='utf-8') as issue_json:
        json.dump(all_issues, issue_json, ensure_ascii=False, indent=2)

    logger.info(f"All insights saved to '{insights_path}'.")
    logger.info(f"Issues saved to '{issues_path}'.")

if __name__ == "__main__":
    main()
