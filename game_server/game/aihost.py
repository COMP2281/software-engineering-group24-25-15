from g4f.client import Client



# available model options
# connect your API key if needed

def gpt4free_request(message):
    client = Client()
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": 
                   message
                   }],
        web_search=False
    )
    return response.choices[0].message.content


# select the desired engine
model_request = gpt4free_request


def generate_hint(question_instance):
    """
    Generate a hint for a given Question instance.
    """
    question_text = question_instance.question_text
    topic = question_instance.category  # Renamed from 'topic' to match the model
    correct_answer = question_instance.correct_answer
    incorrect_answers = [
        question_instance.incorrect_answer1,
        question_instance.incorrect_answer2,
        question_instance.incorrect_answer3
    ]

    # Constructing the prompt efficiently
    message = (
        f"Question: {question_text}\n"
        f"Category: {topic}\n"
        f"Correct Answer: {correct_answer}\n"
        f"Incorrect Answers: {', '.join(incorrect_answers)}\n"
        "Provide a helpful hint guiding towards the correct answer without revealing it. Use max 1 sentence, be discrete, make hint more revealing."
    )


    # Send request to the GPT-based function
    response = model_request(message)

    return response

