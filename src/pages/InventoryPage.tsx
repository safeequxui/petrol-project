import { StatusBadge } from "@/components/StatusBadge";
import { Plus, Search, AlertTriangle } from "lucide-react";
import { useState } from "react";

const inventory = [
  { id: 1, name: "Cypermethrin 10% EC", branch: "Kochi", stock: 45, unit: "Liters", reorder: 20, status: "OK" },
  { id: 2, name: "Bifenthrin 2.5% SC", branch: "Kochi", stock: 12, unit: "Liters", reorder: 20, status: "Low" },
  { id: 3, name: "Gel Bait (Maxforce)", branch: "Kochi", stock: 8, unit: "Tubes", reorder: 15, status: "Low" },
  { id: 4, name: "Termiticide (Imida)", branch: "Calicut", stock: 32, unit: "Liters", reorder: 10, status: "OK" },
  { id: 5, name: "Rodent Blocks", branch: "Kochi", stock: 5, unit: "Packs", reorder: 10, status: "Critical" },
  { id: 6, name: "Pyrethrin Spray", branch: "Calicut", stock: 28, unit: "Cans", reorder: 10, status: "OK" },
];

const statusMap = { OK: "success", Low: "warning", Critical: "error" } as const;

const InventoryPage = () => {
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const filtered = inventory.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-card-foreground">Inventory</h2>
          <p className="text-sm text-muted-foreground">Branch-wise chemical stock management</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 text-white shadow-[0px_5px_12px_rgba(39,47,158,0.2)] transition-all" style={{ background: "linear-gradient(138.75deg, #942BF4 -42.53%, #1E2F96 94.59%)" }}>
          <Plus className="w-4 h-4" /> Add Inventory
        </button>
      </div>

      {/* Low stock alert */}
      <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
        <p className="text-sm text-card-foreground"><strong>3 items</strong> are below reorder level and need restocking.</p>
      </div>

      {showAdd && (
        <div className="bg-card rounded-xl p-6 card-shadow space-y-4">
          <h3 className="text-sm font-semibold text-card-foreground">Add Inventory Item</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[{ l: "Chemical Name", p: "e.g. Cypermethrin" }, { l: "Branch", p: "e.g. Kochi" }, { l: "Quantity", p: "0" }, { l: "Unit", p: "Liters" }].map((f) => (
              <div key={f.l}>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">{f.l}</label>
                <input className="w-full px-3 py-2 rounded-lg bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder={f.p} />
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button className="h-10 px-6 text-sm font-semibold hover:opacity-90 text-white shadow-[0px_5px_12px_rgba(39,47,158,0.2)] transition-all rounded-lg" style={{ background: "linear-gradient(138.75deg, #942BF4 -42.53%, #1E2F96 94.59%)" }}>Add Item</button>
            <button onClick={() => setShowAdd(false)} className="h-10 px-6 border border-border text-card-foreground text-sm font-medium hover:text-primary transition-colors rounded-lg">Cancel</button>
          </div>
        </div>
      )}

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search chemicals..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-card text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary/20" />
      </div>

      <div className="bg-card rounded-xl card-shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border">
            {["Chemical", "Branch", "Stock", "Unit", "Reorder Level", "Status"].map((h) => (
              <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.map((i) => (
              <tr key={i.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                <td className="px-5 py-3.5 font-medium text-card-foreground">{i.name}</td>
                <td className="px-5 py-3.5 text-muted-foreground">{i.branch}</td>
                <td className={`px-5 py-3.5 font-bold ${i.status === "Critical" ? "text-destructive" : i.status === "Low" ? "text-warning" : "text-card-foreground"}`}>{i.stock}</td>
                <td className="px-5 py-3.5 text-muted-foreground">{i.unit}</td>
                <td className="px-5 py-3.5 text-muted-foreground">{i.reorder}</td>
                <td className="px-5 py-3.5"><StatusBadge label={i.status} variant={statusMap[i.status as keyof typeof statusMap]} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryPage;
