import os
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) 
ENV_PATH = os.path.join(BASE_DIR, "..",  ".env")  


load_dotenv(ENV_PATH)


IBM_CLOUD_URL = os.getenv("IBM_CLOUD_URL")
IBM_API_KEY = os.getenv("IBM_API_KEY")
IBM_MODEL_ID = os.getenv("IBM_MODEL_ID")
IBM_PROJECT_ID = os.getenv("IBM_PROJECT_ID")




def ibm_granite_request(message):
    from ibm_watsonx_ai import APIClient
    from ibm_watsonx_ai import Credentials
    from ibm_watsonx_ai.foundation_models import ModelInference

    if not all([IBM_CLOUD_URL, IBM_API_KEY, IBM_MODEL_ID, IBM_PROJECT_ID]):
        raise ValueError("Missing required environment variables for IBM Watson.")

    credentials = Credentials(
        url=IBM_CLOUD_URL,
        api_key=IBM_API_KEY,
    )

    client = APIClient(credentials)

    model = ModelInference(
        model_id=IBM_MODEL_ID,
        api_client=client,
        project_id=IBM_PROJECT_ID,
        params={
            "max_new_tokens": 100
        }
    )

    return model.generate_text(message)


model_request = ibm_granite_request


def generate_hint(question_instance):
    """
    Generate a hint for a given Question instance.
    """
    question_text = question_instance.question_text
    topic = question_instance.category  
    correct_answer = question_instance.correct_answer
    incorrect_answers = [
        question_instance.incorrect_answer1,
        question_instance.incorrect_answer2,
        question_instance.incorrect_answer3
    ]

    message = (
        f"Question: {question_text}\n"
        f"Category: {topic}\n"
        f"Correct Answer: {correct_answer}\n"
        f"Incorrect Answers: {', '.join(incorrect_answers)}\n"
        "Provide a helpful hint guiding towards the correct answer, but do not print the answer. Use max 1 sentence, be discrete, make hint more revealing."
    )

    response = model_request(message)

    return response

