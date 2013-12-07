from django.conf.urls import patterns, include, url
from django.contrib import admin

from rest_framework import viewsets, routers
from main import views

#admin.autodiscover()

# Routers provide an easy way of automatically determining the URL conf
api = routers.DefaultRouter()
api.register(r'expense', views.ExpenseViewSet)
api.register(r'category', views.CategoryViewSet)
api.register(r'planned', views.PlannedViewSet)



urlpatterns = patterns('',
    url(r'^', include('main.urls')),
    url(r'^', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
#    url(r'^admin/', include(admin.site.urls)),
)