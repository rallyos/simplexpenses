from tastypie.authorization import Authorization

from tastypie.resources import ModelResource
from main.models import Category, Expense, Planned


class ExpenseResource(ModelResource):
    class Meta:
        queryset = Expense.objects.all()
        allowed_methods = ['get', 'post', 'put']
        authorization = Authorization()


class CategoryResource(ModelResource):
    class Meta:
        queryset = Category.objects.all()
        allowed_methods = ['get', 'post', 'put']
        authorization = Authorization()


class PlannedResource(ModelResource):
    class Meta:
        queryset = Planned.objects.all()
        allowed_methods = ['get', 'post', 'put']
        authorization = Authorization()
