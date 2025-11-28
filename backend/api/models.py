from django.db import models
from django.utils import timezone

# Create your models here.

class Matter(models.Model):
    title = models.CharField(max_length=100)
    date = models.DateTimeField(default=timezone.now)
    assignee = models.CharField(max_length=100, null=True, blank=True)
    client = models.CharField(max_length=100, null=True, blank=True)
    shortDescription = models.TextField(null=True, blank=True)
    work_notes = models.TextField(null=True, blank=True)
    state = models.CharField(max_length=50, default='IN_PROGRESS', choices={
        'IN_PROGRESS': 'In Progress',
        'PENDING_APPROVAL': 'Pending Approval',
        'APPROVED': 'Approved'
    })
    type = models.CharField(max_length=50, default='CIVIL', choices={
        'CIVIL': 'Civil',
        'CRIMINAL': 'Criminal',
        'FAMILY_LAW': 'Family Law',
        'APPEAL': 'Appeal',
        'PROBATE': 'Probate',
        'SMALL_CLAIMS': 'Small Claims'
    })

    def __str__(self):
        return self.activity

