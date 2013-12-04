from django.conf.urls import patterns, include, url
from django.contrib import admin

from tastypie.api import Api
from main.api.resources import ExpenseResource

#admin.autodiscover()

v1_api = Api(api_name='v1')
v1_api.register(ExpenseResource())


urlpatterns = patterns('',
    url(r'^$', include('main.urls')),
	url(r'^api/', include(v1_api.urls)),
#    url(r'^admin/', include(admin.site.urls)),
)
