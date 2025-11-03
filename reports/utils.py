def summarize_report(report):
    return {
        'report_type': report.report_type,
        'generated_at': report.generated_at.strftime('%Y-%m-%d %H:%M'),
        'summary': report.summary,
        'key_metrics': extract_metrics(report.data)
    }

def extract_metrics(data):
    metrics = {}
    if isinstance(data, dict):
        metrics['total_sales_today'] = data.get('total_sales_today', 0)
        metrics['total_inventory'] = data.get('total_inventory', 0)
        metrics['total_sales_month_to_date'] = data.get('total_sales_month_to_date', 0)
        metrics['total_sales_year_to_date'] = data.get('total_sales_year_to_date', 0)
        metrics['sales_by_user'] = data.get('sales_by_user', {})
    return metrics
