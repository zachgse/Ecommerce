from django.db import models
from django.contrib.auth import get_user_model
from product.models import Product
from transaction.models import Transaction

# Create your models here.
class Rating(models.Model):
    user = models.ForeignKey(get_user_model(),on_delete=models.CASCADE) #foreign key (AUTH_USER_MODEL in settings.py)
    product = models.ForeignKey(Product,on_delete=models.CASCADE)
    description = models.TextField(null=True)
    star = models.IntegerField(null=True)
    status = models.CharField(max_length=30,default="To Rate")
    created_at = models.DateTimeField(auto_now_add=True)