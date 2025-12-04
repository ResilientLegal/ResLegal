import json
import requests
from datetime import datetime
from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django_filters.rest_framework import DjangoFilterBackend
from .models import Matter, MatterTransaction, User
from .serializers import MatterSerializer, MatterTransactionSerializer, UserSerializer

GRAPHQL_URL = "http://localhost:8000/graphql"
REST_URL = "http://localhost:18000/v1/transactions"

# ResilientDB URL
REST_URL = "http://localhost:18000/v1/transactions"


class MatterViewSet(viewsets.ModelViewSet):
    queryset = Matter.objects.all()
    serializer_class = MatterSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

def save_to_resilientdb(data):
    """Helper function to save data to ResilientDB"""
    try:
        r = requests.post(
            REST_URL + '/commit',
            headers={"Content-Type": "application/json"},
            data=json.dumps(data),
            timeout=10
        )
        if r.status_code == 200:
            return r.json().get('id')
    except Exception as e:
        print(f"ResilientDB error: {e}")
    return None


class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        full_name = request.data.get('fullName', '')
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response(
                {'message': 'Email and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(email=email).exists():
            return Response(
                {'message': 'User with this email already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create user in local DB
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=full_name.split(' ')[0] if full_name else '',
            last_name=' '.join(full_name.split(' ')[1:]) if full_name else ''
        )

        # Save registration to ResilientDB
        resdb_data = {
            "id": f"user-registration-{user.id}-{datetime.now().timestamp()}",
            "type": "user_registration",
            "user_id": user.id,
            "email": email,
            "full_name": full_name,
            "registered_at": datetime.now().isoformat()
        }
        resdb_tx_id = save_to_resilientdb(resdb_data)

        return Response({
            'message': 'Account created successfully',
            'resdb_tx_id': resdb_tx_id
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response(
                {'message': 'Email and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {'message': 'Invalid email or password'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.check_password(password):
            return Response(
                {'message': 'Invalid email or password'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Generate JWT token
        refresh = RefreshToken.for_user(user)

        # Save login activity to ResilientDB
        resdb_data = {
            "id": f"user-login-{user.id}-{datetime.now().timestamp()}",
            "type": "login_activity",
            "user_id": user.id,
            "email": email,
            "login_at": datetime.now().isoformat()
        }
        resdb_tx_id = save_to_resilientdb(resdb_data)

        return Response({
            'token': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'email': user.email,
                'fullName': f"{user.first_name} {user.last_name}".strip()
            },
            'resdb_tx_id': resdb_tx_id
        })

    
class MatterTransactionViewSet(viewsets.ModelViewSet):
    queryset = MatterTransaction.objects.all()
    serializer_class = MatterTransactionSerializer

    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['matter_id']

class CommitTransaction(APIView):
    def post(self, request):
        r = requests.post(REST_URL + '/commit', headers={"Content-Type": "application/json"}, data=json.dumps(request.data), timeout=10)
        return Response(r)


class GetTransaction(APIView):
    def get(self, request, txn_id):
        # try:
            r = requests.get(
                f'{REST_URL}/{txn_id}', 
                headers={"Content-Type": "application/json"}
            )
            r.raise_for_status()

            print("Transaction Response:", r.json())
            
            return Response(r.json())
        
        # except requests.exceptions.HTTPError as e:
        #     error_detail = e.response.text if e.response is not None else "Transaction not found or external error."
        #     return Response(
        #         {"error": "Failed to retrieve transaction", "details": error_detail},
        #         status=e.response.status_code if e.response is not None else status.HTTP_502_BAD_GATEWAY
        #     )
        # except Exception as e:
        #     return Response(
        #         {"error": "Could not connect to external service.", "details": str(e)},
        #         status=status.HTTP_503_SERVICE_UNAVAILABLE
        #     )
