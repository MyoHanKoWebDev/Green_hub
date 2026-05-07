import { useModal } from "../../hooks/useModal";
import EditPasswordModal from "./EditPasswordModal";

export default function SecurityCard() {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Account Security
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Password
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  ••••••••••••
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Authentication
                </p>
                <p className="text-sm font-medium text-green-500">
                  Active Session
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={openModal}
            className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 lg:inline-flex lg:w-auto"
          >
            Change Password
          </button>
        </div>
      </div>

      <EditPasswordModal isOpen={isOpen} onClose={closeModal} />
    </>
  );
}