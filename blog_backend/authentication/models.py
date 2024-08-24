from django.db import models
from django.core.validators import EmailValidator

class UserProfile(models.Model):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(max_length=255, unique=True, validators=[EmailValidator()], default='')
    password = models.CharField(max_length=128, default='')
    post_no = models.IntegerField(default=0)
    followers = models.ManyToManyField('self', symmetrical=False, related_name='following_profiles', blank=True)
    profile_photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)

    def _str_(self):
        return self.username

    def get_followers_count(self):
        return self.followers.count()

    def get_following_count(self):
        return self.following_profiles.count()