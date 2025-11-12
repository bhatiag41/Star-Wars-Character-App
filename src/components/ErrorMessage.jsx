import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <AlertCircle className="w-16 h-16 text-sw-red mb-4" />
      <h3 className="text-xl font-display text-sw-red mb-2">ERROR LOADING DATA</h3>
      <p className="text-sw-light mb-6 text-center max-w-md font-display">{message.toUpperCase()}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-sw-gold text-sw-void font-display font-bold rounded hover:bg-sw-amber hover:shadow-glow-gold transition-all duration-300"
        >
          RETRY
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;

