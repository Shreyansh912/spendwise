"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface BudgetOverviewProps {
  totalBudget: number;
  totalSpent: number;
  monthName: string;
  userId: string;
  currentMonth: string;
}

export function BudgetOverview({
  totalBudget: initialBudget,
  totalSpent,
  monthName,
  userId,
  currentMonth,
}: BudgetOverviewProps) {
  const [budget, setBudget] = useState(initialBudget);
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(initialBudget.toString());
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const percentage = Math.min(Math.round((totalSpent / (budget || 1)) * 100), 100);
  const isOverBudget = totalSpent > budget;

  async function handleSaveBudget() {
    const parsed = parseFloat(newBudget);
    if (isNaN(parsed) || parsed <= 0) return;
    setSaving(true);

    const { error } = await supabase.from("budgets").upsert(
      {
        user_id: userId,
        month: currentMonth,
        total_budget: parsed,
      },
      { onConflict: "user_id,month" }
    );

    setSaving(false);
    if (!error) {
      setBudget(parsed);
      setIsEditing(false);
      router.refresh();
    }
  }

  return (
    <Card className="glass-card rounded-2xl border-none p-6 flex flex-col justify-between">
      <CardHeader className="p-0 pb-4 border-b border-slate-800/80 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold text-white">
          Monthly Burn Rate ({monthName})
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setIsEditing(!isEditing);
            setNewBudget(budget.toString());
          }}
          className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors h-7 px-2.5 rounded-lg cursor-pointer"
        >
          {isEditing ? "Cancel" : "Adjust"}
        </Button>
      </CardHeader>

      <CardContent className="p-0 pt-6 space-y-4">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
              className="bg-slate-950 border-slate-800 text-slate-100 text-sm h-10 px-3 rounded-xl focus:border-emerald-500"
              placeholder="Enter monthly allowance"
            />
            <Button
              size="sm"
              disabled={saving}
              onClick={handleSaveBudget}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs h-10 px-4 rounded-xl cursor-pointer"
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        ) : (
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">
              ₹{totalSpent.toLocaleString("en-IN")}
            </span>
            <span className="text-sm font-medium text-slate-400">
              Limit: ₹{budget.toLocaleString("en-IN")}
            </span>
          </div>
        )}

        {/* Visual Burn Meter */}
        <div className="space-y-2">
          <div className="w-full bg-slate-800/90 h-3 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isOverBudget
                  ? "bg-rose-500"
                  : percentage > 80
                  ? "bg-amber-400"
                  : "bg-emerald-400"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400 font-medium">
            <span>{percentage}% allowance utilized</span>
            {isOverBudget && <span className="text-rose-400 font-bold">Over limit!</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}