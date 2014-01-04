from django.shortcuts import render, redirect
from django.http import HttpResponse
from main.models import Expense, Category, Planned, AppSettings
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm

from rest_framework import viewsets
from main.serializers import ExpenseSerializer, CategorySerializer, PlannedSerializer

from django.core.serializers.json import DjangoJSONEncoder

import datetime

import json

today = datetime.date.today()

def index(request):
    if request.user.is_authenticated():
        # Expiremental
        queryset = Expense.objects.filter(user_id__exact=request.user.id, date__year=today.year, date__month=today.month)
        expenses = queryset.order_by('-date')
        serializedExpenses = ExpenseSerializer(expenses, many=True)

        categories = Category.objects.filter(user_id__exact=request.user.id)
        serializedCategories = CategorySerializer(categories, many=True)

        planned = Planned.objects.filter(user_id__exact=request.user.id, planned_month__year=today.year, planned_month__month=today.month)
        serializedPlanned = PlannedSerializer(planned, many=True)

        app_settings = AppSettings.objects.get(user_id__exact=request.user.id)

        bootstrapped_data = {'expenses': json.dumps(serializedExpenses.data, cls=DjangoJSONEncoder), 'categories': json.dumps(serializedCategories.data, cls=DjangoJSONEncoder), 'planned': json.dumps(serializedPlanned.data, cls=DjangoJSONEncoder), 'currency': app_settings.currency, 'showNewCatButton': bool(app_settings.show_newCatButton)}
        return render(request, 'user/index.html', bootstrapped_data)
    else:
        return render(request, 'index.html')

# maybe create one function for all settings
def set_currency(request):
    if request.method == 'POST':
        currency = json.loads(request.body).get('currency', None)
        AppSettings.objects.create(user_id=request.user.id, currency=currency, show_newCatButton=True)

        return HttpResponse(status=201)
    else:
        currency = json.loads(request.body).get('currency', None)
        AppSettings.objects.filter(user_id=request.user.id).update(currency=currency)

        return HttpResponse(status=201)

def toggleNewCgButton(request):
        newCgButton = bool(json.loads(request.body).get('showNewCatButton', None))
        AppSettings.objects.create(user_id=request.user.id, show_newCatButton=newCgButton)
        return HttpResponse(status=201)

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

def password_change(request):
    if request.method == 'POST':
        user = request.user
        password = request.POST['data']
        user.set_password(password)
        user.save()
        return HttpResponse(status=200)

class ExpenseViewSet(viewsets.ModelViewSet):

    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        year = self.request.QUERY_PARAMS.get('year', None)
        month = self.request.QUERY_PARAMS.get('month', None)

        if year is not None:
            queryset = Expense.objects.filter(user_id__exact=self.request.user.id, date__year=year, date__month=month)
        else:
            queryset = Expense.objects.filter(user_id__exact=self.request.user.id, date__year=today.year, date__month=today.month)

        return queryset.order_by('-date')

    def pre_save(self, obj):
        obj.user_id = self.request.user.id

class CategoryViewSet(viewsets.ModelViewSet):

    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.filter(user_id__exact=self.request.user.id)

    def pre_save(self, obj):
        obj.user_id = self.request.user.id

class PlannedViewSet(viewsets.ModelViewSet):

    queryset = Planned.objects.all()
    serializer_class = PlannedSerializer

    def get_queryset(self):
        return Planned.objects.filter(user_id__exact=self.request.user.id, planned_month__year=today.year, planned_month__month=today.month)

    def pre_save(self, obj):
        obj.user_id = self.request.user.id


def freeworld(request, year, month):

    if request.user.is_authenticated():
        if year is not None:
            # Expiremental
            queryset = Expense.objects.filter(user_id__exact=request.user.id, date__year=year, date__month=month)
            expenses = queryset.order_by('-date')
            serializedExpenses = ExpenseSerializer(expenses, many=True)

            categories = Category.objects.filter(user_id__exact=request.user.id)
            serializedCategories = CategorySerializer(categories, many=True)

            planned = Planned.objects.filter(user_id__exact=request.user.id, planned_month__year=year, planned_month__month=month)
            serializedPlanned = PlannedSerializer(planned, many=True)

            bootstrapped_data = {'expenses': json.dumps(serializedExpenses.data, cls=DjangoJSONEncoder), 'categories': json.dumps(serializedCategories.data, cls=DjangoJSONEncoder), 'planned': json.dumps(serializedPlanned.data, cls=DjangoJSONEncoder)}
            return render(request, 'user/index.html', bootstrapped_data)
        else:
            return redirect('/')


