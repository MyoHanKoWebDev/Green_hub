import { getImageUrl } from "../../utils/getImageUrl";

const UserMetaCard = ({user}) => {
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
               <img 
                src={getImageUrl(user?.proImg)}
                alt="user" 
                className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full bg-gray-50 object-cover"
              />
          
          <div className="order-3 xl:order-2">
            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
              {user?.name}
            </h4>
            <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
              <p className="text-sm text-lime-600 ">Eco Member</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserMetaCard;