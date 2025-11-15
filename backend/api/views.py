from django.shortcuts import render
from rest_framework import viewsets
from .models import Matter
from .serializers import MatterSerializer

class MatterViewSet(viewsets.ModelViewSet):
    queryset = Matter.objects.all()
    serializer_class = MatterSerializer