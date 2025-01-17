import { toast as sonnerToast } from 'sonner';

interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
  variant?: 'default' | 'success' | 'destructive';
}

export const useToast = () => {
  const toast = (options: ToastOptions) => {
    const {
      title,
      description,
      duration = 5000,
      variant = 'default',
    } = options;

    switch (variant) {
      case 'success':
        sonnerToast.success(title, {
          description,
          duration,
        });
        break;
      case 'destructive':
        sonnerToast.error(title, {
          description,
          duration,
        });
        break;
      default:
        sonnerToast(title, {
          description,
          duration,
        });
    }
  };

  return { toast };
};
