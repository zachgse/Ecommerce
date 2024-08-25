from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Product
from django.db.models import Count
from .serializers import ProductSerializer,ProductAddSerializer,ProductEditInfoSerializer,ProductEditQuantitySerializer,ProductSearchFilterSerializer,AdminProductSearchSerializer
import logging


logger = logging.getLogger(__name__)

# Create your views here.
@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def index(request):
    products = Product.objects.all()
    if products:
        serializer = ProductSerializer(products,many=True)
        return Response({"products":serializer.data},status=status.HTTP_200_OK)
    else:
        return Response({"error":"No products available"},status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def trending(request):
    products = Product.objects.order_by('-id')[:8]
    if products:
        serializer = ProductSerializer(products,many=True)
        return Response({"products":serializer.data},status=status.HTTP_200_OK)
    else:
        return Response({"error":"No products available"},status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def show(request,id):
    product = Product.objects.get(id=id)
    if product:
        serializer = ProductSerializer(product,many=False)
        return Response({"product":serializer.data},status=status.HTTP_200_OK)
    else:
        return Response({"error":"No product found"},status=status.HTTP_204_NO_CONTENT)
    

@api_view(['POST'])
def store(request):
    try:
        serializer = ProductAddSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response("New Product has been added", status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.exception("An error occurred: %s", e)
        return Response("Internal server error", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['PUT'])
def update_info(request):
    serializer = ProductEditInfoSerializer(data=request.data)
    if serializer.is_valid():
        product = Product.objects.get(id=serializer.validated_data['id'])
        product.name = serializer.validated_data['name']
        product.category = serializer.validated_data['category']
        product.description = serializer.validated_data['description']
        product.price = serializer.validated_data['price']
        if 'image' in serializer.validated_data:
            product.image = serializer.validated_data['image']
        product.save()
        return Response({"message":"Product information has been updated."},status=status.HTTP_200_OK)
    else:
        print("Serializer errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)   
    

@api_view(['PUT'])
def update_quantity(request):
    serializer = ProductEditQuantitySerializer(data=request.data)
    if serializer.is_valid():
        product = Product.objects.get(id=serializer.validated_data['id'])
        product.quantity = serializer.validated_data['quantity'] + product.quantity
        product.save()
        return Response({"message":"Product quantity has been updated."},status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)   
    
    
@api_view(['POST'])
def search(request):
    serializer = ProductSearchFilterSerializer(data=request.data,many=False)
    if serializer.is_valid():
        products = Product.objects.filter(name__icontains=serializer.data['query'])
        if serializer.data['name']:
            sort_name = '-name' if serializer.data.get('name') == 'DESC' else 'name'
            products = Product.objects.filter(name__icontains=serializer.data['query']).order_by(sort_name)
        if serializer.data['price']:
            sort_price = '-price' if serializer.data.get('price') == 'DESC' else 'price'
            products = Product.objects.filter(name__icontains=serializer.data['query']).order_by(sort_price)
        if products:
            serialized_data = ProductSerializer(products,many=True)
            return Response({"message":"Product/s found","products":serialized_data.data},status=status.HTTP_200_OK)
        else:
            return Response({"message":"No products found"},status=status.HTTP_204_NO_CONTENT)            
    else:
        return Response({"message":"Error input"},status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def admin_search(request):
    serializer = AdminProductSearchSerializer(data=request.data)
    if serializer.is_valid():
        products = Product.objects.all()

        query = serializer.validated_data.get('query')
        name_sort = serializer.validated_data.get('name')
        price_sort = serializer.validated_data.get('price')
        quantity_sort = serializer.validated_data.get('quantity')
        category_sort = serializer.validated_data.get('category')

        if query:
            products = products.filter(name__icontains=query)
        if name_sort:
            sort_name = '-name' if name_sort == 'DESC' else 'name'
            products = products.order_by(sort_name)
        if price_sort:
            sort_price = '-price' if price_sort == 'DESC' else 'price'
            products = products.order_by(sort_price)
        if quantity_sort:
            sort_quantity = '-quantity' if quantity_sort == 'DESC' else 'quantity'
            products = products.order_by(sort_quantity)
        if category_sort:
            products = products.filter(category=category_sort)

        if products.exists():
            serialized_data = ProductSerializer(products, many=True)
            return Response({"message": "Product/s found", "products": serialized_data.data}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "No products found"}, status=status.HTTP_204_NO_CONTENT)
    else:
        return Response({"message": "Error input"}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
def dashboard_trending(request):
    products = Product.objects.order_by('-total_sold')[:5]
    serializer = ProductSerializer(products,many=True)
    return Response({"products":serializer.data},status=status.HTTP_200_OK)


@api_view(['GET'])
def dashboard_category(request):
    products_by_category = Product.objects.values('category__name').annotate(product_count=Count('id')).order_by('category__name')
    return Response({"products":products_by_category},status=status.HTTP_200_OK)