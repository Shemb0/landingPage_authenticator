from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from .models import Cliente
from .serializers import ClienteSerializers

class ClientListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        data = Cliente.objects.all()
        serializer = ClienteSerializers(data, many=True)
        return Response({"message": serializer.data}, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ClienteSerializers(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ClientView(APIView):
    def get(self,request,pk):
        try:
            data = Cliente.objects.get(pk=pk)
        except Cliente.DoesNotExist:
            return Response({"error":"ususario no encontrado"},status= status.HTTP_404_NOT_FOUND)

        serializer = ClienteSerializers(data)
        return Response ({"message":serializer.data},status=status.HTTP_200_OK)
    
