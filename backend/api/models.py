from django.db import models
from django.utils import timezone

class Matter(models.Model):
    activity = models.CharField(max_length=100)
    date = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=50)
    assignee = models.CharField(max_length=100)

    def __str__(self):
        return self.activity


class Attachment(models.Model):
    matter = models.ForeignKey(Matter, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='attachments/')
    filename = models.CharField(max_length=255)
    uploaded_by = models.CharField(max_length=100)
    uploaded_at = models.DateTimeField(default=timezone.now)
    resdb_tx_id = models.CharField(max_length=255, null=True, blank=True)  # ResilientDB transaction ID

    def __str__(self):
        return self.filename