from django.conf.urls import patterns, url
from main import views

urlpatterns = patterns('',
    url(r'', views.index),
    url(r'^about', views.about),
    url(r'^set_currency', views.set_currency),
    url(r'^toggle_new_category_form', views.toggle_new_category_form),
    url(r'^login', views.login_user),
    url(r'^register', views.register_user),
    url(r'^logout', views.logout_user),
    url(r'^password_change', views.password_change),
    url(r'^forgotten_password', views.forgotten_password),
    url(r'^recover', views.recover_account),
)