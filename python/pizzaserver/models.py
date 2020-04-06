from django.db import models

# Create your models here.
class Tasks(models.Model):

    STATUS_CHOICES = (
        ('success', 'SUCCESS'),
        ('failure', 'FAILURE'),
        ('continue', 'CONTINUE'),
        ('not_started', 'NOT STARTED'),
    )
    name = models.CharField(max_length=80)
    failure_reason = models.TextField(blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)
    started = models.DateTimeField(null=True)
    finished = models.DateTimeField(null=True)
    status = models.CharField(max_length=11, choices=STATUS_CHOICES, default='not_started')
    step = models.PositiveIntegerField()
    data_filepath = models.FileField(upload_to='uploaded_tasks/')
    result = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'task_list'