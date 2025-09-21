from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    is_organizer = models.BooleanField(default=False)

    def __str__(self):
        return self.username

# Create your models here.
class Event(models.Model):
    title = models.CharField(max_length=100)
    date = models.DateTimeField()
    location = models.CharField(max_length=200)
    capacity = models.IntegerField()
    description = models.TextField()
    organizer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='organized_events'
    )

    class Meta:
        db_table = 'event'

class RSVP(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField(blank=True)
    event = models.ForeignKey(Event, on_delete = models.CASCADE)
    confirmed = models.BooleanField(default=False)

    class Meta:
        db_table='rsvp'
        unique_together = ('email', 'event')
