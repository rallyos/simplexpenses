from tastypie.authorization import Authorization
from django.contrib.auth.models import User

from tastypie.resources import ModelResource
from main.models import Category, Expense, Planned

class UserResource(ModelResource):
    class Meta:
        queryset = User.objects.all()
        resource_name = 'user'

class ExpenseResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')
    class Meta:
        queryset = Expense.objects.all()
        authorization = Authorization()


class CategoryResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')
    class Meta:
        queryset = Category.objects.all()
        authorization = Authorization()


class PlannedResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')
    class Meta:
        queryset = Planned.objects.all()
        authorization = Authorization()