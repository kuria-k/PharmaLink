from rest_framework import serializers
from .models import AuditLog, ReportEntry

class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = ['id', 'action', 'actor', 'timestamp', 'details']


class ReportEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportEntry
        fields = ['id', 'report_type', 'generated_at', 'summary', 'data']
        read_only_fields = ['generated_at', 'summary', 'data']
