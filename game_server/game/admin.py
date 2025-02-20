from django.contrib import admin
from import_export import resources
from import_export.admin import ImportExportModelAdmin
from .models import Question

class QuestionResource(resources.ModelResource):
    class Meta:
        model = Question

@admin.register(Question) 
class QuestionAdmin(ImportExportModelAdmin):
    resource_class = QuestionResource
    list_display = ('question_text', 'category')
