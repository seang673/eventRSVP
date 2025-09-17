from django.apps import AppConfig

class RsvpAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'rsvp_app'

    def ready(self):             #Ensures tokens are created no matter how users are added
        import rsvp_app.signals
