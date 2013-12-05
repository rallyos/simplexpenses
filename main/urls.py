from django.conf.urls import patterns, url

from main import views

urlpatterns = patterns('',
    url(r'^', views.index, name='index'),
    url(r'^user', views.user, name='user'),
    url(r'^api/', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
#    url(r'^admin/', include(admin.site.urls)),    
)