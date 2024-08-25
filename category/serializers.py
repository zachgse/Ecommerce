from rest_framework import serializers
from .models import Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        
class EditCategorySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()

class SearchCategorySerializer(serializers.Serializer):
    query = serializers.CharField(allow_null=True,required=False)
    name = serializers.CharField(allow_null=True,required=False)