from django.conf.urls import patterns, include, url
from django.contrib import admin

from rest_framework import viewsets, routers
from quickstart import views

#admin.autodiscover()

# Routers provide an easy way of automatically determining the URL conf
router = routers.DefaultRouter()
router.register(r'expense', views.ExpenseViewSet)
router.register(r'category', views.CategoryViewset)
router.register(r'planned', views.PlannedViewset)



urlpatterns = patterns('',
    #url(r'^$', include('main.urls')),

    url(r'^api/', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
#    url(r'^admin/', include(admin.site.urls)),
)