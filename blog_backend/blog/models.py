# from djongo import models


# class Post(models.Model):
#     title = models.CharField(max_length=255)
#     content = models.TextField()
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
#     likes=models.IntegerField(default=0)
#     comments = models.JSONField(default=list)

#     def __str__(self):
#         return self.title



# from djongo import models
# from django.contrib.auth import get_user_model

# User = get_user_model()

# class Comment(models.Model):
#     user_id = models.CharField(max_length=255)  # Store user ID as a string
#     text = models.TextField()
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.text[:20]  # Return the first 20 characters of the comment

# class Post(models.Model):
#     title = models.CharField(max_length=255)
#     content = models.TextField()
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
#     likes = models.IntegerField(default=0)
#     liked_user_ids = models.JSONField(default=list)  # Store user IDs as a list of strings
#     comments = models.ArrayModelField(
#         model_container=Comment,
#         default=list,
#     )

#     def __str__(self):
#         return self.title



from djongo import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Post(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    likes = models.IntegerField(default=0)
    liked_user_ids = models.JSONField(default=list)  # Store a list of user IDs
    comments = models.JSONField(default=list)  # Store a list of comments

    def __str__(self):
        return self.title


# from datetime import datetime

# # Assuming you have a post instance
# post = Post.objects.get(id=1)

# # Add a new comment
# new_comment = {
#     "user_id": "some_user_id",
#     "text": "This is a new comment.",
#     "created_at": datetime.now().isoformat(),
# }

# # Append the comment to the comments list
# post.comments.append(new_comment)
# post.save()
