import React, { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import {
  CreditCardIcon,
  MapPinIcon,
  PhoneIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const Shipping = () => {
  const { cartItems, totalAmount, setCartItems } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get("/api/admin/payments");
        if (response.data.status) {
          setPayments(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch payment methods", err);
      }
    };
    fetchPayments();
  }, []);

  const [formData, setFormData] = useState({
    shipping_address: "",
    phone_number: "",
    payment_id: "", // e.g., 'kpay_01'
    transaction_no: "",
    payment_proof_img: null,
    payment_type: "", // for UI selection
  });

  const handleFileChange = (e) => {
    setFormData({ ...formData, payment_proof_img: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("member_id", user.id);
    data.append("shipping_address", formData.shipping_address);
    data.append("phone_number", formData.phone_number);
    data.append("payment_id", formData.payment_id);
    data.append("transaction_no", formData.transaction_no);
    if (formData.payment_proof_img) {
      data.append("payment_proof_img", formData.payment_proof_img);
    }

    // Append cart items as an array
    cartItems.forEach((item, index) => {
      data.append(`items[${index}][product_id]`, item.id);
      data.append(`items[${index}][quantity]`, item.quantity);
    });

    try {
      const response = await axios.post(`/api/user/orders`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 201 || response.data.status === true) {
        // 1. Clear the Cart immediately
        setCartItems([]);

        // 2. Professional Toast Message
        toast.success(
          <span>
            <b className="block mb-1">Order Placed Successfully!</b>
            Our team is reviewing your payment. Please keep an eye on your email
            today for a confirmation update.
          </span>,
          {
            duration: 6000,
            icon: "🌿",
            style: {
              borderRadius: "15px",
              background: "#fff",
              color: "#333",
              padding: "16px",
            },
          },
        );

        // 3. Navigate back to products
       navigate(`/user/${user.id}`, { 
  state: { activeTab: "orders" } 
});
      }
    } catch (err) {
      if (err.response?.status === 422) {
        const errorMessage = err.response.data.message;

        // If the error message mentions "stock", show a warning icon
        if (errorMessage.includes("stock")) {
          toast.error(errorMessage, { icon: "⚠️" });
        } else {
          toast.error(errorMessage);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: INFORMATION */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-8">
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? "bg-lime-500 text-white" : "bg-gray-200"}`}
            >
              1
            </div>
            <div className="h-0.5 w-12 bg-gray-200"></div>
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${step === 2 ? "bg-lime-500 text-white" : "bg-gray-200"}`}
            >
              2
            </div>
            <h1 className="text-2xl font-bold ml-2">Checkout Details</h1>
          </div>

          {step === 1 ? (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <MapPinIcon className="h-5 w-5" /> Shipping Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={user?.name}
                    disabled
                    className="w-full p-3 bg-gray-100 rounded-xl border-none text-gray-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="w-full p-3 bg-gray-100 rounded-xl border-none text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <PhoneIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text" // Changed to text to prevent 'e' and scroll-wheel bugs
                    required
                    value={formData.phone_number || ""} // Control the component
                    placeholder="09..."
                    className="w-full pl-10 p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-lime-500 outline-none"
                    onChange={(e) => {
                      const value = e.target.value;
                      // Regex: Only allow numbers AND it must start with 0 (and then 9 if length > 1)
                      if (
                        value === "" ||
                        (/^\d+$/.test(value) && value.startsWith("0"))
                      ) {
                        // Optional: force '09' specifically
                        if (value.length === 2 && value !== "09") return;

                        setFormData({ ...formData, phone_number: value });
                      }
                    }}
                    maxLength={11} // Prevents overly long numbers
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Shipping Address <span className="text-red-600">*</span>
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Street name, Township, City..."
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-lime-500 outline-none"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shipping_address: e.target.value,
                    })
                  }
                ></textarea>
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!formData.phone_number || !formData.shipping_address}
                className="w-full bg-black text-white font-bold py-4 rounded-2xl hover:bg-gray-800 transition shadow-lg disabled:bg-gray-300"
              >
                Continue to Payment
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <CreditCardIcon className="h-5 w-5" /> Select Payment Method
              </h2>

              {/* Payment Type Selection (Dynamic from Backend) */}
              <div className="space-y-3">
                {payments.length > 0 ? (
                  payments.map((payment) => (
                    <label
                      key={payment.id}
                      className={`flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition shadow-sm ${
                        formData.payment_id === payment.id
                          ? "border-lime-500 bg-lime-50"
                          : "border-gray-100 hover:border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="pay"
                          className="hidden"
                          value={payment.id}
                          checked={formData.payment_id === payment.id}
                          onChange={() =>
                            setFormData({
                              ...formData,
                              payment_id: payment.id,
                              payment_type: payment.method, // Storing method name for UI display
                            })
                          }
                        />
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800">
                            {payment.method}
                          </span>
                          <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                            Instant Transfer{" "}
                            <strong className="text-gray-500 text-xs">
                              ({payment.phone})
                            </strong>
                          </span>
                        </div>
                      </div>

                      {/* Image from your Laravel Public Uploads folder */}
                      <div className="w-12 h-10 overflow-hidden rounded-md border border-gray-100">
                        <img
                          src={`${import.meta.env.VITE_BACKEND_URL}/uploads/admin/${payment.payImg}`}
                          alt={payment.method}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </label>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500 italic border-2 border-dashed border-gray-200 rounded-2xl">
                    Loading payment methods...
                  </div>
                )}
              </div>

              {formData.payment_id && (
                <div className="pt-4 space-y-4 animate-slideDown">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Transaction Number{" "}
                      <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Txn ID (Min. 6 digits)"
                      // Set a reasonable max length (e.g., 15) so they don't type a whole book
                      maxLength={15}
                      value={formData.transaction_no || ""}
                      className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-lime-500 outline-none"
                      onChange={(e) => {
                        const val = e.target.value;
                        // ALLOW only digits, but any amount of them (using * instead of {0})
                        if (val === "" || /^\d*$/.test(val)) {
                          setFormData({
                            ...formData,
                            transaction_no: val,
                          });
                        }
                      }}
                      // This helps with HTML5 validation during form submission
                      onBlur={() => {
                        if (
                          formData.transaction_no.length < 6 &&
                          formData.transaction_no.length > 0
                        ) {
                          alert("Transaction number must be at least 6 digits");
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Payment Proof{" "}
                      <span className="text-red-600">*</span>
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full min-h-[128px] border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition overflow-hidden">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {/* Show Image Preview if it exists, otherwise show Icon */}
                          {formData.payment_proof_img ? (
                            <div className="relative w-full px-4">
                              <img
                                src={URL.createObjectURL(
                                  formData.payment_proof_img,
                                )}
                                alt="Preview"
                                className="h-20 mx-auto rounded-lg object-contain"
                              />
                              <p className="text-xs text-lime-600 mt-2 font-medium">
                                {formData.payment_proof_img.name}
                              </p>
                            </div>
                          ) : (
                            <>
                              <PhotoIcon className="w-8 h-8 text-gray-400 mb-2" />
                              <p className="text-sm text-gray-500 px-4 text-center">
                                Click to upload screenshot (JPG, PNG)
                              </p>
                            </>
                          )}
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file && !file.type.startsWith("image/")) {
                              alert("Please upload an image file");
                              return;
                            }
                            handleFileChange(e);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-100 text-gray-800 font-bold py-4 rounded-2xl hover:bg-gray-200 transition"
                >
                  Back
                </button>
                <button
                  disabled={
                    loading ||
                    formData.transaction_no.length < 6 ||
                    !formData.payment_proof_img
                  }
                  onClick={handleSubmit}
                  className="flex-[2] bg-black text-white font-bold py-4 rounded-2xl hover:bg-gray-800 transition shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : "Place Order Now"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6">Your Cart</h2>
            <div className="space-y-4 max-h-[400px] overflow-y-visible pr-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative">
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL}/uploads/admin/${item.image}`}
                      className="h-16 w-16 rounded-xl object-cover border"
                      alt={item.productName}
                    />
                    <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] h-5 w-5 flex items-center justify-center rounded-full font-bold">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-800 line-clamp-1">
                      {item.productName}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.eco_projects[0].title}
                    </p>
                  </div>
                  <div className="font-bold text-sm">
                    {(item.price * item.quantity).toLocaleString()} Ks
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{totalAmount.toLocaleString()} Ks</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-lime-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-xl font-extrabold text-gray-900 pt-2">
                <span>Total</span>
                <span>{totalAmount.toLocaleString()} Ks</span>
              </div>
            </div>
          </div>

          <div className="bg-lime-50 rounded-2xl p-4 border border-lime-100">
            <p className="text-xs text-lime-800 leading-relaxed italic">
              * By placing this order, you are contributing to{" "}
              <strong>Green Projects</strong> in Myanmar. Thank you for shopping
              sustainably with GreenHub.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
