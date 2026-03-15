from django.views.generic import TemplateView
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny


class ChatPageView(TemplateView):
    template_name = "chat.html"
from .models import Document
from .serializers import DocumentSerializer
from .agent import get_retriever, index_pdf_from_bytes, chat_with_rag
from langchain_community.chat_message_histories import ChatMessageHistory

sessions = {}


class UploadFile(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        file = request.FILES.get("file")
        try:
            if not file:
                return Response(
                    {"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST
                )
            if not file.name.endswith(".pdf"):
                return Response(
                    {"error": "Only PDF files are allowed"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            else:
                pdf_bytes = file.read()
                doc = Document.objects.create(
                    name=file.name,
                    file=pdf_bytes,
                    file_size=len(pdf_bytes),
                    is_indexed=False,
                )
                try:
                    chunks_count = index_pdf_from_bytes(pdf_bytes,)
                    doc.is_indexed = True
                    doc.save()
                    return Response(
                        {
                            **DocumentSerializer(doc).data,
                            "chunks_indexed": chunks_count,
                        },
                        status=status.HTTP_201_CREATED,
                    )
                except Exception as e:
                    return Response(
                        {**DocumentSerializer(doc).data, "warning": str(e)},
                        status=status.HTTP_201_CREATED,
                    )
        except Exception as e:
            return Response(
                {**DocumentSerializer(doc).data, "warning": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class ChatView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        query = request.data.get("query")
        if not query:
            return Response({"error": "No query provided"}, status=status.HTTP_400_BAD_REQUEST)

        session_key = request.session.session_key
        if not session_key:
            request.session.create()
            session_key = request.session.session_key

        if session_key not in sessions:
            sessions[session_key] = ChatMessageHistory()

        memory = sessions[session_key]
        response = chat_with_rag(query, memory)
        return Response({"response": response}, status=status.HTTP_200_OK)
