"use client";

import { useEffect, useState } from "react";
import { Users, CreditCard, TrendingUp, IndianRupee } from "lucide-react";
import { memberService } from "@/lib/memberService";
import { expenseService } from "@/lib/expenseService";
import { advanceService } from "@/lib/advanceService";
import StatsCard from "./StatsCard";
import ExpensesSection from "../expenses/ExpensesSection";
import HandoverSection from "../handover/HandoverSection";

export default function DashboardPage() {
  const [totalMembers, setTotalMembers] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalAdvances, setTotalAdvances] = useState(0);
  const [monthlyExpense, setMonthlyExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  const [activeTab, setActiveTab] = useState<"expenses" | "handovers">("expenses");

  useEffect(() => {
    const fetchMetrics = async () => {
      const { data: members } = await memberService.getAll();
      setTotalMembers(members?.length || 0);

      const { data: expenses } = await expenseService.getAll();
      setTotalExpenses(expenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0);

      const { data: advances } = await advanceService.getAll();
      setTotalAdvances(advances?.reduce((sum, a) => sum + Number(a.amount), 0) || 0);
      setBalance(
        (advances?.reduce((sum, a) => sum + Number(a.amount), 0) || 0) -
        (expenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0)
      );
      // Monthly expense (current month)
      const currentMonth = new Date().getMonth();
      const monthly =
        expenses?.filter(
          (e) => new Date(e.expense_date).getMonth() === currentMonth
        ).reduce((sum, e) => sum + Number(e.amount), 0) || 0;
      setMonthlyExpense(monthly);
    };

    fetchMetrics();
  }, []);

  return (
    <div className="p-4 space-y-6 lg:max-w-5xl mx-auto">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Advances"
          value={totalAdvances}
          icon={<CreditCard />}
          bgColor="bg-yellow-600"
          to="/advance"
        />
        <StatsCard
          title="Total Expenses"
          value={totalExpenses}
          icon={<IndianRupee />}
          bgColor="bg-green-600"
          to="/expenses"
        />
        <StatsCard
          title="Balance"
          value={balance}
          icon={<IndianRupee />}
          bgColor="bg-indigo-600"
        />
        <StatsCard
          title="Monthly Expense"
          value={monthlyExpense}
          icon={<TrendingUp />}
          bgColor="bg-red-600"
        />
        <StatsCard
          title="Members"
          value={totalMembers}
          icon={<Users />}
          bgColor="bg-blue-600"
          to="/members"
        />
      </div>

      {/* Tabs */}
      <div className="mt-6">
        <div className="flex border-b border-gray-300 dark:border-gray-700 mb-4">
          <button
            onClick={() => setActiveTab("expenses")}
            className={`px-4 py-2 text-sm font-medium rounded-t-md transition-all ${
              activeTab === "expenses"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => setActiveTab("handovers")}
            className={`ml-2 px-4 py-2 text-sm font-medium rounded-t-md transition-all ${
              activeTab === "handovers"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            }`}
          >
            Handovers
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === "expenses" && <ExpensesSection />}
          {activeTab === "handovers" && <HandoverSection />}
        </div>
      </div>
    </div>
  );
}
