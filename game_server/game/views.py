from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, generics, permissions
import random

from .models import Question, Statistics
from .serializers import QuestionSerializer, StatisticsSerializer

from .aihost import generate_hint, model_request

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_questions(request):
    # 1) Get filter and number of questions from the JSON body
    category_param = request.data.get('category', None)
    n_param = request.data.get('n')
    hint_param = request.data.get('hint', False)  # Could be True or False

    # Convert hint_param to an actual boolean
    # (since request.data can contain a string or other types)
    if str(hint_param).lower() in ['true', '1']:
        hint_param = True
    else:
        hint_param = False

    # 2) Convert n_param to integer safely
    try:
        n = int(n_param)
    except (TypeError, ValueError):
        n = 2  # fallback if invalid or missing

    # 3) Filter questions by category if provided
    if category_param:
        questions_qs = Question.objects.filter(category=category_param)
    else:
        questions_qs = Question.objects.all()

    # 4) If no questions found, return 404
    question_count = questions_qs.count()
    if question_count == 0:
        return Response({"detail": "No questions found."},
                        status=status.HTTP_404_NOT_FOUND)

    # Ensure n doesn't exceed the total number of questions
    n = min(n, question_count)

    # Convert queryset to list for random sample
    questions_list = list(questions_qs)

    # Randomly select n questions
    selected_questions = random.sample(questions_list, n)

    # 5) Serialize
    serializer = QuestionSerializer(selected_questions, many=True)
    data = serializer.data  # This is a list of serialized question dicts

    # 6) If hint_param is True, inject a "hint" field into each question
    if hint_param:
        for i, question_data in enumerate(data):
            question_obj = selected_questions[i]
            question_data['hint'] = generate_hint(question_obj)

    # 7) Return the final response
    return Response(data, status=status.HTTP_200_OK)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_responce(request):
    user_request = request.data.get('request', None)
    
    model_responce = model_request(user_request)
    
    return Response(model_responce, status=status.HTTP_200_OK)


class UserStatisticsView(generics.RetrieveUpdateAPIView):
    """
    GET:    Retrieve the current user's statistics
    PUT:    Update (or create) the current user's statistics
    PATCH:  Partially update the current user's statistics
    """
    serializer_class = StatisticsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # "self.request.user" is the currently authenticated user
        # "user.statistics" is the OneToOne relationship on the Statistics model
        return self.request.user.statistics
    

class UserStatisticsDetailView(generics.RetrieveAPIView):
    """
    GET: Retrieve the statistics of any user by their user ID.
    """
    queryset = Statistics.objects.all()
    serializer_class = StatisticsSerializer
    permission_classes = [permissions.IsAuthenticated]  # Adjust as needed
    lookup_field = "user_id"  # This allows querying by user_id