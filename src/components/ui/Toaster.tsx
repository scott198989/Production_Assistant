import { Toaster as SonnerToaster, toast } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "group toast flex items-center gap-3 w-full rounded-xl p-4 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 shadow-xl",
          title: "text-slate-100 font-medium",
          description: "text-slate-400 text-sm",
          actionButton: "bg-primary text-white text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-primary-hover transition-colors",
          cancelButton: "bg-slate-700 text-slate-300 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-slate-600 transition-colors",
          success: "!border-green-500/30 [&>svg]:text-green-400",
          error: "!border-red-500/30 [&>svg]:text-red-400",
          warning: "!border-yellow-500/30 [&>svg]:text-yellow-400",
          info: "!border-blue-500/30 [&>svg]:text-blue-400",
        },
      }}
      closeButton
      richColors
      expand
    />
  );
}

// Export toast utility for easy use
export { toast };

// Convenience wrappers with custom styling
export const showToast = {
  success: (message: string, description?: string) => {
    toast.success(message, { description });
  },
  error: (message: string, description?: string) => {
    toast.error(message, { description });
  },
  warning: (message: string, description?: string) => {
    toast.warning(message, { description });
  },
  info: (message: string, description?: string) => {
    toast.info(message, { description });
  },
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, messages);
  },
};

export default Toaster;
