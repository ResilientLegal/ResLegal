"""
URL configuration for reslegal project.
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from api.views import MatterViewSet, CommitTransaction, GetTransaction

router = routers.DefaultRouter()
router.register(r'matters', MatterViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/', include('api.urls')),
    path("api/transactions/commit", CommitTransaction.as_view()),
    path("api/transactions/<str:txn_id>/", GetTransaction.as_view()),
]