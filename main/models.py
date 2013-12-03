from django.db import models
from django.contrib.auth.models import User


class Category(models.Model):
	title = models.CharField()
	description = models.CharField()
	color = models.CharField(max_length=7)

class Expense(models.Model):
	user = models.ForeignKey(User)
	amount = models.IntegerField()
	description = models.CharField()
	category = models.ForeignKey(Category)
	date = models.DateField(auto_now_add=True)

class Planned(models.Model):
	cateogory = models.ForeignKey(Category)
	planned_amount = models.IntegerField()
	planned_month = models.DateField(auto_now_add=True