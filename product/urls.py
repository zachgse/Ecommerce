from django.urls import path
from . import views

urlpatterns = [
    path('',views.index,name="index"),
    path('product/trending',views.trending),
    path('product/<int:id>',views.show),
    path('product/add',views.store),
    path('product/update_info',views.update_info),
    path('product/update_quantity',views.update_quantity),
    path('product/search',views.search),
    path('admin/product/search',views.admin_search),
    path('product/dashboard_trending',views.dashboard_trending),
    path('product/dashboard_category',views.dashboard_category)
]