"use client";

import { Download } from "lucide-react";

interface Transaction {
  description: string;
  amount: number;
  type: string;
  category: string;
  payment_method: string;
  transaction_date: string;
}

export function ExportCsvButton({
  transactions,
  monthName,
}: {
  transactions: Transaction[];
  monthName: string;
}) {
  function downloadCSV() {
    if (!transactions.length) return;

    const headers = ["Date", "Description", "Type", "Category", "Payment Method", "Amount (INR)"];
    const rows = transactions.map((t) => [
      `"${t.transaction_date}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${t.type}"`,
      `"${t.category}"`,
      `"${t.payment_method}"`,
      t.amount,
    ]);

    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.setAttribute("href", url);
    link.setAttribute("download", `SpendWise_Report_${monthName.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <button
      onClick={downloadCSV}
      disabled={transactions.length === 0}
      className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-slate-700/60"
    >
      <Download className="h-3.5 w-3.5" /> Export CSV
    </button>
  );
}