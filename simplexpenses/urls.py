from django.conf.urls import patterns, include, url
from django.contrib import admin

from django.contrib.auth.models import User, Group

from rest_framework import viewsets, routers

#admin.autodiscover()

# ViewSets define the view behavior.
class ExpenseViewSet(viewsets.ModelViewSet):
    model = Expense

class CategoryViewset(viewsets.ModelViewSet):
    model = Category

class PlannedViewset(viewsets.ModelViewSet):
    model = Planned

# Routers provide an easy way of automatically determining the URL conf
router = routers.DefaultRouter()
router.register(r'expense', ExpenseViewSet)
router.register(r'category', CategoryViewset)
router.register(r'planned', PlannedViewset)



urlpatterns = patterns('',
    #url(r'^$', include('main.urls')),

    url(r'^', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
#    url(r'^admin/', include(admin.site.urls)),
)