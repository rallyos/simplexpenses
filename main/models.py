''' Simplexpenses main app models
Defines the models used in the app
    Expense - Category <-> Planned

Also defines user settings models:
    currency: The currency code user wants to use
    show_category_creation_form: Should the input for new category be hidden or shown

And lastly defines a model that stores temporary code if user has forgotten its password
'''

from django.db import models
from django.contrib.auth.models import User


class Category(models.Model):
    user = models.ForeignKey(User)
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=80, blank=True)
    color = models.CharField(max_length=7)


class Expense(models.Model):
    user = models.ForeignKey(User)
    amount = models.DecimalField(max_digits=24, decimal_places=2)
    description = models.CharField(max_length=80)
    category = models.ForeignKey(Category)
    date = models.DateField()


class Planned(models.Model):
    user = models.ForeignKey(User)
    category = models.ForeignKey(Category)
    planned_amount = models.DecimalField(max_digits=24, decimal_places=2)
    planned_month = models.DateField(auto_now_add=True)


class AppSettings(models.Model):
    user = models.ForeignKey(User)
    currency = models.CharField(max_length=5, blank=True)
    # not cool name...change it when 1.7 comes
    show_CategoryCreationForm = models.BooleanField(default=True)


class AccountRecover(models.Model):
    user = models.ForeignKey(User)
    key = models.CharField(max_length=132)
