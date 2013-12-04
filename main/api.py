from tastypie.authorization import Authorization
from django.contrib.auth.models import User
from tastypie import fields

from tastypie.resources import ModelResource
from main.models import Category, Expense, Planned

class UserResource(ModelResource):
    class Meta:
        queryset = User.objects.all()
        resource_name = 'user_id'

class ExpenseResource(ModelResource):
    user_id = fields.ForeignKey(UserResource, 'user_id')
    class Meta:
        queryset = Expense.objects.all()
        authorization = Authorization()


class CategoryResource(ModelResource):
    user_id = fields.ForeignKey(UserResource, 'user_id')
    class Meta:
        queryset = Category.objects.all()
        authorization = Authorization()


class PlannedResource(ModelResource):
    user_id = fields.ForeignKey(UserResource, 'user_id')
    class Meta:
        queryset = Planned.objects.all()
        authorization = Authorization()