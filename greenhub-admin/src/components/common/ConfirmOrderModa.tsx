import { 
  ExclamationTriangleIcon, 
  CheckCircleIcon, 
  XCircleIcon 
} from "@heroicons/react/24/outline";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  loading?: boolean;
  variant?: "confirm" | "reject" | "danger"; // Added variants
}

export const ConfirmOrderModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  loading = false,
  variant = "confirm" 
}: ConfirmModalProps) => {

  // Configuration mapping based on variant
  const config = {
    confirm: {
      icon: <CheckCircleIcon className="h-10 w-10 text-emerald-600" />,
      iconBg: "bg-emerald-50 dark:bg-emerald-900/20",
      btnClass: "bg-emerald-600 hover:bg-emerald-700 text-white",
      btnText: loading ? "Confirming..." : "Confirm Order",
    },
    reject: {
      icon: <XCircleIcon className="h-10 w-10 text-rose-600" />,
      iconBg: "bg-rose-50 dark:bg-rose-900/20",
      btnClass: "bg-rose-600 hover:bg-rose-700 text-white",
      btnText: loading ? "Rejecting..." : "Reject Order",
    },
    danger: {
      icon: <ExclamationTriangleIcon className="h-10 w-10 text-red-600" />,
      iconBg: "bg-red-50 dark:bg-red-900/20",
      btnClass: "bg-red-600 hover:bg-red-700 text-white",
      btnText: loading ? "Deleting..." : "Delete",
    }
  };

  const current = config[variant];

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[400px]">
      <div className="p-6 text-center">
        {/* Dynamic Icon */}
        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full mb-4 ${current.iconBg}`}>
          {current.icon}
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {message}
        </p>

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            className={`flex-1 ${current.btnClass}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {current.btnText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};