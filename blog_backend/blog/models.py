from djongo import models


class Post(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    likes=models.IntegerField(default=0)
    comments = models.JSONField(default=list)

    def __str__(self):
        return self.title
