from django.urls import path
from .views import AuditLogListView, ReportListView, ReportSummaryView, GenerateReportView

urlpatterns = [
    path('audit-logs/', AuditLogListView.as_view(), name='audit-log-list'),
    path('reports/', ReportListView.as_view(), name='report-list'),
    path('reports/<int:pk>/summary/', ReportSummaryView.as_view(), name='report-summary'),
    path('reports/generate/', GenerateReportView.as_view(), name='report-generate'), 
]

