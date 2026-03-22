import React from "react";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { PhotoIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";

export default function OrderDetailsModal({ isOpen, onClose, order }: any) {
  if (!order) return null;

  const totalAmount = order.purchase_details?.reduce((acc: number, item: any) => {
    return acc + (item.quantity * (item.green_product?.price || 0));
  }, 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px]">
      <div className="p-6 bg-white rounded-3xl dark:bg-gray-900 lg:p-10">
        <h4 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white/90">
          Order Review #{order.id}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Payment Section */}
          <div className="space-y-4">
            <div>
              <Label>Payment Proof</Label>
              <div className="mt-2 relative group rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10 aspect-video bg-gray-50 flex items-center justify-center">
                {order.transaction?.payment_proof_img ? (
                  <img 
                    src={`http://localhost:8000/uploads/payments/${order.transaction.payment_proof_img}`} 
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => window.open(`http://localhost:8000/uploads/payments/${order.transaction.payment_proof_img}`)}
                  />
                ) : (
                  <PhotoIcon className="w-10 h-10 text-gray-300" />
                )}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
              <p className="text-xs text-gray-400 uppercase font-bold">Transaction ID</p>
              <p className="text-sm font-mono text-gray-700 dark:text-gray-300 truncate">{order.transaction?.tran_no}</p>
            </div>
          </div>

          {/* Items Section */}
          <div className="flex flex-col">
            <Label>Ordered Items</Label>
            <div className="mt-2 flex-1 space-y-3 max-h-[250px] overflow-y-auto pr-2">
              {order.purchase_details?.map((item: any) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-white/5">
                  <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center">
                    <ShoppingBagIcon className="w-5 h-5 text-brand-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium dark:text-white">{item.green_product?.productName}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
                    ${(item.quantity * item.green_product?.price).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-dashed border-gray-200 dark:border-white/10 flex justify-between items-center">
              <span className="text-gray-500 font-medium">Total Amount</span>
              <span className="text-xl font-bold text-brand-500">${totalAmount?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button variant="outline" onClick={onClose} className="w-32">Close</Button>
        </div>
      </div>
    </Modal>
  );
}