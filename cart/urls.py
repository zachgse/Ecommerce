from django.urls import path
from . import views

urlpatterns = [
    path('index',views.index),
    path('store', views.store),
    path('update',views.update),
    path('delete',views.delete),
    path('checkout',views.checkout),
    path('webhook',views.webhook),
]