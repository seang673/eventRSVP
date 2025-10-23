from rest_framework import serializers
from .models import Event, RSVP, CustomUser
from django.contrib.auth.password_validation import validate_password

#Validates incoming JSON before saving to database
#Class Meta is to define metadata about the parent class

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

class EventSerializer(serializers.ModelSerializer):
    rsvp_count = serializers.SerializerMethodField()
    organizer = serializers.StringRelatedField()
    date = serializers.DateTimeField(format="%Y-%m-%d %H:%M", input_formats=["%Y-%m-%dT%H:%M:%S.%fZ"])

    class Meta:
        model = Event
        fields = '__all__'  #all fields are exposed
        depth = 1  #automatically includes nested organizer data

    def get_rsvp_count(self, obj):
        return RSVP.objects.filter(event=obj).count()



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

