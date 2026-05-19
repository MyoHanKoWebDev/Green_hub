import React, { useState, useEffect } from "react";
import axios from "../../../api/axios";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { formatDate } from "../../utils/formatDate";

const SkeletonOrder = () => (
  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm animate-pulse flex items-center justify-between">
    <div className="space-y-3">
      <div className="h-4 w-32 bg-gray-200 rounded"></div>
      <div className="h-3 w-48 bg-gray-100 rounded"></div>
      <div className="h-3 w-20 bg-gray-50 rounded"></div>
    </div>
    <div className="flex flex-col items-end space-y-2">
      <div className="h-6 w-16 bg-gray-200 rounded"></div>
      <div className="h-5 w-24 bg-gray-100 rounded-full"></div>
    </div>
  </div>
);

export default function UserOrders({ userId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`/api/user/orders/${userId}`);
        if (res.data.status) {
          setOrders(res.data.data);
        }
      } catch (err) {
        console.error("Order fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userId]);

  // Logic to calculate total based on your GreenProduct price and quantity
  const calculateTotal = (details) => {
    if (!details || !Array.isArray(details)) return "0.00";
    return details.reduce((sum, item) => {
      const price = item.green_product?.price || 0;
      return sum + (price * item.quantity);
    }, 0).toFixed(2);
  };

  const getStatusStyles = (status) => {
    const s = status?.toLowerCase();
    if (s === "confirmed" || s === "success") return "bg-green-100 text-green-700 border-green-200";
    if (s === "pending") return "bg-yellow-100 text-yellow-700 border-yellow-200";
    if (s === "rejected") return "bg-red-100 text-red-700 border-red-200";
    return "bg-gray-100 text-gray-600 border-gray-200";
  };

  if (loading) {
    return (
      <div className="max-w-4xl space-y-4 px-4">
        {[1, 2, 3].map((n) => <SkeletonOrder key={n} />)}
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-4 pb-10  px-4 sm:px-6 lg:px-10">
      {orders.length > 0 ? (
        orders.map((order) => (
          <div
            key={order.id}
            className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-lime-300 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-lime-600">Order #{order.id}</p>
                <span className="text-gray-400 text-xs font-medium">
                  {formatDate(order.purchaseDate)}
                </span>
              </div>
              
              {/* List of Products from the Nested GreenProduct Relationship */}
              <div className="space-y-1">
                {order.purchase_details?.map((detail, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <p className="text-sm font-bold text-gray-800">
                      {detail.green_product?.productName || "Unknown Product"}
                    </p>
                    <span className="text-xs font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                      x{detail.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex md:flex-col items-center md:items-end justify-between gap-3 border-t md:border-t-0 pt-4 md:pt-0">
              <div className="text-left md:text-right">
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Amount Due</p>
                <p className="font-black text-gray-900">{calculateTotal(order.purchase_details)} Ks</p>
              </div>
              <span className={`text-[10px] uppercase font-black px-4 py-1.5 rounded-full border shadow-sm ${getStatusStyles(order.status)}`}>
                {order.status}
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
          <ShoppingBagIcon className="w-16 h-16 text-gray-100 mx-auto mb-4" />
          <p className="text-gray-400 font-bold text-lg">No order history found</p>
        </div>
      )}
    </div>
  );
}