from urllib import response
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.db.models.signals import post_save, post_init
from api.utils.resilientdb import post as commitTransaction
import uuid

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
    assignee = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assignee'
    )
    client = models.CharField(max_length=100, null=True, blank=True)
    approver = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approver'
    )
    shortDescription = models.TextField(null=True, blank=True)
    work_notes = models.TextField(null=True, blank=True)
    state = models.CharField(max_length=50, default='IN_PROGRESS', choices=STATE_CHOICES)
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)

    previous_state = None

    def __str__(self):
        return self.title
    
    @staticmethod
    def remember_state(sender, instance, **kwargs):
        instance.previous_state = instance.state

    @staticmethod
    def post_save(sender, instance, created, **kwargs):
        print("Post Save Triggered")
        print("Previous State: ", instance.previous_state)
        print("Current State: ", instance.state)
        if created:
            create_matter_transaction(instance.id, instance)
        elif instance.previous_state != instance.state:
            update_matter_transaction(instance.id, instance.state)

class MatterTransaction(models.Model):
    matter = models.ForeignKey(Matter, on_delete=models.CASCADE)
    txn_in_progress_id = models.CharField(max_length=100)
    txn_pending_approval_id = models.CharField(max_length=100)
    txn_approved_id = models.CharField(max_length=100)

    def __str__(self):
        return self.matter.title


def create_matter_transaction(matter_id, instance):
    id = str(matter_id) + uuid.uuid4().hex
    print("Creating Matter Transaction with ID:", id)
    response = commitTransaction({
        "id": id,
        "value": {
            "timestamp": str(timezone.now()),
            "matter_id": matter_id,
            "assignee": instance.assignee.id if instance.assignee else None,
            "client": instance.client,
            "approver": instance.approver.id if instance.approver else None,
            "state": instance.state,
            "type": instance.type,
        }
    })
    
    
    MatterTransaction.objects.create(
        matter_id=matter_id,
        txn_in_progress_id=id
    )


def update_matter_transaction(matter_id, state, instance):
    id = str(matter_id) + uuid.uuid4().hex
    print("Updating Matter Transaction with ID:", id)
    response = commitTransaction({
        "id": id,
        "value": {
            "timestamp": str(timezone.now()),
            "matter_id": matter_id,
            "assignee": instance.assignee.id if instance.assignee else None,
            "client": instance.client,
            "approver": instance.approver.id if instance.approver else None,
            "state": instance.state,
            "type": instance.type,
        }
    })
    
    match state:
        case "IN_PROGRESS":
            MatterTransaction.objects.filter(matter_id=matter_id).update(
                txn_in_progress_id=id
            )
        case "PENDING_APPROVAL":
            MatterTransaction.objects.filter(matter_id=matter_id).update(
                txn_pending_approval_id=id
            )
        case "APPROVED":
            MatterTransaction.objects.filter(matter_id=matter_id).update(
                txn_approved_id=id
            )

post_save.connect(Matter.post_save, sender=Matter)
post_init.connect(Matter.remember_state, sender=Matter)