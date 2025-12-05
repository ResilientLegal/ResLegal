import json
import base64
import requests
from datetime import datetime
from django.shortcuts import render
from django.contrib.auth.models import User
from django.core.files.storage import default_storage
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django_filters.rest_framework import DjangoFilterBackend
from .models import Matter, MatterTransaction, Attachment
from .serializers import MatterSerializer, MatterTransactionSerializer, UserSerializer

GRAPHQL_URL = "http://localhost:8000/graphql"
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

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=full_name.split(' ')[0] if full_name else '',
            last_name=' '.join(full_name.split(' ')[1:]) if full_name else ''
        )

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

        refresh = RefreshToken.for_user(user)

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
        r = requests.post(
            REST_URL + '/commit',
            headers={"Content-Type": "application/json"},
            data=json.dumps(request.data),
            timeout=10
        )
        return Response(r.json())


class GetTransaction(APIView):
    def get(self, request, txn_id):
        r = requests.get(
            f'{REST_URL}/{txn_id}',
            headers={"Content-Type": "application/json"}
        )
        r.raise_for_status()
        print("Transaction Response:", r.json())
        return Response(r.json())


class AttachmentUploadView(APIView):
    def post(self, request, matter_id):
        try:
            matter = Matter.objects.get(id=matter_id)
        except Matter.DoesNotExist:
            return Response({'message': 'Matter not found'}, status=status.HTTP_404_NOT_FOUND)

        file = request.FILES.get('file')
        uploaded_by = request.data.get('uploaded_by', 'Unknown')

        if not file:
            return Response({'message': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

        file_content = file.read()
        file_base64 = base64.b64encode(file_content).decode('utf-8')
        file.seek(0)

        filename = file.name
        file_path = default_storage.save(f'attachments/{filename}', file)

        file_size = len(file_content)
        file_type = file.content_type

        resdb_data = {
            "id": f"attachment-{matter_id}-{datetime.now().timestamp()}",
            "type": "attachment",
            "filename": filename,
            "file_type": file_type,
            "file_size": file_size,
            "file_content": file_base64,
            "uploaded_by": uploaded_by,
            "uploaded_at": datetime.now().isoformat(),
            "matter_id": matter_id
        }
        resdb_tx_id = save_to_resilientdb(resdb_data)

        attachment = Attachment.objects.create(
            matter=matter,
            file=file_path,
            filename=filename,
            uploaded_by=uploaded_by,
            resdb_tx_id=resdb_tx_id
        )

        return Response({
            'message': 'File uploaded successfully',
            'attachment': {
                'id': attachment.id,
                'filename': attachment.filename,
                'uploaded_by': attachment.uploaded_by,
                'uploaded_at': attachment.uploaded_at.isoformat(),
                'file_size': file_size,
                'resdb_tx_id': resdb_tx_id
            }
        }, status=status.HTTP_201_CREATED)


class AttachmentListView(APIView):
    def get(self, request, matter_id):
        try:
            matter = Matter.objects.get(id=matter_id)
        except Matter.DoesNotExist:
            return Response({'message': 'Matter not found'}, status=status.HTTP_404_NOT_FOUND)

        attachments = Attachment.objects.filter(matter=matter)
        data = [{
            'id': att.id,
            'filename': att.filename,
            'uploaded_by': att.uploaded_by,
            'uploaded_at': att.uploaded_at.isoformat(),
            'resdb_tx_id': att.resdb_tx_id
        } for att in attachments]

        return Response(data)