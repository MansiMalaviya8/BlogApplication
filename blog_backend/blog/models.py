from djongo import models
from authentication.models import *

class Post(models.Model):
    CATEGORY_CHOICES = [
        ('POL', 'Politics'),
        ('BOL', 'Bollywood'),
        ('SPO', 'Sports'),
        ('TEC', 'Technology'),
        ('OTR', 'Others'),
    ]
    
    title = models.CharField(max_length=255)
    content = models.TextField()
    category = models.CharField(max_length=3, choices=CATEGORY_CHOICES, default='OTR')  # Add category field
    created_by = models.ForeignKey(UserProfile, on_delete=models.CASCADE, default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    likes = models.ManyToManyField(UserProfile, related_name='liked_posts', blank=True)
    comments = models.ManyToManyField('Comment', related_name='posts', blank=True)
    post_photo = models.ImageField(upload_to='post_photos/', blank=True, null=True)


    def _str_(self):
        return self.title

class Comment(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comment_set')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return f"Comment by {self.user.username} on {self.post.title}"