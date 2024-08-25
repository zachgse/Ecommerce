from django.urls import path
from . import views

urlpatterns = [
    path('register',views.register),
    path('login',views.login),
    path('logout',views.logout),
    path('retrieve',views.retrieve_users),
    path('profile_edit',views.profile_edit),
    path('profile_update',views.profile_update),
    path('change_password',views.change_password),
    path('dashboard',views.dashboard)
]