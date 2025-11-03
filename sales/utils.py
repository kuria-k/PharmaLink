def format_invoice(sale):
    return {
        'invoice_number': sale.invoice_number,
        'customer': sale.customer_name,
        'date': sale.timestamp.strftime('%Y-%m-%d'),
        'items': [
            {
                'product': item.product.name,
                'quantity': item.quantity,
                'price': float(item.price),
                'subtotal': float(item.price * item.quantity)
            } for item in sale.items.all()
        ],
        'total': float(sale.total_amount)
    }

