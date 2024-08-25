from django.db import models
from django.contrib.auth import get_user_model

# Create your models here.
class Transaction(models.Model):
    user = models.ForeignKey(get_user_model(),on_delete=models.CASCADE)
    description = models.TextField()
    products_to_rate = models.TextField(null=True)
    total_amount = models.FloatField()
    status = models.CharField(max_length=30,default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)