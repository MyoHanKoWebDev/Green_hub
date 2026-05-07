@component('mail::message')
# Order Confirmed! 🌿

Hello {{ $purchase->user->name }},

Great news! We've verified your payment. Your green products are being prepared for delivery.

**Shipping Address:** {{ $purchase->shipping_address }}
**Phone:** {{ $purchase->phone_number }}

**Order ID:** #{{ $purchase->id }}
**Order Date:** {{ \Carbon\Carbon::parse($purchase->purchaseDate)->setTimezone('Asia/Yangon')->format('d-M-Y h:i A') }}

### Items Ordered:
@component('mail::table')
| Product | Quantity | Price |
| :--- | :---: | :--- |
@php $total = 0; @endphp
@foreach($purchase->purchaseDetails as $detail)
@php
$subtotal = $detail->greenProduct->price * $detail->quantity;
$total += $subtotal;
@endphp
| {{ $detail->greenProduct->productName }} | {{ $detail->quantity }} | {{ number_format($detail->greenProduct->price) }}
@endforeach
| **Total** | | **{{ number_format($total) }} MMK** |
@endcomponent

@component('mail::button', ['url' => 'http://localhost:8000/api/orders/voucher/' . $purchase->id])
Download Your Voucher
@endcomponent

Thank you for choosing Nganter!

Regards,
The GreenHub Team
@endcomponent
