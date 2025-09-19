from rest_framework import serializers
from .models import Event, RSVP, CustomUser
from django.contrib.auth.password_validation import validate_password

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password', 'is_organizer')

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            is_organizer=validated_data.get('is_organizer', False)
        )
        return user


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

