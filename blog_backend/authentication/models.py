from django.db import models
from django.core.validators import EmailValidator

class UserProfile(models.Model):
    username = models.CharField(max_length=150, unique=True)  # Username field, must be unique
    email = models.EmailField(max_length=255, unique=True, validators=[EmailValidator()],default='')  # Email field with validation
    password = models.CharField(max_length=128,default='')

    def __str__(self):
        return self.username