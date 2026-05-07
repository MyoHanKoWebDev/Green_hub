@component('mail::message')
# Order Rejected! 🌿

Hello {{ $purchase->user->name }},

We regret to inform you that your order #{{ $purchase->id }} has been rejected.

**Reason:** This usually happens if the payment proof was unclear or the transaction was not found.

If you believe this is a mistake, please contact our support or try placing a new order with a valid screenshot.

[Contact Support](mailto:support@greenhub.com)

Best regards,
The GreenHub Team
@endcomponent
