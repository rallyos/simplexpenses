from django.conf.urls import patterns, url

from main import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^about', views.about, name='about'),
    url(r'^set_currency', views.set_currency, name='set_currency'),
    url(r'^toggleNewCgButton', views.toggleNewCgButton, name='toggleNewCgButton'),
    url(r'^login', views.login_user, name='login'),
    url(r'^register', views.register_user, name='register'),
    url(r'^logout', views.logout_user, name='logout'),
    url(r'^password_change', views.password_change, name='password_change'),
    url(r'^history/(?P<year>\d+)/(?P<month>\d+)/$', views.freeworld, name='freeworld'),
)