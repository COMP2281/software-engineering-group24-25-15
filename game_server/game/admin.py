from django.contrib import admin
from import_export import resources
from import_export.admin import ImportExportModelAdmin
from .models import Question, Statistics

class QuestionResource(resources.ModelResource):
    class Meta:
        model = Question

@admin.register(Statistics)
class StatisticsAdmin(admin.ModelAdmin):
    pass

@admin.register(Question)
class QuestionAdmin(ImportExportModelAdmin):
    pass

