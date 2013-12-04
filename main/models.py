from django.db import models
from django.contrib.auth.models import User
from tastypie.utils.timezone import now
from django.template.defaultfilters import slugify


class Category(models.Model):
	user = models.ForeignKey(User)
	title = models.CharField(max_length=50)
	description = models.CharField(max_length=80)
	color = models.CharField(max_length=7)

	def __unicode__(self):
		return self.title
		
	def save(self, *args, **kwargs):
		# For automatic slug generation.
		if not self.slug:
			self.slug = slugify(self.title)[:50]

		return super(Entry, self).save(*args, **kwargs)

class Expense(models.Model):
	user = models.ForeignKey(User)
	amount = models.DecimalField(max_digits=12, decimal_places=2)
	description = models.CharField(max_length=80)
	category = models.ForeignKey(Category)
	date = models.DateField(auto_now_add=True)

	def __unicode__(self):
		return self.title

	def save(self, *args, **kwargs):
		# For automatic slug generation.
		if not self.slug:
			self.slug = slugify(self.title)[:50]

		return super(Entry, self).save(*args, **kwargs)

class Planned(models.Model):
	user = models.ForeignKey(User)
	cateogory = models.ForeignKey(Category)
	planned_amount = models.DecimalField(max_digits=12, decimal_places=2)
	planned_month = models.DateField(auto_now_add=True)

	def __unicode__(self):
		return self.title

	def save(self, *args, **kwargs):
		# For automatic slug generation.
		if not self.slug:
			self.slug = slugify(self.title)[:50]

		return super(Entry, self).save(*args, **kwargs)
