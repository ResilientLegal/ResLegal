from django.urls import path
from .views import AttachmentUploadView, AttachmentListView

urlpatterns = [
    path('matters/<int:matter_id>/attachments/', AttachmentListView.as_view(), name='attachment-list'),
    path('matters/<int:matter_id>/attachments/upload/', AttachmentUploadView.as_view(), name='attachment-upload'),
]