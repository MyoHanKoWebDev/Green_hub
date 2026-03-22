import React from 'react'
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';

interface DescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any | null; // Replace 'any' with your PaymentData interface
}

export default function DescriptionModal({ isOpen, onClose, product }: DescriptionModalProps) {
  return (
    <div>
        <Modal
        isOpen={isOpen} 
        onClose={(onClose)}
        className="max-w-[500px]"
      >
        {product && (
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
               <img 
                  src={`http://localhost:8000/uploads/admin/${product.image}`} 
                  className="w-20 h-20 rounded-2xl object-cover shadow-lg"
                  alt=""
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {product.productName}
                  </h3>
                  <p className="text-brand-500 font-semibold">${product.price}</p>
                </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Product Description</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-white/5 p-3 rounded-2xl">
                {product.description}
              </p>
            </div>

            <Button
                variant='outline'
              onClick={onClose}
              className="w-full "
            >
              Close Details
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}

