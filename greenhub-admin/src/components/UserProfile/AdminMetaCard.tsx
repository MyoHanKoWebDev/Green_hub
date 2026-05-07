import { useAuth } from "../../context/AuthContext.js";

interface AdminData {
  id: number;
  adName: string;
  adEmail: string;
  adImage: string;
  addDate: string;
}

export default function UserMetaCard() {
  const {user} = useAuth();

  // --- ACTUAL CONTENT STATE ---
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
               <img 
                src={user?.adImage ? `http://localhost:8000/uploads/admin/${user.adImage}` : "/images/user/user-30.jpg"}
                alt="user" 
                className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800 bg-gray-50"
              />
          
          <div className="order-3 xl:order-2">
            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
              {user?.adName}
            </h4>
            <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
              <p className="text-sm text-gray-500 dark:text-gray-400">Admin</p>
              <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Mandalay, Myanmar
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
