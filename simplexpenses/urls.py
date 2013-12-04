from django.conf.urls import patterns, include, url
from django.contrib import admin

from tastypie.api import Api
from main.api import ExpenseResource, CategoryResource, PlannedResource

#admin.autodiscover()
expense_resource = ExpenseResource()
category_resource = CategoryResource()
planned_resource = PlannedResource()

urlpatterns = patterns('',
    url(r'^$', include('main.urls')),
	url(r'^api/expense/', include(expense_resource.urls)),
	url(r'^api/category/', include(category_resource.urls)),
	url(r'^api/planned/', include(planned_resource.urls)),
#    url(r'^admin/', include(admin.site.urls)),
)
