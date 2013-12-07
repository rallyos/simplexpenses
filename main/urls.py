from django.conf.urls import patterns, url

from main import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^login', views.login_user, name='login'),
    url(r'^register', views.register_user, name='register'),
    url(r'^logout', views.logout_user, name='logout')
)