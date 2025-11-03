"use client";

import { CirclePlus } from "lucide-react";
import { ReactNode, useState } from "react";
import Modal from "../ui/Modal";
import { Authorized } from "@/context/AuthContext";
import FilterButton from "./FilterButton";

interface PageHeaderProps {
  title: string;
  addLabel?: string;
  addIcon?: ReactNode;
  modalContent?: ReactNode;
  onSaved?: () => void;
  buttonClassName?: string;
  handleFilter?: (filters: any) => void;
  isFilterable?: boolean;
  children?: ReactNode; // 👈 Add this to allow search or custom controls
}

export default function PageHeader({
  title,
  addLabel = "Add",
  addIcon,
  modalContent,
  buttonClassName = "",
  handleFilter,
  isFilterable = false,
  children,
}: PageHeaderProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {title}
      </h2>

      <div className="flex items-center gap-3 flex-wrap">
        {children}
        {isFilterable && <FilterButton onApply={handleFilter} />}
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
      </div>

      {modalContent && (
        <Modal show={showModal} onClose={() => setShowModal(false)}>
          {modalContent}
        </Modal>
      )}
    </div>
  );
}
