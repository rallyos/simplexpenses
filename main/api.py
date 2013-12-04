from tastypie.resources import ModelResource
from main.models import Category, Expense, Planned


class ExpenseResource(ModelResource):
    class Meta:
        queryset = Expense.objects.all()
        allowed_methods = ['get']