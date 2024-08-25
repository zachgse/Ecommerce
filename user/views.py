from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.serializers import AuthTokenSerializer
from django.contrib.auth import authenticate
from .serializers import RegisterSerializer,RetrieveUserSerializer,RetrieveLoginUserSerializer,UpdateProfileSerializer,ChangePasswordSerializer,RegisterSerializer
from datetime import timedelta
from django.utils import timezone
from django.db.models import Count
from django.db.models.functions import ExtractMonth
from django.contrib.sessions.models import Session
from django.contrib.sessions.backends.db import SessionStore
from .models import CustomUser
from django.contrib.auth.hashers import make_password

# Create your views here.
@api_view(['POST'])
def register(request):
    #get the request objects
    serializer = RegisterSerializer(data=request.data)
    #validate
    if serializer.is_valid():
        #check if same password
        password = serializer.validated_data['password']
        confirm_password = serializer.validated_data['confirm_password']
        if password == confirm_password:
            user = CustomUser(first_name=serializer.validated_data['first_name'],last_name=serializer.validated_data['last_name'],
                              address=serializer.validated_data['address'],email=serializer.validated_data['email'],
                              username=serializer.validated_data['username'],password=make_password(serializer.validated_data['password']))
            user.save()
            return Response({"message":"User registered successfully!"},status=status.HTTP_200_OK)
        else:
            return Response({"error":"Password confirmation does not match"},status=status.HTTP_400_BAD_REQUEST)
    return Response({"error":"Fields are not valid."},status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    token_key = request.session.get('token')
    if token_key:
        token = Token.objects.filter(key=token_key).first()
        if token and token.created + timedelta(minutes=30) > timezone.now():
            return Response({"message":"You are already logged in.","token":token.key},status=status.HTTP_200_OK)
    serializer = AuthTokenSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data.get("username")
        password = serializer.validated_data.get("password")
        user = authenticate(username=username,password=password)
        if user is not None:
            token,created = Token.objects.get_or_create(user=user)
            if not created and token.created + timedelta(minutes=30) <= timezone.now():
                token.delete()
                token = Token.objects.create(user=user)
            request.session['token'] = token.key
            is_admin = False
            if user.is_superuser:
                is_admin = True
            print(is_admin)
            return Response({"message":"You are now logged in","token":token.key,"admin":is_admin},status=status.HTTP_200_OK)
        else:
            return Response({"message":"Incorrect credentials"},status=status.HTTP_401_UNAUTHORIZED)
    else:
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def logout(request):
    # Check for token in the header
    token = request.auth
    if token:
        # Delete the token
        try:
            token_instance = Token.objects.get(key=token.key)
            token_instance.delete()
        except Token.DoesNotExist:
            pass  # Token does not exist
        
        # Optionally, remove the session data
        if 'auth_token' in request.session:
            del request.session['auth_token']
        
        return Response({"message": "You have been logged out."}, status=status.HTTP_200_OK)
    
    # Return a response indicating that the user is not logged in
    return Response({"message": "You are not logged in."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def retrieve_users(request):
    users = CustomUser.objects.all()
    if users:
        serialized_data = RetrieveUserSerializer(users,many=True)
        return Response({"users":serialized_data.data},status=status.HTTP_200_OK)
    return Response({"message":"No Users yet"},status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def profile_edit(request):
    serializer = RetrieveLoginUserSerializer(request.user)
    return Response({"user": serializer.data}, status=status.HTTP_200_OK)

@api_view(['POST'])
def profile_update(request):
    serializer = UpdateProfileSerializer(data=request.data)
    if serializer.is_valid():
        profile = CustomUser.objects.get(id=request.user.id)
        profile.username = serializer.validated_data['username']
        profile.first_name = serializer.validated_data['first_name']
        profile.last_name = serializer.validated_data['last_name']
        profile.email = serializer.validated_data['email']
        profile.address = serializer.validated_data['address']
        profile.save()
        return Response({"message":"Profile has been updated."},status=status.HTTP_200_OK)
    else:
        return Response({"error":"Fields are not valid."},status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])
def change_password(request):
    user = request.user
    serializer = ChangePasswordSerializer(data=request.data)
    if serializer.is_valid():
        old_password = serializer.validated_data['old_password']
        new_password = serializer.validated_data['new_password']
        confirm_password = serializer.validated_data['confirm_password']
        if user.check_password(old_password):
            if (new_password != confirm_password):
                print("mismatch")
                return Response({"error":"Password mismatch."},status=status.HTTP_400_BAD_REQUEST)
            user.password = make_password(new_password)
            user.save()
            return Response({"message":"Password has been updated."},status=status.HTTP_200_OK)
        else:
            print("old password does not match")
            return Response({"error":"Old password does not match."},status=status.HTTP_400_BAD_REQUEST)


    else:
        return Response({"error":"Fields are not valid."},status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
def dashboard(request):
    current_year = timezone.now().year
    users_per_month = (
        CustomUser.objects.filter(date_joined__year=current_year)
        .annotate(month=ExtractMonth('date_joined'))
        .values('month')
        .annotate(count=Count('id'))
        .order_by('month')
    )
    
    monthly_data = {month: 0 for month in range(1, 13)}
    for entry in users_per_month:
        monthly_data[entry['month']] = entry['count']
    
    return Response({"users":monthly_data},status=status.HTTP_200_OK)