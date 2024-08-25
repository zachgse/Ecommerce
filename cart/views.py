import json,requests
from django.conf import settings
from django.db import transaction, IntegrityError, DatabaseError
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import CartViewSerializer,CartAddSerializer,CartUpdateQuantitySerializer,CartRemoveSerializer,CartCheckoutSerializer
from .models import Cart
from product.models import Product
from transaction.models import Transaction
from rating.models import Rating
from user.models import CustomUser
from payment.models import Payment

@api_view(['GET'])
def index(request):
    user = request.user
    if not user.is_authenticated:
        return Response({"message": "You are not logged in"},status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        cart = Cart.objects.get(user=user)
        serializer = CartViewSerializer(cart)
        return Response({"cart": serializer.data}, status=status.HTTP_200_OK)
    except Cart.DoesNotExist:
        return Response({"message": "No cart data yet"}, status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
def store(request):
    user = request.user
    if not user.is_authenticated:
        return Response({"message": "You are not logged in", "status": status.HTTP_401_UNAUTHORIZED}, status=status.HTTP_401_UNAUTHORIZED)
    
    serializer = CartAddSerializer(data=request.data, many=False)
    if serializer.is_valid():
        user_cart, created = Cart.objects.get_or_create(user=user) #
        
        if created:
            user_cart.data = [serializer.validated_data] #list of dictionary (but currently 1)
        else:
            if isinstance(user_cart.data, str): #list of dictionary (more than 1)
                user_cart.data = json.loads(user_cart.data) #convert json string to python object
            
            if not isinstance(user_cart.data, list): #if no data is passed
                user_cart.data = []

            product_id = serializer.validated_data.get('product_id') 
            existing_product = None
            for item in user_cart.data: #loop inside the user_Cart
                if isinstance(item, dict) and item.get('product_id') == product_id: #
                    existing_product = item
                    break
            
            if existing_product:
                existing_product['quantity'] = existing_product.get('quantity', 0) + serializer.validated_data.get('quantity', 1)
                #validation check if current quantity exceeds the quantity of the product
                product = Product.objects.get(id=product_id)
                if (existing_product['quantity'] > product.quantity):
                    return Response({"message":"Quantity exceeds the current stock of the product","status":status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)
            else:
                user_cart.data.append(serializer.validated_data)
        
        user_cart.data = json.dumps(user_cart.data) #convert python object to json string
        user_cart.save()
        return Response({"message": "Product added to cart", "cart": user_cart.data}, status=status.HTTP_200_OK)
    
    return Response({"message": "Invalid data", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([IsAuthenticated])
@api_view(['POST'])
def update(request):
    user = request.user
    cart = Cart.objects.get(user=user)
    serialized_request = CartUpdateQuantitySerializer(data=request.data,many=False)
    if serialized_request.is_valid():
        product_id = serialized_request.validated_data.get('product_id')
        change_type = serialized_request.validated_data.get('type')
        print(change_type)
        cart_items = json.loads(cart.data)
        for item in cart_items:
            if item.get('product_id') == product_id:
                if change_type == 'add':
                    item['quantity'] += 1
                elif change_type == 'remove' and item['quantity'] > 0:
                    item['quantity'] -= 1
                break
        cart.data = json.dumps(cart_items)
        cart.save()

        serialized_cart = CartViewSerializer(cart)
        return Response({"message":"Product updated","cart":serialized_cart.data},status=status.HTTP_200_OK)
    else:
        return Response({"message":serialized_request.errors},status=status.HTTP_400_BAD_REQUEST)

@permission_classes([IsAuthenticated])
@api_view(['POST'])
def delete(request):
    user = request.user
    cart = Cart.objects.get(user=user)
    serialized_cart = CartViewSerializer(cart)
    cart_items = json.loads(serialized_cart.data['data'])
    serialized_request = CartRemoveSerializer(data=request.data,many=False)
    if serialized_request.is_valid():
        product_id = serialized_request.validated_data.get('product_id')
        updated_cart_data = []
        for item in cart_items:
            if item.get('product_id') != product_id:
                updated_cart_data.append(item)
        updated_cart_data_json = json.dumps(updated_cart_data)
        cart.data = updated_cart_data_json
        cart.save()
        return Response({"message":"Product removed from cart","cart":cart.data},status=status.HTTP_200_OK)
    else:
        return Response({"message":"Serializer invalid"},status=status.HTTP_400_BAD_REQUEST)


@permission_classes([IsAuthenticated])
@api_view(['POST'])
def checkout(request):
    user = request.user
    cart = Cart.objects.get(user=user)
    items_str = request.data.get('items', '')
    if items_str:
        items_list = list(map(int, items_str.split(',')))
    else:
        items_list = []
    data = {'items': items_list}
    serializer = CartCheckoutSerializer(data=data)
    if serializer.is_valid():
        cart_items = json.loads(cart.data)
        cart_contents = []
        for item in cart_items:
            product_id = item.get('product_id')
            for id in serializer.validated_data['items']:
                if product_id == id:
                    product = Product.objects.get(id=product_id)
                    temp = {
                        'product_id': product.id,
                        'product_name': product.name,
                        'quantity': item.get('quantity'),
                        'price': product.price
                    }
                    cart_contents.append(temp) 
                line_items = []
        description_content = []
        line_items = []
        for item in cart_contents:
            description_content.append(f"{item['product_name']}: {item['quantity']} pcs")
            line_items.append(
                {
                    "name": item['product_name'],
                    "quantity": item['quantity'],
                    "amount": int(item['price']) * 100,
                    "currency": "PHP",
                }
            )
        description = ", ".join(description_content)

        frontend = settings.FRONTEND_URL
        api = settings.PAYMONGGO_SECRET
        url = "https://api.paymongo.com/v1/checkout_sessions"
        payload = { 
            "data": { 
                "attributes": {
                    "send_email_receipt": False,
                    "show_description": True,
                    "show_line_items": True,
                    "payment_method_types": ["gcash", "card", "paymaya"],
                    "description": description,
                    "line_items": line_items,
                    "success_url": f"{frontend}/success",
                    "failed_url": "test",
                    "metadata": {
                        "cart_contents": cart_contents,
                        "customer_id": user.id
                    }
                } 
            } 
        }
        headers = {
            "accept": "application/json",
            "Content-Type": "application/json",
            "authorization": f"Basic c2tfdGVzdF8xOXZXaG9SVGRZa0tOZ01nNUJWQXpMcXE6{api}"
        }
        response = requests.post(url, json=payload, headers=headers)
        response_data = response.json()
        checkout_url = response_data['data']['attributes']['checkout_url']
        request.session.save()
        return Response({"message":checkout_url},status=status.HTTP_200_OK)
    else: 
        return Response({"message":serializer.errors},status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(['GET', 'POST'])
def webhook(request):
    if request.method == 'POST':
        data = request.data
        transaction_id = data['data']['id']
        try:
            with transaction.atomic():
                payment, created = Payment.objects.get_or_create(transaction_id=transaction_id)
                if created:
                    try:
                        payment.save()
                        user = data['data']['attributes']['data']['attributes']['metadata']['customer_id']
                        amount = data['data']['attributes']['data']['attributes']['amount']
                        cart_contents = data['data']['attributes']['data']['attributes']['metadata']['cart_contents']
                        success(user,amount,cart_contents)
                        return Response({"message": "Transaction has been processed.", "response": data}, status=status.HTTP_200_OK)
                    except Exception as e:
                        print(f"Error while saving payment or processing transaction {transaction_id}: {e}")
                        return Response({"message": "Error processing transaction"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                else:
                    print("Transaction already processed for ID:", transaction_id)
                    return Response({"message": "Transaction already processed"}, status=status.HTTP_200_OK)
        except IntegrityError as e:
            print(f"IntegrityError processing transaction {transaction_id}: {e}")
            return Response({"message": "Database Integrity Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except DatabaseError as e:
            print(f"DatabaseError processing transaction {transaction_id}: {e}")
            return Response({"message": "Database Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            print(f"Error processing transaction {transaction_id}: {e}")
            return Response({"message": "Error processing transaction"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response({"message": "Only POST requests are allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    

def success(user,amount,cart_contents):
    user = CustomUser.objects.get(id=user)
    total_amount = amount / 100
    cart_contents = convert_hash_to_dict(cart_contents)

    # Carts
    carts = Cart.objects.all()
    serialized_other_carts = CartViewSerializer(carts, many=True)

    transaction_description = []
    products_to_rate = []
    # Process each item in the cart
    for item in cart_contents:
        print("Processing item:", item)
        try:
            product_id = item['product_id']
            quantity = item['quantity']

            # Get and update product quantity and total sold
            product = Product.objects.get(id=product_id)
            product.quantity -= quantity
            product.total_sold += quantity
            product.save()

            # Create rating per product
            rating = Rating(user=user, product=product)
            rating.save() 

            # Creating transaction description
            temp = {
                'rating_id' : rating.id,
                'product_id': product_id,
                'product_quantity': quantity
            }
            transaction_description.append(temp)
            products_to_rate.append(rating.id)

            # Clearing carts of the checkout items
            for serialized_cart_data in serialized_other_carts.data:
                user_id = serialized_cart_data['user']
                cart_data = json.loads(serialized_cart_data['data'])

                updated_cart_data = []
                for data in cart_data:
                    if data['product_id'] == product_id:
                        if product.quantity > 0:
                            if data['quantity'] > product.quantity:
                                data['quantity'] = product.quantity
                            updated_cart_data.append(data)
                    else:
                        updated_cart_data.append(data)
                serialized_cart_data['data'] = json.dumps(updated_cart_data)
                Cart.objects.filter(user=user_id).update(data=serialized_cart_data['data'])
        except Product.DoesNotExist:
            print(f"Product {product} does not exist")
        except Exception as e:
            print(f"Error processing item {item}: {e}")
    new_transaction = Transaction(user=user, description=transaction_description, products_to_rate=products_to_rate,total_amount=total_amount)
    new_transaction.save()


def convert_hash_to_dict(ruby_hash):
    dict_str = ruby_hash.replace(":",'"') 
    dict_str = dict_str.replace("=>",'" : ')
    dict_str = dict_str.replace('""','"')  
    return json.loads(dict_str)