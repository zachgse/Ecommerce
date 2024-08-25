from django.db import models
from category.models import Category

# Create your models here.
class Product(models.Model):
    category = models.ForeignKey(Category,on_delete=models.CASCADE) #foreign key
    name = models.CharField(max_length=100)
    description = models.TextField(max_length=500)
    price = models.FloatField()
    quantity = models.IntegerField()
    total_sold = models.IntegerField(default=0)
    image = models.ImageField(upload_to='images/',null=True) #uploads to the MEDIA ROOT in the settings.py
    created_at = models.DateField(auto_now_add=True)
