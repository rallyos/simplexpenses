from django.shortcuts import render
from django.http import HttpResponse
from main.models import Expense, Category, Planned
from django.contrib.auth import authenticate, login, logout

from rest_framework import viewsets
from main.serializers import ExpenseSerializer, CategorySerializer, PlannedSerializer

def index(request):
    if request.user.is_authenticated():
    	return render(request, 'user/index.html')
    else:
        return render(request, 'index.html')

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



class ExpenseViewSet(viewsets.ModelViewSet):

    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        return Expense.objects.filter(user_id__exact=self.request.user.id)

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
        return Planned.objects.filter(user_id__exact=self.request.user.id)

    def pre_save(self, obj):
        obj.user_id = self.request.user.id
