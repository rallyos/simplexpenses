from django.contrib.auth.models import User
from rest_framework import serializers


class ExpenseSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Expense
        fields = ('user_id', 'amount', 'description', 'category_id', 'date')

class CategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Category
        fields = ('user_id', 'title', 'description', 'color')

class PlannedSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Planned
        fields = ('user_id', 'category_id', 'planned_amount', 'planned_month')