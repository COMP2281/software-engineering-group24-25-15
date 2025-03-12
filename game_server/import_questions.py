import os
import django
import sys
import pandas as pd

# Ensure project root is in sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set Django settings
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "game_server.settings")
django.setup()

# Now import models
from game.models import Question

# Check if the Question table is empty
if Question.objects.exists():
    print("Database already contains questions. No new data inserted.")
else:
    # Read CSV
    df = pd.read_csv('GameQuestionsInitial.csv', encoding='utf-8')

    # Insert into DB
    questions = [
        Question(
            question_text=row['question_text'],
            category=row['category'],
            correct_answer=row['correct_answer'],
            incorrect_answer1=row['incorrect_answer1'],
            incorrect_answer2=row['incorrect_answer2'],
            incorrect_answer3=row['incorrect_answer3']
        )
        for _, row in df.iterrows()
    ]

    Question.objects.bulk_create(questions)  # Efficient bulk insert

    print("Data uploaded successfully!")
