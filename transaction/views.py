from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Transaction
from user.models import CustomUser
from .serializers import TransactionSerializer,TransactionTypeSerializer

# Create your views here.
@api_view(['GET'])
def index(request):
    user = request.user
    if not user.is_authenticated:
        return Response({"message": "You are not logged in", "status": status.HTTP_401_UNAUTHORIZED}, status=status.HTTP_401_UNAUTHORIZED)
    if user.is_superuser:
        transactions = Transaction.objects.all().order_by('-created_at')
        if transactions:
            serializer = TransactionSerializer(transactions,many=True)
            return Response({"transactions":serializer.data},status=status.HTTP_200_OK)
        return Response({"message":"No transaction/s found"},status=status.HTTP_204_NO_CONTENT)
    else:
        transactions = Transaction.objects.filter(user=user).order_by('-created_at')
        if transactions:
            serializer = TransactionSerializer(transactions,many=True)
            return Response({"transactions":serializer.data},status=status.HTTP_200_OK)
        return Response({"message":"No transaction/s found"},status=status.HTTP_204_NO_CONTENT)
    
@api_view(['POST'])
def index_2(request):
    user = request.user
    if not user.is_authenticated:
        return Response({"message": "You are not logged in", "status": status.HTTP_401_UNAUTHORIZED}, status=status.HTTP_401_UNAUTHORIZED)
    serializer = TransactionTypeSerializer(data=request.data)
    if serializer.is_valid():
        print(serializer.validated_data)
        type = ''
        if serializer.validated_data['type'] == 'pending':
            type = 'Pending'
        elif serializer.validated_data['type'] == 'receive':
            type = 'To Receive'
        elif serializer.validated_data['type'] == 'rate':
            type = 'To Rate'
        elif serializer.validated_data['type'] == 'completed':
            type = 'Completed'
        elif serializer.validated_data['type'] == 'all':
            type = 'All'
        if user.is_superuser:
            if type == '' or type == 'All':
                transactions = Transaction.objects.all().order_by('-created_at')
            else:
                transactions = Transaction.objects.filter(status=type).order_by('-created_at')
            if transactions:
                serializer = TransactionSerializer(transactions,many=True)
                return Response({"transactions":serializer.data},status=status.HTTP_200_OK)
            return Response({"message":"No transaction/s found"},status=status.HTTP_204_NO_CONTENT)
        else:
            if type == '' or type == 'All':
                transactions = Transaction.objects.filter(user=user).order_by('-created_at')
            else:
                transactions = Transaction.objects.filter(user=user,status=type).order_by('-created_at')
            if transactions:
                serializer = TransactionSerializer(transactions,many=True)
                return Response({"transactions":serializer.data},status=status.HTTP_200_OK)
            return Response({"message":"No transaction/s found"},status=status.HTTP_204_NO_CONTENT)
    else: 
        return Response({"message":serializer.errors},status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def show(request,id):
    transaction = Transaction.objects.get(id=id)
    if transaction:
        serialized_data = TransactionSerializer(transaction)
        return Response({"transaction":serialized_data.data},status=status.HTTP_200_OK)
    else:
        return Response({"message":"No transactions found"},status=status.HTTP_204_NO_CONTENT)    


@api_view(['POST'])
def update_ship(request,id):
    user = request.user
    if user.is_superuser is None:
        return Response({"message":"Unauthorized access."},status=status.HTTP_403_FORBIDDEN)
    transaction = Transaction.objects.get(id=id)
    transaction.status = 'To Receive'
    transaction.save()
    return Response({"message":"Product has been shipped. Customer is waiting to receive the item."},status=status.HTTP_200_OK)


@api_view(['POST'])
def update_receive(request,id):
    user = request.user
    if user is None:
        return Response({"message":"Please login first."},status=status.HTTP_401_UNAUTHORIZED)
    transaction = Transaction.objects.get(id=id)
    transaction.status = 'To Rate'
    transaction.save()
    return Response({"message":"Product has been received."},status=status.HTTP_200_OK)


@api_view(['GET'])    
def dashboard(request):
    pending_count = Transaction.objects.filter(status='Pending').count()
    receive_count = Transaction.objects.filter(status='To Receive').count()
    completed_count = Transaction.objects.filter(status='Completed').count()
    data = {
        'pending': pending_count,
        'receive': receive_count,
        'completed': completed_count
    }
    return Response({"transactions":data},status=status.HTTP_200_OK)
