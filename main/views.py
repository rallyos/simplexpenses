from django.shortcuts import render
from main.models import Expense, Category, Planned

from rest_framework import viewsets
from main.serializers import ExpenseSerializer, CategorySerializer, PlannedSerializer

def index(request):
    if request.user.is_authenticated():
    	return render(request, 'user/index.html')
    else:
        return render(request, 'index.html')

class ExpenseViewSet(viewsets.ModelViewSet):

    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        return Expense.objects.filter(user_id__exact=self.request.user.id)

class CategoryViewSet(viewsets.ModelViewSet):

    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.filter(user_id__exact=self.request.user.id)

class PlannedViewSet(viewsets.ModelViewSet):

    queryset = Planned.objects.all()
    serializer_class = PlannedSerializer

    def get_queryset(self):
        return Planned.objects.filter(user_id__exact=self.request.user.id)