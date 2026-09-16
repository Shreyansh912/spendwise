import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Wallet, TrendingUp, TrendingDown, PiggyBank, Activity } from "lucide-react";

import { BudgetOverview } from "@/components/dashboard/budget-overview";
import { SavingsCard } from "@/components/dashboard/savings-card";
import { CategoryBreakdown } from "@/components/dashboard/category-breakdown";
import { AddTransactionDialog } from "@/components/dashboard/add-transaction-dialog";
import { AiAdvisor } from "@/components/dashboard/ai-advisor";
import { TransactionRow } from "@/components/dashboard/transaction-row";
import { ExportCsvButton } from "@/components/dashboard/export-csv-button";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 1. Fetch transactions
  const { data: allTransactions } = await supabase
    .from("transactions")
    .select("amount, type, category")
    .eq("user_id", user.id);

  const totalIncome = (allTransactions || [])
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalExpense = (allTransactions || [])
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const netBalance = totalIncome - totalExpense;

  // 2. Fetch recent ledger entries
  const { data: recentTransactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("transaction_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(20);

  // 3. Fetch monthly budget & savings goals
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthName = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const { data: budgetData } = await supabase
    .from("budgets")
    .select("total_budget")
    .eq("user_id", user.id)
    .eq("month", currentMonth)
    .maybeSingle();

  const { data: savingsGoals } = await supabase
    .from("savings_goals")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const activeMonthlyBudget = budgetData?.total_budget
    ? Number(budgetData.total_budget)
    : 10000;

  return (
    <div className="min-h-screen pb-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-10 pt-8">
      {/* Top Banner Navigation Header */}
      <header className="glass-card rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800/80">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Activity className="h-3.5 w-3.5 animate-pulse" /> Live Terminal
            </span>
            <span className="text-sm font-medium text-slate-400">
              {currentMonthName}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Campus Financial Command
          </h1>
          <p className="text-base text-slate-300">
            Account: <span className="font-semibold text-emerald-400">{user.email}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <AddTransactionDialog userId={user.id} />
        </div>
      </header>

      {/* Top Level Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card rounded-2xl border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold tracking-wide text-slate-400">
              Available Balance
            </CardTitle>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Wallet className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-white">
              ₹{netBalance.toLocaleString("en-IN")}
            </div>
            <p className="text-sm text-slate-400 mt-2">Active cash & allowance reserve</p>
          </CardContent>
        </Card>

        <Card className="glass-card rounded-2xl border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold tracking-wide text-slate-400">
              Total Inflow
            </CardTitle>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-emerald-400">
              +₹{totalIncome.toLocaleString("en-IN")}
            </div>
            <p className="text-sm text-slate-400 mt-2">Allowances, UPI & deposits</p>
          </CardContent>
        </Card>

        <Card className="glass-card rounded-2xl border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold tracking-wide text-slate-400">
              Total Spent
            </CardTitle>
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400">
              <TrendingDown className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-rose-400">
              -₹{totalExpense.toLocaleString("en-IN")}
            </div>
            <p className="text-sm text-slate-400 mt-2">Mess bills, canteen & outings</p>
          </CardContent>
        </Card>

        <Card className="glass-card rounded-2xl border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold tracking-wide text-slate-400">
              Semester Goals
            </CardTitle>
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400">
              <PiggyBank className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-white">
              {savingsGoals ? savingsGoals.length : 0} <span className="text-lg font-normal text-slate-400">Active</span>
            </div>
            <p className="text-sm text-slate-400 mt-2">Hardware & travel milestones</p>
          </CardContent>
        </Card>
      </section>

      {/* Analytics & Budget Breakdown */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <BudgetOverview
          totalBudget={activeMonthlyBudget}
          totalSpent={totalExpense}
          monthName={currentMonthName}
          userId={user.id}
          currentMonth={currentMonth}
        />
        <CategoryBreakdown transactions={allTransactions || []} />
        <SavingsCard goals={savingsGoals || []} userId={user.id} />
      </section>

      {/* Transaction Ledger with CSV Export & Row-level Delete */}
      <Card className="glass-card rounded-2xl border-none p-6">
        <CardHeader className="p-0 pb-6 border-b border-slate-800/80 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-white">
              Recent Campus Transactions
            </CardTitle>
            <p className="text-sm text-slate-400 mt-1">Audit log of your recent receipts and allowances</p>
          </div>
          <div className="flex items-center gap-3">
            <ExportCsvButton
              transactions={recentTransactions || []}
              monthName={currentMonthName}
            />
            <span className="text-xs px-3 py-1 bg-slate-800/80 text-slate-300 rounded-full font-medium">
              {recentTransactions?.length || 0} Records
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          {!recentTransactions || recentTransactions.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-base">
              No transactions logged this month yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-800/60">
              {recentTransactions.map((tx) => (
                <TransactionRow key={tx.id} tx={tx} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gemini AI Floating Assistant */}
      <AiAdvisor />
    </div>
  );
}