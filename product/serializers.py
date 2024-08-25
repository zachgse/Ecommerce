from rest_framework import serializers
from .models import Product
from category.models import Category

class ProductSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    class Meta:
        model = Product
        fields = '__all__'

class ProductAddSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    class Meta:
        model = Product
        fields = ['name','category','description','quantity','price','image']

class ProductEditInfoSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    description = serializers.CharField()
    price = serializers.IntegerField()
    image = serializers.ImageField(allow_null=True, required=False)

class ProductEditQuantitySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    quantity = serializers.IntegerField()

class ProductSearchSerializer(serializers.Serializer):
    query = serializers.CharField()

class ProductSearchFilterSerializer(serializers.Serializer):
    query = serializers.CharField()
    price = serializers.CharField(allow_null=True,required=False)
    name = serializers.CharField(allow_null=True,required=False)

class AdminProductSearchSerializer(serializers.Serializer):
    query = serializers.CharField(allow_null=True,required=False)
    price = serializers.CharField(allow_null=True,required=False)
    name = serializers.CharField(allow_null=True,required=False)
    quantity = serializers.CharField(allow_null=True,required=False)
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), allow_null=True, required=False)
