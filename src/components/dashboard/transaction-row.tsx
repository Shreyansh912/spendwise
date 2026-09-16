"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: string;
  category: string;
  payment_method: string;
  transaction_date: string;
}

export function TransactionRow({ tx }: { tx: Transaction }) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleDelete() {
    if (!confirm(`Delete "${tx.description}"?`)) return;
    setDeleting(true);

    const { error } = await supabase.from("transactions").delete().eq("id", tx.id);
    setDeleting(false);

    if (!error) {
      router.refresh();
    }
  }

  return (
    <div className="py-4 flex items-center justify-between hover:bg-slate-800/30 px-3 rounded-xl transition-colors group">
      <div className="space-y-1">
        <p className="font-semibold text-base text-slate-100">{tx.description}</p>
        <p className="text-xs text-slate-400">
          {tx.category} • <span className="text-slate-300">{tx.payment_method}</span> • {tx.transaction_date}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <span
          className={`text-base sm:text-lg font-bold ${
            tx.type === "income" ? "text-emerald-400" : "text-slate-200"
          }`}
        >
          {tx.type === "income" ? "+" : "-"}₹{Number(tx.amount).toLocaleString("en-IN")}
        </span>

        <button
          onClick={handleDelete}
          disabled={deleting}
          title="Delete record"
          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-all cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}