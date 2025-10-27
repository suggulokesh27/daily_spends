"use client";

import { ReactNode } from "react";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ show, onClose, children }: ModalProps) {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50
                 bg-gray-400/50 bg-opacity-50 transition-opacity duration-300 ease-out animate-fadeIn"
    >
      <div
        className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg w-full max-w-md relative
                   transform transition-transform duration-300 ease-out scale-90 animate-scaleIn"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 font-bold"
        >
          ✕
        </button>

        {/* Modal Content */}
        {children}
      </div>
    </div>
  );
}
