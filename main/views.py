''' Defines the app views'''

import datetime
import json
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.core.signing import Signer
from django.core.serializers.json import DjangoJSONEncoder
from rest_framework import viewsets
from main.serializers import ExpenseSerializer, CategorySerializer, PlannedSerializer
from main.models import Expense, Category, Planned, AppSettings, AccountRecover

TODAY = datetime.date.today()


def index(request):
    '''Shows the data to the user'''

    if request.user.is_authenticated():
        # Get the expenses but filter them and show only these that are added this month
        queryset = ExpenseViewSet().get_queryset_this_month(request)
        serializedExpenses = ExpenseSerializer(queryset, many=True)

        categories = Category.objects.filter(user_id__exact=request.user.id)
        serializedCategories = CategorySerializer(categories, many=True)

        # Get planned amounts for this month
        planned = PlannedViewSet().get_queryset_this_month(request)
        serializedPlanned = PlannedSerializer(planned, many=True)

        # Get the settings object. Containing: Currency AND show_category_creation_form
        app_settings = AppSettings.objects.get(user_id__exact=request.user.id)

        bootstrapped_data = {'expenses': json.dumps(serializedExpenses.data, cls=DjangoJSONEncoder),
                            'categories': json.dumps(serializedCategories.data, cls=DjangoJSONEncoder),
                            'planned': json.dumps(serializedPlanned.data, cls=DjangoJSONEncoder),
                            'currency': app_settings.currency,
                            'show_category_creation_form': bool(app_settings.show_CategoryCreationForm)}

        return render(request, 'user/index.html', bootstrapped_data)
    else:
        return render(request, 'index.html')


def about(request):
    '''Shows about page'''

    return render(request, 'about.html')


def set_currency(request):
    '''Sets app settings'''

    # If the user doesn't have currency set
    if request.method == 'POST':
        currency = json.loads(request.body).get('currency', None)
        AppSettings.objects.create(user_id=request.user.id, currency=currency, show_CategoryCreationForm=True)

        return HttpResponse(status=201)

    # If the user is updating the current currency
    elif request.method == 'PUT':
        currency = json.loads(request.body).get('currency', None)
        AppSettings.objects.filter(user_id=request.user.id).update(currency=currency)

        return HttpResponse(status=201)


def toggle_new_category_form(request):
    '''Show/Hides new category form'''
       
    show_category_creation_form = bool(json.loads(request.body).get('show_CategoryCreationForm', None))
    AppSettings.objects.filter(user_id=request.user.id).update(show_CategoryCreationForm=show_category_creation_form)
    
    return HttpResponse(status=201)


def register_user(request):
    '''Registers new user'''

    if request.method == 'POST':
        form = UserCreationForm(request.POST)

        if form.is_valid():
            user = form.save()
            username = request.POST['username']
            password = request.POST['password1']
            user = authenticate(username=username, password=password)

            # Create default settings
            AppSettings.objects.create(user_id=user.id, show_CategoryCreationForm=True)

            # Login the user
            if user is not None:
                if user.is_active:
                    success = HttpResponse(status=200)
                    success.set_cookie('show_tooltips', 'true', expires=365 * 24 * 60 * 60)
                    login(request, user)
                    return success
                     

        return HttpResponse(status=403) 

def login_user(request):
    '''Login user'''

    if request.method == 'GET':
        username = request.GET['username']
        password = request.GET['password']
        user = authenticate(username=username, password=password)
    
        if user is not None:
            if user.is_active:
                login(request, user)
                return HttpResponse(status=200)
            else:
                # Change this if you delete/deactivate user/user has deleted it's account
                return redirect('/')
        else:
            return HttpResponse(status=404)

def logout_user(request):
    '''Logout user'''

    logout(request)
    return redirect('/')

def password_change(request):
    '''Changes user password'''

    if request.method == 'POST':
        user = request.user
        password = request.POST['data']
        user.set_password(password)
        user.save()
        return HttpResponse(status=200)

def forgotten_password(request):
    '''Send forgotten password mail
    Recieves user email, generate key and stores it to the database
    Then sends url address to the user mail
    '''

    if request.method == 'POST':
        email = request.POST['username']

        # Check if exists
        try:
            user = User.objects.get(username=email)
        except ObjectDoesNotExist:
            return HttpResponse(status=404)

        # Using random_password method is not good for this thing I suppose
        key = User.objects.make_random_password(length=32)

        from django.core.mail import send_mail

        message = """
Use the link below to login to your account and then please change your password.
http://simplexpenses.heroku.com/recover?key=%s
""" % (key)

        send_mail('Simplexpenses account recovery', message, 'app20032559@heroku.com', [email])

        # Sign key with signer and save it to the DB with the user id
        signed_key = Signer().sign(key)
        token_key = AccountRecover.objects.create(user_id=user.id, key=signed_key)
        token_key.save()

        return HttpResponse(status=200)

def recover_account(request):
    '''Recovers account
    Verifies the key parameter from the url then login the user and deletes the key
    '''

    key = request.GET['key']
    signed_key = Signer().sign(key)
    
    try:
        key_obj = AccountRecover.objects.get(key=signed_key)
        user = User.objects.get(id=key_obj.user_id)

        # This is needed because of the non-standard usage of login() on line 187
        user.backend = 'django.contrib.auth.backends.ModelBackend'

        login(request, user)
        key_obj.delete()
        
        return redirect('/')

    except ObjectDoesNotExist:
        return HttpResponse('Key already used, or does not exists.', status=404)



class ExpenseViewSet(viewsets.ModelViewSet):

    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        '''Preparing to add changes so I can implement endpoint for history/year/month'''

        year = self.request.QUERY_PARAMS.get('year', None)
        month = self.request.QUERY_PARAMS.get('month', None)

        if year is not None:
            queryset = Expense.objects.filter(user_id__exact=self.request.user.id, date__year=year, date__month=month)
        else:
            queryset = Expense.objects.filter(user_id__exact=self.request.user.id, date__year=TODAY.year, date__month=TODAY.month)

        return queryset.order_by('-date')

    def get_queryset_this_month(self, request):
        '''Preparing to add changes so I can implement endpoint for history/year/month'''

        queryset = Expense.objects.filter(user_id__exact=request.user.id, date__year=TODAY.year, date__month=TODAY.month)    
        return queryset.order_by('-date')

    def pre_save(self, obj):
        obj.user_id = self.request.user.id

class CategoryViewSet(viewsets.ModelViewSet):

    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_queryset(self):
        '''Preparing to add changes so I can implement endpoint for history/year/month'''

        return Category.objects.filter(user_id__exact=self.request.user.id)

    def pre_save(self, obj):
        obj.user_id = self.request.user.id

class PlannedViewSet(viewsets.ModelViewSet):

    queryset = Planned.objects.all()
    serializer_class = PlannedSerializer

    def get_queryset(self):
        '''Preparing to add changes so I can implement endpoint for history/year/month'''

        return Planned.objects.filter(user_id__exact=self.request.user.id, planned_month__year=TODAY.year, planned_month__month=TODAY.month)

    def get_queryset_this_month(self, request):
        '''Preparing to add changes so I can implement endpoint for history/year/month'''

        return Planned.objects.filter(user_id__exact=request.user.id, planned_month__year=TODAY.year, planned_month__month=TODAY.month)

    def pre_save(self, obj):
        obj.user_id = self.request.user.id
