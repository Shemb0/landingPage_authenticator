from django.urls import path
from .views import UploadFile, ChatView, ChatPageView

urlpatterns = [
    path("", ChatPageView.as_view(), name="chat-page"),
    path("upload/", UploadFile.as_view(), name="upload"),
    path("chat/", ChatView.as_view(), name="chat"),
]
