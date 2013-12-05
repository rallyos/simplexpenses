from django.conf.urls import patterns, include, url
from django.contrib import admin

from rest_framework import viewsets, routers
from main import views

#admin.autodiscover()

# Routers provide an easy way of automatically determining the URL conf
router = routers.DefaultRouter()
router.register(r'expense', views.ExpenseViewSet)
router.register(r'category', views.CategoryViewSet)
router.register(r'planned', views.PlannedViewSet)



urlpatterns = patterns('',

    url(r'^', include('main.urls')),
)