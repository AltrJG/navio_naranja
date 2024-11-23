from django.apps import AppConfig


class NavioNaranjaAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'navio_naranja_app'

    def ready(self):
        import navio_naranja_app.signals