from django.shortcuts import render, redirect
from django.http import HttpResponse
from main.models import Expense, Category, Planned
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm

from rest_framework import viewsets
from main.serializers import ExpenseSerializer, CategorySerializer, PlannedSerializer

from django.core.serializers.json import DjangoJSONEncoder
########
from django.views.decorators.csrf import csrf_exempt
########

import json

def index(request):
    if request.user.is_authenticated():
        # Expiremental
        expenses = Expense.objects.filter(user_id__exact=request.user.id)
        serializedBookmarks = ExpenseSerializer(expenses, many=True)

        categories = Category.objects.filter(user_id__exact=request.user.id)
        serializedBookmarkCollections = CategorySerializer(categories, many=True)

        bootstrapped_data = {'expenses': json.dumps(serializedBookmarks.data, cls=DjangoJSONEncoder), 'categories': json.dumps(serializedBookmarkCollections.data, cls=DjangoJSONEncoder)}
        return render(request, 'user/index.html', bootstrapped_data)
    else:
        return render(request, 'index.html')

def register_user(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)

        if form.is_valid():
            user = form.save()

            username = request.POST['username']
            password = request.POST['password1']
            user = authenticate(username=username, password=password)

            if user is not None:
                if user.is_active:
                    login(request, user)
                    success = HttpResponse(status=200)
                    return success

        return HttpResponse(status=403) 

def login_user(request):
    if request.method == 'GET':
        username = request.GET[ 'username' ]
        password = request.GET[ 'password' ]
        user = authenticate(username=username, password=password)
    
        # If authenticated 
        if user is not None:
            if user.is_active:
                # Login and set the token cookie
                login(request, user)
                login_success = HttpResponse(status=200)

                return login_success
            else:
                # Change this if you delete/deactivate user/user has deleted it's account
                return redirect('/')
        else:
        # Return an 'invalid login' error message.
            return HttpResponse(status=404)

def logout_user(request):
    logout(request)
    return redirect('/')

# Put some csrf excerpts to ease the api testing before adding auth

@csrf_exempt
class ExpenseViewSet(viewsets.ModelViewSet):

    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        return Expense.objects.filter(user_id__exact=self.request.user.id)

    def pre_save(self, obj):
        obj.user_id = self.request.user.id

@csrf_exempt
class CategoryViewSet(viewsets.ModelViewSet):

    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.filter(user_id__exact=self.request.user.id)

    def pre_save(self, obj):
        obj.user_id = self.request.user.id

@csrf_exempt
class PlannedViewSet(viewsets.ModelViewSet):

    queryset = Planned.objects.all()
    serializer_class = PlannedSerializer

    def get_queryset(self):
        return Planned.objects.filter(user_id__exact=self.request.user.id)

    def pre_save(self, obj):
        obj.user_id = self.request.user.id
