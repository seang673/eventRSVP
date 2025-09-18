from rest_framework import serializers
from .models import Event, RSVP

#Validates incoming JSON before saving to database
class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'  #all fields are exposed

class RSVPSerializer(serializers.ModelSerializer):
    #Lets frontend display event name directly without
    #needing second API call
    event_title = serializers.SerializerMethodField()

    class Meta:
        model = RSVP
        fields = '__all__'  #all fields are exposed

    def get_event_title(self, obj):
        return obj.event.title if obj.event else None

    def validate(self, data):
        event = data.get('event')
        # Only run this check if we're creating a new RSVP
        if self.instance is None and event and event.rsvp_set.count() >= event.capacity:
            raise serializers.ValidationError("This event is already at full capacity.")
        return data

