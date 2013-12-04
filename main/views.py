from django.shortcuts import render, HttpResponse

# Create your views here.

def index(request):
	return render(request, 'index.html')


from rest_framework import viewsets
from quickstart.serializers import ExpenseSerializer, CategorySerializer, PlannedSerializer


class ExpenseViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class PlannedViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Planned.objects.all()
    serializer_class = PlannedSerializer