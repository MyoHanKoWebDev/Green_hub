import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import axios from "../../../api/axios";
import { formatDate } from "../../utils/helper";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      // Reusing your index function with the pending filter
      const response = await axios.get("/user/orders?status=pending");
      
      if (response.data.status) {
        const hiddenIds = JSON.parse(localStorage.getItem("viewed_orders") || "[]");
        
        // Filter out orders already clicked by the admin
        const freshOrders = response.data.data.filter(
          (order: any) => !hiddenIds.includes(order.id)
        );
        setOrders(freshOrders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Auto-refresh every minute
    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = (orderId: number) => {
    // 1. Save to Local Storage to "Delete" it from this view
    const hiddenIds = JSON.parse(localStorage.getItem("viewed_orders") || "[]");
    const updatedHidden = [orderId, ...hiddenIds].slice(0, 50);
    localStorage.setItem("viewed_orders", JSON.stringify(updatedHidden));

    // 2. Immediate UI update
    setOrders((prev) => prev.filter((o: any) => o.id !== orderId));
    setIsOpen(false);

    // 3. Navigate to the order table or detail
    navigate(`/orders` , { state: { refresh: true } } );
  };

  const getImageUrl = (img : string) => {

  // If it's a Google URL (starts with http or https)
  if (img.startsWith("http")) {
    return img; 
  }

  // If it's a local upload from your Laravel 'public/uploads/profiles' folder
  return `http://localhost:8000/uploads/profiles/${img}`;
};

  return (
    <div className="relative">
      <button
        className="relative flex items-center justify-center text-gray-500 bg-white border border-gray-200 rounded-full h-11 w-11 dark:border-gray-800 dark:bg-gray-900"
        onClick={() => setIsOpen(!isOpen)}
      >
        {orders.length > 0 && (
          <span className="absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400 flex">
            <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
          </span>
        )}
        <svg /* Bell Icon */ className="fill-current" width="20" height="20" viewBox="0 0 20 20">
          <path d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z" fill="currentColor"/>
        </svg>
      </button>

      <Dropdown isOpen={isOpen} onClose={() => setIsOpen(false)} className="absolute -right-[240px] mt-[17px] flex h-auto w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Pending Orders ({orders.length})</h5>
        </div>

        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
          {orders.map((order: any) => (
            <li key={order.id}>
              <DropdownItem
                onItemClick={() => handleNotificationClick(order.id)}
                className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
              >
                <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
                  <div className="w-full h-full rounded-full bg-gray-100 overflow-hidden">
                              {order.user?.proImg ? (
                                <img
                                  src={getImageUrl(order.user?.proImg)}
                                  alt={order.user.proImg}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full font-bold text-gray-400">
                                  {order.user.name[0]}
                                </div>
                              )}
                            </div>
                  <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-success-500"></span>
                </span>

                <span className="block text-left">
                  <span className="mb-1.5 block text-theme-sm text-gray-500 dark:text-gray-400 space-x-1">
                    <span className="font-medium text-gray-800 dark:text-white/90">{order.user?.name || "Guest"}</span>
                    <span>ordered</span>
                    <span className="font-medium text-gray-800 dark:text-white/90">
                      {order.purchase_details?.[0]?.green_product?.name || "Product"}
                    </span>
                    {order.purchase_details?.length > 1 && <span>(+{order.purchase_details.length - 1} more)</span>}
                  </span>

                  <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
                    <span>Order #{order.id}</span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span>{formatDate(order.purchaseDate)}</span>
                  </span>
                </span>
              </DropdownItem>
            </li>
          ))}
          {orders.length === 0 && <p className="p-4 text-center text-sm text-gray-500">No pending orders.</p>}
        </ul>
      </Dropdown>
    </div>
  );
}