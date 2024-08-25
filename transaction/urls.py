from django.urls import path
from . import views

urlpatterns = [
    path('',views.index),
    path('test',views.index_2),
    path('show/<int:id>',views.show),
    path('update_ship/<int:id>',views.update_ship),
    path('update_receive/<int:id>',views.update_receive),
    path('dashboard',views.dashboard)
]