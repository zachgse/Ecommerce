from django.db import models

# Create your models here.

class Payment(models.Model):
    transaction_id = models.CharField(max_length=100, unique=True)
    processed_at = models.DateTimeField(auto_now_add=True)
