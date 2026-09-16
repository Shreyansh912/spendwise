"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Target } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface SavingsGoal {
  id: string;
  title: string;
  target_amount: number;
  current_amount: number;
}

export function SavingsCard({
  goals: initialGoals,
  userId,
}: {
  goals: SavingsGoal[];
  userId: string;
}) {
  const [goals, setGoals] = useState(initialGoals);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleAddGoal(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !targetAmount) return;
    setSubmitting(true);

    const target = parseFloat(targetAmount);
    const initial = parseFloat(currentAmount) || 0;

    const { data, error } = await supabase
      .from("savings_goals")
      .insert({
        user_id: userId,
        title,
        target_amount: target,
        current_amount: initial,
      })
      .select()
      .single();

    setSubmitting(false);

    if (!error && data) {
      setGoals([data, ...goals]);
      setTitle("");
      setTargetAmount("");
      setCurrentAmount("");
      setOpen(false);
      router.refresh();
    }
  }

  return (
    <Card className="glass-card rounded-2xl border-none p-6 flex flex-col justify-between">
      <CardHeader className="p-0 pb-4 border-b border-slate-800/80 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold text-white">
          Semester Savings Targets
        </CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 h-7 px-2.5 rounded-lg transition-colors cursor-pointer">
            <Plus className="h-3.5 w-3.5" /> Add
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-md p-6 rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-white">
                New Savings Goal
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddGoal} className="space-y-4 pt-2">
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1.5">
                  Target Name
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Semester Trip, Tech Fund"
                  className="bg-slate-950 border-slate-800 text-slate-100 text-sm h-10 px-3 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1.5">
                  Goal Amount (₹)
                </label>
                <Input
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="5000"
                  className="bg-slate-950 border-slate-800 text-slate-100 text-sm h-10 px-3 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1.5">
                  Current Saved (₹)
                </label>
                <Input
                  type="number"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                  placeholder="1000"
                  className="bg-slate-950 border-slate-800 text-slate-100 text-sm h-10 px-3 rounded-lg"
                />
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm h-11 rounded-xl transition-all mt-2 cursor-pointer"
              >
                {submitting ? "Saving..." : "Create Target"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="p-0 pt-6 space-y-4 flex-1">
        {goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-36 text-center space-y-2">
            <Target className="h-8 w-8 text-slate-600 stroke-[1.5]" />
            <p className="text-sm text-slate-400">No active targets set.</p>
          </div>
        ) : (
          goals.slice(0, 3).map((goal) => {
            const pct = Math.min(
              Math.round(((goal.current_amount || 0) / (goal.target_amount || 1)) * 100),
              100
            );
            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-200 font-semibold">{goal.title}</span>
                  <span className="text-slate-400 font-medium">
                    ₹{Number(goal.current_amount).toLocaleString("en-IN")} / ₹
                    {Number(goal.target_amount).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="w-full bg-slate-800/90 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="text-right text-xs text-emerald-400 font-semibold">
                  {pct}% Completed
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}