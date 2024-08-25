from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework import status
from .serializers import CategorySerializer,EditCategorySerializer,SearchCategorySerializer
from .models import Category

# Create your views here.

@api_view(['GET'])
def index(request):
    categories = Category.objects.all()
    if categories:
        serializer = CategorySerializer(categories,many=True)
        return Response({"categories":serializer.data},status=status.HTTP_200_OK)
    return Response({"message":"No categories yet."},status=status.HTTP_204_NO_CONTENT) 


@api_view(['POST'])
def add(request):
    serializer = CategorySerializer(data=request.data,many=False)
    if serializer.is_valid():
        serializer.save()
        return Response({"message":"Category has been added."},status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  


@api_view(['GET'])
def edit(request,id):
    category = Category.objects.get(id=id)
    if category:
        serializer = CategorySerializer(category,many=False)
        return Response({"category":serializer.data},status=status.HTTP_200_OK)
    return Response({"message":"Category not found."},status=status.HTTP_404_NOT_FOUND) 


@api_view(['PUT'])
def update(request):
    serializer = EditCategorySerializer(data=request.data,many=False)
    if serializer.is_valid():
        category = Category.objects.get(id=serializer.validated_data['id'])
        category.name = serializer.validated_data['name']
        category.save()
        return Response({"message":"Category has been updated."},status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)   


@api_view(['POST','GET'])
def search(request):
    serializer = SearchCategorySerializer(data=request.data)
    if serializer.is_valid():
        categories = Category.objects.all()

        query = serializer.validated_data.get('query')
        name_sort = serializer.validated_data.get('name')

        if query:
            categories = categories.filter(name__icontains=query)
        if name_sort:
            sort_name = '-name' if name_sort == 'DESC' else 'name'
            categories = categories.order_by(sort_name)
        if categories:
            serialized_data = CategorySerializer(categories, many=True)
            return Response({"message": "Category/ies found", "categories": serialized_data.data}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "No category found"}, status=status.HTTP_204_NO_CONTENT)
    else:
        return Response({"message": "Error input"}, status=status.HTTP_400_BAD_REQUEST)
   