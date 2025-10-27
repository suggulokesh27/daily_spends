"use client";

import { CirclePlus } from "lucide-react";
import { ReactNode, useState } from "react";
import Modal from "../ui/Modal";
import { Authorized } from "@/context/AuthContext";

interface PageHeaderProps {
  title: string;
  addLabel?: string;         // optional text for button
  addIcon?: ReactNode;       // optional custom icon
  modalContent?: ReactNode;  // content to show in modal
  onSaved?: () => void;      // callback when modal form saves
  buttonClassName?: string;  // extra styling for button
}

export default function PageHeader({
  title,
  addLabel = "Add",
  addIcon,
  modalContent,
  onSaved,
  buttonClassName = "",
}: PageHeaderProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex justify-between items-center mb-4">
      {/* Header Title */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>

      {/* Add Button */}
      <Authorized roles={["admin"]}>
      {modalContent && (
        <button
          onClick={() => setShowModal(true)}
          className={`flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition ${buttonClassName}`}
        >
          {addIcon || <CirclePlus className="w-5 h-5" />}
          {addLabel && <span>{addLabel}</span>}
        </button>
      )}
      </Authorized>

      {/* Reusable Modal */}
      {modalContent && (
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
        >
          {modalContent}
        </Modal>
      )}
    </div>
  );
}
