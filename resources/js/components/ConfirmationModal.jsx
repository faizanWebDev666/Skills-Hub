import React from 'react';

export default function ConfirmationModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmText = 'Confirm', 
    cancelText = 'Cancel',
    icon: Icon,
    intent = 'primary' // 'primary', 'danger', 'success'
}) {
    if (!isOpen) return null;

    const colors = {
        primary: {
            iconBg: 'bg-brand-100',
            iconText: 'text-brand-600',
            buttonBg: 'bg-brand-600 hover:bg-brand-700',
            buttonShadow: 'shadow-brand-500/30'
        },
        danger: {
            iconBg: 'bg-danger-100',
            iconText: 'text-danger-600',
            buttonBg: 'bg-danger-600 hover:bg-danger-700',
            buttonShadow: 'shadow-danger-500/30'
        },
        success: {
            iconBg: 'bg-success-100',
            iconText: 'text-success-600',
            buttonBg: 'bg-success-600 hover:bg-success-700',
            buttonShadow: 'shadow-success-500/30'
        }
    };

    const theme = colors[intent] || colors.primary;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 transform transition-all">
                {Icon && (
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto ${theme.iconBg} ${theme.iconText}`}>
                        <Icon className="w-8 h-8" />
                    </div>
                )}
                
                <div className="mb-8 text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {title}
                    </h3>
                    <div className="text-gray-500 text-sm sm:text-base">
                        {message}
                    </div>
                </div>

                <div className="flex gap-3 sm:gap-4 flex-col sm:flex-row">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors order-2 sm:order-1"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 px-6 py-3 text-sm font-bold text-white rounded-xl transition-colors shadow-lg order-1 sm:order-2 ${theme.buttonBg} ${theme.buttonShadow}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
