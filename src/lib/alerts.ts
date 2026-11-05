import { toast } from "sonner";
import Swal from "sweetalert2";

// Export standard Shadcn toast
export { toast };

/**
 * Shadcn-based Toast Notifications with explicit cross button and rich colors
 */
export const showSuccessToast = (title: string, message?: string) => {
  return toast.success(title, {
    description: message,
    closeButton: true,
  });
};

export const showErrorToast = (title: string, message?: string) => {
  return toast.error(title, {
    description: message,
    closeButton: true,
  });
};

export const showWarningToast = (title: string, message?: string) => {
  return toast.warning(title, {
    description: message,
    closeButton: true,
  });
};

export const showInfoToast = (title: string, message?: string) => {
  return toast.info(title, {
    description: message,
    closeButton: true,
  });
};

/**
 * Styled Modal for critical confirmations (Delete Event, Cancel Join)
 */
export const confirmAction = async (options: {
  title: string;
  text?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  icon?: "warning" | "question" | "info";
}): Promise<boolean> => {
  const result = await Swal.fire({
    title: options.title,
    text: options.text || "This action cannot be undone.",
    icon: options.icon || "warning",
    showCancelButton: true,
    confirmButtonText: options.confirmButtonText || "Yes, proceed",
    cancelButtonText: options.cancelButtonText || "Cancel",
    confirmButtonColor: "#059669", // Emerald
    cancelButtonColor: "#64748B", // Slate
    reverseButtons: true,
    customClass: {
      popup: "rounded-3xl border border-border bg-card shadow-2xl p-6",
      title: "text-lg font-bold text-foreground",
      htmlContainer: "text-sm text-muted-foreground",
      confirmButton: "px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md",
      cancelButton: "px-5 py-2.5 rounded-xl text-sm font-semibold",
    },
  });

  return result.isConfirmed;
};
