from rest_framework import serializers
from .models import Matter

class MatterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Matter
        fields = '__all__'