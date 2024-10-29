declare module 'react-toastify' {
    export const ToastContainer: React.FC;
    export const toast: {
      (message: string, options?: any): void;
      success: (message: string, options?: any) => void;
      error: (message: string, options?: any) => void;
      info: (message: string, options?: any) => void;
      warning: (message: string, options?: any) => void;
    };
  }