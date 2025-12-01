from rest_framework import serializers
from .models import Matter
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']


class MatterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Matter
        fields = '__all__'

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['approver_detail'] = UserSerializer(instance.approver).data
        return response


