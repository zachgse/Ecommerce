from django.urls import path
from . import views

urlpatterns = [
    path('',views.index),
    path('show/<int:id>',views.show),
    path('product_ratings/<int:id>',views.product_ratings),
    path('user_ratings',views.user_ratings),
    path('store_rate',views.store_rate)
]