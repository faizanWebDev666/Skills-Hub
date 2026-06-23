import React from "react";

export default function Modal({
    isOpen,
    onClose,
    title,
    message,
    type = "info",
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    showCancel = true,
    isProcessing = false,
}) {
    if (!isOpen) return null;

    const typeStyles = {
        success: "text-success-700",
        error: "text-rose-600",
        warning: "text-yellow-700",
        info: "text-brand-700",
    };

    const confirmButtonStyles = {
        success: "bg-success-600 hover:bg-success-700",
        error: "bg-rose-600 hover:bg-rose-700",
        warning: "bg-yellow-600 hover:bg-yellow-700",
        info: "bg-brand-600 hover:bg-brand-700",
    };

    return (
        <div className="fixed inset-0 z-50 grid place-items-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-lg w-11/12 max-w-md p-6">
                {title && (
                    <h3 className={`text-lg font-semibold ${typeStyles[type]}`}>
                        {title}
                    </h3>
                )}
                <p className="mt-2 text-sm text-gray-700">{message}</p>
                <div className="mt-6 flex justify-end gap-3">
                    {showCancel && (
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                            disabled={isProcessing}
                        >
                            {cancelText}
                        </button>
                    )}
                    {onConfirm && (
                        <button
                            onClick={onConfirm}
                            disabled={isProcessing}
                            className={`px-4 py-2 rounded-xl text-white font-semibold transition-colors ${confirmButtonStyles[type]} disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isProcessing ? "Processing..." : confirmText}
                        </button>
                    )}
                    {!onConfirm && !showCancel && (
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                            Close
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
