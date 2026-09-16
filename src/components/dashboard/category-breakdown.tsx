"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Transaction {
  amount: number;
  type: string;
  category: string;
}

export function CategoryBreakdown({ transactions }: { transactions: Transaction[] }) {
  const expenseTransactions = transactions.filter((t) => t.type === "expense");
  const totalExpense = expenseTransactions.reduce((acc, t) => acc + Number(t.amount), 0) || 1;

  const categoryTotals = expenseTransactions.reduce((acc: Record<string, number>, t) => {
    acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
    return acc;
  }, {});

  const sortedCategories = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: Math.round((amount / totalExpense) * 100),
    }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <Card className="border-slate-800 bg-slate-900/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-slate-200">
          Campus Outflow by Category
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedCategories.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">
            No expenses recorded this cycle.
          </p>
        ) : (
          sortedCategories.slice(0, 4).map((item) => (
            <div key={item.category} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">{item.category}</span>
                <span className="text-slate-400">
                  ₹{item.amount.toLocaleString("en-IN")} ({item.percentage}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-sky-400 h-full rounded-full"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}