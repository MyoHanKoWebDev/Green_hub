<!DOCTYPE html>
<html>

<head>
    <style>
    body {
        font-family: sans-serif;
        color: #333;
    }

    .header {
        text-align: center;
        border-bottom: 2px solid #10b981;
        padding-bottom: 20px;
    }

    .details {
        margin-top: 30px;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
    }

    th {
        background-color: #f3f4f6;
        text-align: left;
        padding: 10px;
    }

    td {
        padding: 10px;
        border-bottom: 1px solid #eee;
    }

    .total {
        text-align: right;
        font-weight: bold;
        font-size: 1.2em;
        margin-top: 20px;
    }
    </style>
</head>

<body>
    <div class="header">
        <h1>GREENHUB VOUCHER</h1>
        <p>Order #{{ $purchase->id }}</p>
    </div>
    <div class="details">
        <p><strong>Customer:</strong> {{ $purchase->user->name }}</p>
        <p><strong>Date:</strong> {{ $purchase->purchaseDate }}</p>
        <p><strong>Phone:</strong> {{ $purchase->phone_number }}</p>
    </div>
    <table>
        <thead>
            <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
            </tr>
        </thead>
        <tbody>
            @php $total = 0; @endphp
            @foreach($purchase->purchaseDetails as $detail)
            <tr>
                <td>{{ $detail->greenProduct->productName }}</td>
                <td>{{ $detail->quantity }}</td>
                <td>{{ number_format($detail->greenProduct->price) }} MMK</td>
            </tr>
            @php $total += $detail->greenProduct->price * $detail->quantity; @endphp
            @endforeach
        </tbody>
    </table>
    <div class="total">Total: {{ number_format($total) }} MMK</div>
</body>

</html>
