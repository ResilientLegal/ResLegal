from django.db import models
from django.utils import timezone

# Create your models here.

class Matter(models.Model):
    activity = models.CharField(max_length=100)
    date = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=50)
    assignee = models.CharField(max_length=100)

    def __str__(self):
        return self.activity