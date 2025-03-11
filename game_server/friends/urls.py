from django.urls import path
from . import views

urlpatterns = [
    path('friends/<int:user_id>/', views.list_friends, name='list-friends'),  # GET
    path('friends/', views.list_friends, name='list-friends-current'),        # GET
    path('requests/sent/', views.list_sent_requests, name='list-sent-requests'),     # GET
    path('requests/received/', views.list_received_requests, name='list-received-requests'), # GET
    path('request/send/', views.send_friend_request, name='send-friend-request'),     # POST
    path('request/accept/', views.accept_friend_request, name='accept-friend-request'), # POST
]
