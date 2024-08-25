from rest_framework import serializers
from .models import Rating
from transaction.models import Transaction
from product.models import Product

class ProductRatings(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = '__all__'


class AddRatingToProduct(serializers.Serializer):
    rating_id = serializers.IntegerField()
    transaction_id = serializers.IntegerField()
    star = serializers.IntegerField()
    description = serializers.CharField()

# class StoreRatingToProduct(serializers.Serializer):
#     product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
#     transaction = serializers.PrimaryKeyRelatedField(queryset=Transaction.objects.all())
#     star = serializers.IntegerField()
#     description = serializers.CharField()

# class SingleRatingPerProductSerializer(serializers.Serializer):
#     rating_id = serializers.IntegerField() 

# class IdTransactionRatingSerializer(serializers.Serializer):
#     transaction_id = serializers.IntegerField()


# class ObjectTransactionRatingSerializer(serializers.Serializer):
#     product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
#     transaction = serializers.PrimaryKeyRelatedField(queryset=Transaction.objects.all())