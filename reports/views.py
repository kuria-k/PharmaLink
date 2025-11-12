from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import AuditLog, ReportEntry
from .serializers import AuditLogSerializer, ReportEntrySerializer 
from .utils import summarize_report

class AuditLogListView(generics.ListAPIView):
    queryset = AuditLog.objects.all().order_by('-timestamp')
    serializer_class = AuditLogSerializer

class ReportListView(generics.ListAPIView):
    queryset = ReportEntry.objects.all().order_by('-generated_at')
    serializer_class = ReportEntrySerializer

class ReportSummaryView(APIView):
    def get(self, request, pk):
        try:
            report = ReportEntry.objects.get(pk=pk)
        except ReportEntry.DoesNotExist:
            return Response({'error': 'Report not found'}, status=status.HTTP_404_NOT_FOUND)

        summary = summarize_report(report)
        return Response(summary)

class GenerateReportView(APIView):
    def post(self, request):
        report_type = request.data.get('report_type', 'Automated Summary')
        report = ReportEntry(report_type=report_type)
        report.generate()
        serializer = ReportEntrySerializer(report)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


