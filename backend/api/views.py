import json
import base64
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import render
from rest_framework import viewsets
from .models import Matter, Attachment
from .serializers import MatterSerializer
from django.core.files.storage import default_storage
from datetime import datetime

GRAPHQL_URL = "http://localhost:8000/graphql"
REST_URL = "http://localhost:18000/v1/transactions"


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


class MatterViewSet(viewsets.ModelViewSet):
    queryset = Matter.objects.all()
    serializer_class = MatterSerializer


class CommitTransaction(APIView):
    def post(self, request):
        r = requests.post(REST_URL + '/commit', headers={"Content-Type": "application/json"}, data=json.dumps(request.data), timeout=10)
        return Response(r)


class GetTransaction(APIView):
    def get(self, request, txn_id):
        r = requests.get(REST_URL + f'/{txn_id}', headers={"Content-Type": "application/json"})
        if (r):
            return Response(r.json())


class AttachmentUploadView(APIView):
    def post(self, request, matter_id):
        try:
            matter = Matter.objects.get(id=matter_id)
        except Matter.DoesNotExist:
            return Response({'message': 'Matter not found'}, status=404)

        file = request.FILES.get('file')
        uploaded_by = request.data.get('uploaded_by', 'Unknown')

        if not file:
            return Response({'message': 'No file provided'}, status=400)

        # Read file content and encode to base64
        file_content = file.read()
        file_base64 = base64.b64encode(file_content).decode('utf-8')
        
        # Reset file pointer for saving locally
        file.seek(0)

        # Save file locally
        filename = file.name
        file_path = default_storage.save(f'attachments/{filename}', file)

        # Get file size and type
        file_size = len(file_content)
        file_type = file.content_type

        # Save file data to ResilientDB (metadata + content)
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

        # Save to local DB
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
        }, status=201)


class AttachmentListView(APIView):
    def get(self, request, matter_id):
        try:
            matter = Matter.objects.get(id=matter_id)
        except Matter.DoesNotExist:
            return Response({'message': 'Matter not found'}, status=404)

        attachments = Attachment.objects.filter(matter=matter)
        data = [{
            'id': att.id,
            'filename': att.filename,
            'uploaded_by': att.uploaded_by,
            'uploaded_at': att.uploaded_at.isoformat(),
            'resdb_tx_id': att.resdb_tx_id
        } for att in attachments]

        return Response(data)
        