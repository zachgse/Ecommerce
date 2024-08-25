import json
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import ProductRatings,AddRatingToProduct
from .models import Rating
from transaction.models import Transaction

@api_view(['GET'])
def index(request):
    ratings = Rating.objects.all()
    serialized_data = ProductRatings(ratings,many=True)
    print("Serialized data",serialized_data)
    if ratings is not None:
        return Response({"message":"There are ratings for this product","ratings":serialized_data.data},status=status.HTTP_200_OK)
    return Response({"message":"There are no ratings yet for this product"},status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def show(request,id):
    rating =  Rating.objects.get(id=id)
    if rating:
        serialized_data = ProductRatings(rating)
        return Response({"rating":serialized_data.data},status=status.HTTP_200_OK)
    else:
        return Response({"message":"No rating found"},status=status.HTTP_204_NO_CONTENT)   

@api_view(['GET'])
def product_ratings(request,id):
    ratings = Rating.objects.filter(product=id).order_by('-created_at')
    serialized_data = ProductRatings(ratings,many=True)
    if ratings is not None:
        return Response({"message":"There are ratings for this product","ratings":serialized_data.data},status=status.HTTP_200_OK)
    return Response({"message":"There are no ratings yet for this product"},status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def user_ratings(request):
    user = request.user
    if not user.is_authenticated:
        return Response({"message": "Please log in first"}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        ratings = Rating.objects.filter(user=user)
        if ratings.exists():
            serialized_data = ProductRatings(ratings, many=True)
            return Response({"message": "There are ratings for the user", "ratings": serialized_data.data}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "There are no ratings yet for this user"}, status=status.HTTP_200_OK)
    except Rating.DoesNotExist:
        return Response({"message": "There are no ratings yet for this user"}, status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
def store_rate(request):
    user = request.user
    if not user.is_authenticated:
        return Response({"message": "You are not logged in", "status": status.HTTP_401_UNAUTHORIZED}, status=status.HTTP_401_UNAUTHORIZED)
    serializer = AddRatingToProduct(data=request.data)
    if serializer.is_valid():
        rating = Rating.objects.get(id=serializer.validated_data['rating_id'])
        if rating is None:
            return Response({"message":"There are ratings for this product"},status=status.HTTP_204_NO_CONTENT)
        
        #update rating
        rating.star = serializer.validated_data['star']
        rating.description = serializer.validated_data['description']
        rating.status = "Completed"
        rating.save()

        #update transaction
        transaction = Transaction.objects.get(id=serializer.validated_data['transaction_id'])
        products_to_rate = transaction.products_to_rate #lets say the value is [13,14] and assume that current rating id (rating object) is 13
        products_to_rate = json.loads(products_to_rate)
        available_ratings_for_transaction = [i for i in products_to_rate if i != rating.product.id]
        transaction.products_to_rate = available_ratings_for_transaction
        if not available_ratings_for_transaction: 
            transaction.status = "Completed"
        transaction.save()


        return Response({"message":"Rating has been updated."},status=status.HTTP_200_OK)        
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)   
    