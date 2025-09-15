from django.db import models

# Create your models here.
class Event(models.model):
    title = models.CharField(max_length=100)
    date = models.DateTimeField()
    location = models.CharField(max_length=200)
    capacity = models.IntegerField()
    description = models.TextField()

class RSVP(models.Model):
    name = models.CharField(maax_length=100)
    email = models.EmailField()
    message = models.TextField(blank=True)
    event = models.ForeignKey(Event, on_delete = models.CASCADE)
    confirmed = models.BooleanField(default=False)
