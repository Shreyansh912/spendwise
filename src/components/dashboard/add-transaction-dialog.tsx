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
import { Plus, Camera, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function AddTransactionDialog({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"expense" | "income">("expense");
  const [category, setCategory] = useState("Canteen / Mess");
  const [submitting, setSubmitting] = useState(false);
  const [scanning, setScanning] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const categories = [
    "Canteen / Mess",
    "Academics / Books",
    "Outings & Travel",
    "Hostel Supplies",
    "Allowance / Stipend",
    "Other",
  ];

  async function handleScanReceipt(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanning(true);
    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        const base64 = (reader.result as string).split(",")[1];
        const res = await fetch("/api/scan-receipt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64 }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.description) setDescription(data.description);
          if (data.amount) setAmount(data.amount.toString());
          if (data.category && categories.includes(data.category)) {
            setCategory(data.category);
          }
          setType("expense");
        }
      } catch (err) {
        console.error("Scan failed", err);
      } finally {
        setScanning(false);
      }
    };

    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description || !amount) return;
    setSubmitting(true);

    const { error } = await supabase.from("transactions").insert({
      user_id: userId,
      description,
      amount: parseFloat(amount),
      type,
      category,
      payment_method: "UPI",
      transaction_date: new Date().toISOString().split("T")[0],
    });

    setSubmitting(false);

    if (!error) {
      setDescription("");
      setAmount("");
      setType("expense");
      setCategory("Canteen / Mess");
      setOpen(false);
      router.refresh();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] cursor-pointer">
        <Plus className="h-4 w-4 stroke-[3]" /> Log Expense / Allowance
      </DialogTrigger>

      <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-md p-6 rounded-2xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-bold text-white">
            Log Transaction
          </DialogTitle>

          <label className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 rounded-lg cursor-pointer transition-colors">
            {scanning ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Scanning...
              </>
            ) : (
              <>
                <Camera className="h-3.5 w-3.5" /> Scan Bill
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleScanReceipt}
              disabled={scanning}
            />
          </label>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setType("expense")}
              className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                type === "expense"
                  ? "bg-rose-500/20 border-rose-500/60 text-rose-300 shadow-sm"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType("income")}
              className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                type === "income"
                  ? "bg-emerald-500/20 border-emerald-500/60 text-emerald-300 shadow-sm"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              Allowance / Inflow
            </button>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 block mb-1.5">
              Description
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Canteen, Books, Recharges"
              className="bg-slate-950 border-slate-800 text-slate-100 text-sm h-10 px-3 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 block mb-1.5">
              Amount (₹)
            </label>
            <Input
              type="number"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="150"
              className="bg-slate-950 border-slate-800 text-slate-100 text-sm h-10 px-3 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 block mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg text-sm h-10 px-3 text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <Button
            type="submit"
            disabled={submitting || scanning}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm h-11 rounded-xl transition-all mt-2 cursor-pointer"
          >
            {submitting ? "Saving Transaction..." : "Save Record"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}