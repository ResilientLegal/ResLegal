from django.urls import path
from .views import AttachmentUploadView, AttachmentListView, SignupView, LoginView

urlpatterns = [
    path('auth/signup/', SignupView.as_view(), name='signup'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('matters/<int:matter_id>/attachments/', AttachmentListView.as_view(), name='attachment-list'),
    path('matters/<int:matter_id>/attachments/upload/', AttachmentUploadView.as_view(), name='attachment-upload'),
]