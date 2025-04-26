import React from "react";

interface AlertModalProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ type, message, onClose }) => {
  const isSuccess = type === "success";

  const icon = isSuccess ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6 text-green-600"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6 text-red-600"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex justify-center mt-4"
      data-testid="alert-modal"
    >
      <div className="rounded-md border border-gray-300 bg-white p-4 shadow-sm w-full max-w-md mx-auto">
        <div className="flex items-start gap-4">
          {icon}
          <div className="flex-1">
            <strong className="font-medium text-gray-900">
              {isSuccess ? "Success" : "Error"}
            </strong>
            <p
              className="mt-0.5 text-sm text-gray-700"
              data-testid="alert-message"
            >
              {message}
            </p>
          </div>
          <button
            className="-m-3 rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
            type="button"
            aria-label="Dismiss alert"
            onClick={onClose}
          >
            <span className="sr-only">Dismiss popup</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
