from django.db import models
from django.contrib.auth.models import User


class Category(models.Model):
	user = models.ForeignKey(User)
	name = models.CharField(max_length=50)
	description = models.CharField(max_length=80)
	color = models.CharField(max_length=7)

class Expense(models.Model):
	user = models.ForeignKey(User)
	amount = models.DecimalField(max_digits=24, decimal_places=2)
	description = models.CharField(max_length=80)
	category = models.ForeignKey(Category)
	date = models.DateField(auto_now_add=True)

class Planned(models.Model):
	user = models.ForeignKey(User)
	category = models.ForeignKey(Category)
	planned_amount = models.DecimalField(max_digits=24, decimal_places=2)
	planned_month = models.DateField(auto_now_add=True)

class AppSettings(models.Model):
	user = models.ForeignKey(User)
	currency = models.CharField(max_length=5, blank=True)
	show_CategoryCreationForm = models.BooleanField(default=True)

class AccountRecover(models.Model):
	user = models.ForeignKey(User)
	key = models.CharField(max_length=132)