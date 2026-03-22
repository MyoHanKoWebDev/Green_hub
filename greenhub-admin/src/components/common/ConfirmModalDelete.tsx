import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Modal } from "../ui/modal"; // Use your existing Modal wrapper
import Button  from "../ui/button/Button"; // Use your existing Button component

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  loading?: boolean;
}

export const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Deletion", 
  message = "Are you sure you want to delete this? This action cannot be undone.",
  loading = false 
}: ConfirmModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[400px]">
      <div className="p-6 text-center">
        {/* Warning Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20 mb-4">
          <ExclamationTriangleIcon className="h-10 w-10 text-red-600" />
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
            variant="danger" // Ensure your Button has a red 'danger' style
            className="flex-1 bg-red-600 hover:bg-red-700 text-white" 
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};