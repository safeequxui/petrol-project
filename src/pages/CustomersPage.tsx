import { Search, ChevronRight } from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";

const customers = [
  { id: 1, name: "Praveen Kumar", phone: "9876543210", address: "12 MG Road, Kochi", projects: 2, total: "₹ 4,200", paid: "₹ 3,350", balance: "₹ 850" },
  { id: 2, name: "Hotel Grand", phone: "9876543220", address: "Beach Road, Calicut", projects: 1, total: "₹ 12,500", paid: "₹ 12,500", balance: "₹ 0" },
  { id: 3, name: "Ramesh Singh", phone: "9876543230", address: "NH Bypass, Thrissur", projects: 1, total: "₹ 850", paid: "₹ 700", balance: "₹ 150" },
  { id: 4, name: "Lakshmi Stores", phone: "9876543240", address: "Market Road, Ernakulam", projects: 3, total: "₹ 6,800", paid: "₹ 5,600", balance: "₹ 1,200" },
  { id: 5, name: "Suresh Nair", phone: "9876543250", address: "Hill View, Munnar", projects: 1, total: "₹ 1,800", paid: "₹ 1,350", balance: "₹ 450" },
  { id: 6, name: "Meena Devi", phone: "9876543260", address: "Lake Road, Alleppey", projects: 1, total: "₹ 650", paid: "₹ 650", balance: "₹ 0" },
];

const CustomersPage = () => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const filtered = customers.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
  const detail = customers.find((c) => c.id === selected);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-card-foreground">Customers</h2>
        <p className="text-sm text-muted-foreground">Customer profiles and payment history</p>
      </div>
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-card text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-xl card-shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border">
              {["Customer", "Phone", "Projects", "Total", "Balance", ""].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} onClick={() => setSelected(c.id)} className={`border-b border-border last:border-0 cursor-pointer transition-colors ${selected === c.id ? "bg-secondary/50" : "hover:bg-secondary/30"}`}>
                  <td className="px-5 py-3.5 font-medium text-card-foreground">{c.name}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{c.phone}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{c.projects}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{c.total}</td>
                  <td className="px-5 py-3.5">{c.balance === "₹ 0" ? <StatusBadge label="Cleared" variant="success" /> : <span className="font-semibold text-destructive">{c.balance}</span>}</td>
                  <td className="px-5 py-3.5"><ChevronRight className="w-4 h-4 text-muted-foreground" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-card rounded-xl p-6 card-shadow">
          {detail ? (
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
                <span className="text-xl font-bold text-primary">{detail.name[0]}</span>
              </div>
              <div>
                <h3 className="font-bold text-lg text-card-foreground">{detail.name}</h3>
                <p className="text-sm text-muted-foreground">{detail.phone}</p>
                <p className="text-sm text-muted-foreground">{detail.address}</p>
              </div>
              <div className="border-t border-border pt-4 space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Payment Ledger</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total Billed</span><span className="font-semibold text-card-foreground">{detail.total}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Paid</span><span className="font-semibold text-success">{detail.paid}</span></div>
                  <div className="flex justify-between text-sm border-t border-border pt-2"><span className="font-semibold text-card-foreground">Pending</span><span className="font-bold text-destructive">{detail.balance}</span></div>
                </div>
              </div>
              <div className="border-t border-border pt-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Projects ({detail.projects})</h4>
                <p className="text-sm text-muted-foreground">View all projects for this customer in the Projects tab.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">Select a customer to view details</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;
