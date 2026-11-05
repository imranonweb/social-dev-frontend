import Swal, { SweetAlertOptions } from "sweetalert2";

// Clean styled Toast for notifications
export const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3500,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
  customClass: {
    popup: "colored-toast shadow-lg rounded-xl border text-sm font-medium",
  },
});

export const showSuccessToast = (title: string, message?: string) => {
  return Toast.fire({
    icon: "success",
    title,
    text: message,
  });
};

export const showErrorToast = (title: string, message?: string) => {
  return Toast.fire({
    icon: "error",
    title,
    text: message,
  });
};

export const showWarningToast = (title: string, message?: string) => {
  return Toast.fire({
    icon: "warning",
    title,
    text: message,
  });
};

export const showInfoToast = (title: string, message?: string) => {
  return Toast.fire({
    icon: "info",
    title,
    text: message,
  });
};

// Confirmation modal for critical actions (Delete Event, Cancel Join)
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
      popup: "rounded-2xl border shadow-2xl p-6",
      title: "text-lg font-bold",
      confirmButton: "px-5 py-2.5 rounded-lg text-sm font-semibold",
      cancelButton: "px-5 py-2.5 rounded-lg text-sm font-semibold",
    },
  });

  return result.isConfirmed;
};

