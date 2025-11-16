"use client";

import { Authorized } from "@/context/AuthContext";

export default function MemberView({
  member,
  joinedDate,
  leavingDate,
  periods,
  showHistory,
  setShowHistory,
  handleLeaving,
  handleRejoin,
  setIsEditing,
  loading,
}: any) {
  return (
    <>
    <div className="flex justify-between">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{member.name}</h3>
    <p className={`p-1 ${member?.latest_advance_amount === 0 ? "bg-red-400" : "bg-green-400"} bg-green-400 rounded-xl`}>₹{member?.latest_advance_amount || 0}</p>
    </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{member.phone}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Joined: {member?.joined_date ? new Date(member?.joined_date).toLocaleDateString() : "-"}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Leaving: {member?.leaving_date ? new Date(member?.leaving_date).toLocaleDateString() : "-"}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Active Days: {member.days_active || 0}
      </p>

      <div className="flex justify-end gap-3 mt-2">
        <button onClick={() => setIsEditing(true)} className="text-blue-600 hover:text-blue-800">
          Edit
        </button>

        <Authorized roles={["admin"]}>
          {!member.leaving_date ? (
            <button
              onClick={handleLeaving}
              disabled={loading}
              className="text-red-600 hover:text-red-800"
            >
              {loading ? "Processing..." : "Leave"}
            </button>
          ) : (
            <button
              onClick={handleRejoin}
              disabled={loading}
              className="text-green-600 hover:text-green-800"
            >
              {loading ? "Processing..." : "Rejoin"}
            </button>
          )}
        </Authorized>

        {member.days_active > 0 && (
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-gray-700 dark:text-gray-300 hover:underline"
          >
            {showHistory ? "Hide History" : "View History"}
          </button>
        )}
      </div>

      {showHistory && periods?.length > 0 && (
        <div className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-2">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Period History</h4>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {periods.map((p: any, idx: number) => (
              <div
                key={p.id || idx}
                className="flex justify-between border-b border-gray-100 dark:border-gray-700 py-1"
              >
                <span>
                  {new Date(p.joined_date).toLocaleDateString()} →{" "}
                  {p.leaving_date
                    ? new Date(p.leaving_date).toLocaleDateString()
                    : "Active"}
                </span>
                <span className="italic">
                  {p.leaving_date
                    ? Math.floor(
                        (new Date(p.leaving_date).getTime() -
                          new Date(p.joined_date).getTime()) /
                          (1000 * 60 * 60 * 24)
                      ) + 1 + " days"
                    : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
