import React from "react";
import {
  Button,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { XMarkIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Shoppingcart = ({ open, setOpen }) => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();  

  // 4. Calculate Subtotal
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const handleCheckoutClick = (e) => {
    e.preventDefault();

    if (cartItems.length == 0) {
      toast.error("Please select at least one product.");
      return;
    }

    // 2. If logged in, close the cart and navigate
    setOpen(false);
    navigate("/checkout");
  };

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-[100]">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <DialogPanel
              transition
              className="pointer-events-auto mt-16 w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full"
            >
              <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl rounded-l-[2.5rem]">
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-lg font-bold text-gray-900 uppercase tracking-tight">
                      Shopping cart
                    </DialogTitle>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="relative -m-2 p-2 text-gray-400 hover:text-gray-900 transition"
                      >
                        <XMarkIcon className="size-6" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-8">
                    <ul role="list" className="-my-6 divide-y divide-gray-100">
                      {cartItems.map((product) => (
                        <li key={product.id} className="flex py-6">
                          <div className="size-24 shrink-0 overflow-hidden rounded-2xl border border-gray-100">
                            <img
                              src={`${import.meta.env.VITE_BACKEND_URL}/uploads/admin/${product.image}`}
                              className="size-full object-cover"
                              alt={product.name}
                            />
                          </div>

                          <div className="ml-4 flex flex-1 flex-col">
                            <div>
                              <div className="flex justify-between text-base font-bold text-gray-900">
                                <h3>{product.productName}</h3>
                                {/* Using your requested Myanmar Ks format */}
                                <p className="ml-4">
                                  {(
                                    product.price * product.quantity
                                  ).toLocaleString()}{" "}
                                  Ks
                                </p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">
                                {product.eco_projects[0].title}
                              </p>
                            </div>

                            <div className="flex flex-1 items-end justify-between text-sm">
                              {/* --- PLUS / MINUS CONTROLS --- */}
                              <d
                                iv
                                className="flex items-center border border-gray-200 rounded-full px-2 py-1 gap-3"
                              >
                                <button
                                  onClick={() => updateQuantity(product.id, -1)}
                                  className="p-1 hover:text-lime-600 transition"
                                >
                                  <MinusIcon className="size-4" />
                                </button>
                                <span className="font-bold text-gray-900 w-4 text-center">
                                  {product.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      product.id,
                                      1,
                                      product.stock_qty,
                                    )
                                  }
                                  className="p-1 hover:text-lime-600 transition"
                                >
                                  <PlusIcon className="size-4" />
                                </button>
                              </d>

                              <button
                                onClick={() => removeFromCart(product.id)}
                                type="button"
                                className="font-semibold text-red-500 hover:text-red-600 transition"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="border-t border-gray-200 px-4 py-6 sm:px-6 bg-gray-50/50">
                  <div className="flex justify-between text-base font-bold text-gray-900">
                    <p>Subtotal</p>
                    <p>{subtotal.toLocaleString()} Ks</p>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500 italic">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <div className="mt-6">
                    <Button
                      disabled={subtotal === 0}
                      onClick={handleCheckoutClick}
                      className="w-full flex items-center justify-center rounded-full bg-black px-6 py-4 text-base font-bold text-white shadow-lg hover:bg-gray-800 transition active:scale-95 disabled:bg-gray-300"
                    >
                      Checkout
                    </Button>
                  </div>
                  <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                    <p>
                      or{"  "}
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="font-medium text-lime-600 hover:text-lime-500"
                      >
                        Continue Shopping
                        <span aria-hidden="true"> &rarr;</span>
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default Shoppingcart;
