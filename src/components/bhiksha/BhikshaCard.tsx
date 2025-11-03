"use client";

import { useState } from "react";
import EditBhikshaForm from "./EditBhikshaForm";

interface BhikshaCardProps {
  bhiksha: any;
  onUpdated: () => void;
}

export default function BhikshaCard({ bhiksha, onUpdated }: BhikshaCardProps) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-center">
        <span className="font-medium text-gray-800 dark:text-gray-200">{bhiksha.name}</span>
        <div className="flex items-center gap-2">
          <span className="text-blue-600 dark:text-blue-400 font-semibold">₹{bhiksha.donated}</span>
          <button
            onClick={() => setEditing(true)}
            className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs"
          >
            Edit
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-500 mt-1">
        Date: {new Date(bhiksha.bhiksha_date).toLocaleDateString()}
      </p>
      {bhiksha.note && <p className="text-sm text-gray-400 italic mt-1">“{bhiksha.note}”</p>}

      {/* Modal for Editing */}
      {editing && (
        <EditBhikshaForm
          bhiksha={bhiksha}
          onSaved={() => {
            setEditing(false);
            onUpdated();
          }}
          onCancel={() => setEditing(false)}
        />
      )}
    </div>
  );
}
