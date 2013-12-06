from django.contrib.auth.models import User
from rest_framework import serializers
from main.models import Expense, Category, Planned

class ExpenseSerializer(serializers.HyperlinkedModelSerializer):

#	user_id = serializers.IntegerField(required=False)
#  	category_id = serializers.IntegerField(required=False)

	class Meta:
		model = Expense
		fields = ('id', 'user_id', 'amount', 'description', 'category_id', 'date')

class CategorySerializer(serializers.HyperlinkedModelSerializer):

#  	user_id = serializers.IntegerField(required=False)

	class Meta:
		model = Category
		fields = ('id', 'user_id', 'title', 'description', 'color')

class PlannedSerializer(serializers.HyperlinkedModelSerializer):

#  	user_id = serializers.IntegerField(required=False)
#  	category_id = serializers.IntegerField(required=False)

	class Meta:
		model = Planned
		fields = ('id', 'user_id', 'category_id', 'planned_amount', 'planned_month')