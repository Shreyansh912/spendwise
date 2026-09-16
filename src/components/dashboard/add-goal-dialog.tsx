"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function AddGoalDialog({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !targetAmount) return;
    setSubmitting(true);

    const { error } = await supabase.from("savings_goals").insert({
      user_id: userId,
      title,
      target_amount: parseFloat(targetAmount),
      current_amount: currentAmount ? parseFloat(currentAmount) : 0,
    });

    setSubmitting(false);

    if (!error) {
      setTitle("");
      setTargetAmount("");
      setCurrentAmount("");
      setOpen(false);
      router.refresh();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer">
        <Plus className="h-3.5 w-3.5" /> Add
      </DialogTrigger>

      <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-md p-6 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-white">
            Create Savings Milestone
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-1.5">
              Goal Name
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Tech Gear, Hackathon Trip, Courses"
              className="bg-slate-950 border-slate-800 text-slate-100 text-sm h-10 px-3 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 block mb-1.5">
              Target Amount (₹)
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
              Initial Amount Saved (₹)
            </label>
            <Input
              type="number"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
              placeholder="0"
              className="bg-slate-950 border-slate-800 text-slate-100 text-sm h-10 px-3 rounded-lg"
            />
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm h-11 rounded-xl transition-all mt-2 cursor-pointer"
          >
            {submitting ? "Saving Goal..." : "Create Milestone"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}