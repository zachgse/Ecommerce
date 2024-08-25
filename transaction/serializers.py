from rest_framework import serializers
from .models import Transaction

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'


class TransactionTypeSerializer(serializers.Serializer):
    type = serializers.CharField(allow_null=True,required=False)