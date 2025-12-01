from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

# Create your models here.
STATE_CHOICES = [
    ('IN_PROGRESS', 'In Progress'),
    ('PENDING_APPROVAL', 'Pending Approval'),
    ('APPROVED', 'Approved'),
]

TYPE_CHOICES = [
    ('CIVIL', 'Civil'),
    ('CRIMINAL', 'Criminal'),
    ('FAMILY_LAW', 'Family Law'),
    ('APPEAL', 'Appeal'),
    ('PROBATE', 'Probate'),
    ('SMALL_CLAIMS', 'Small Claims'),
]

class Matter(models.Model):
    title = models.CharField(max_length=100)
    date = models.DateTimeField(default=timezone.now)
    assignee = models.CharField(max_length=100, null=True, blank=True)
    client = models.CharField(max_length=100, null=True, blank=True)
    approver = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    shortDescription = models.TextField(null=True, blank=True)
    work_notes = models.TextField(null=True, blank=True)
    state = models.CharField(max_length=50, default='IN_PROGRESS', choices=STATE_CHOICES)
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)

    def __str__(self):
        return self.title

