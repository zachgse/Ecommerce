from rest_framework import serializers
from .models import Cart

class CartViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = ['user','data']

class CartAddSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField()

class CartUpdateQuantitySerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    type = serializers.CharField()

class CartRemoveSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()

class CartCheckoutSerializer(serializers.Serializer):
    items = serializers.ListField(
        child=serializers.IntegerField()
    )