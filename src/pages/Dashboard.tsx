import { KPICard } from "@/components/KPICard";
import { StatusBadge } from "@/components/StatusBadge";
import { FolderKanban, CreditCard, Wallet, AlertTriangle, Plus, Wrench, Eye, Package, Filter, Calendar, ChevronDown, X, Search } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const revenueData = [
  { day: "Mon", expected: 4200, collected: 3800 },
  { day: "Tue", expected: 3800, collected: 3600 },
  { day: "Wed", expected: 5100, collected: 4200 },
  { day: "Thu", expected: 4500, collected: 4500 },
  { day: "Fri", expected: 4800, collected: 3200 },
  { day: "Sat", expected: 3200, collected: 2800 },
  { day: "Sun", expected: 1500, collected: 1200 },
];

const taskData = [
  { name: "Completed", value: 20, color: "hsl(142, 72%, 40%)" },
  { name: "Upcoming", value: 8, color: "hsl(236, 60%, 39%)" },
  { name: "Overdue", value: 5, color: "hsl(0, 72%, 51%)" },
];

const inventoryData = [
  { name: "Cypermethrin", stock: 45, reorder: 20 },
  { name: "Bifenthrin", stock: 12, reorder: 20 },
  { name: "Gel Bait", stock: 8, reorder: 15 },
  { name: "Termiticide", stock: 32, reorder: 10 },
  { name: "Rodent Blocks", stock: 5, reorder: 10 },
];

const serviceData = [
  { day: "Mon", scheduled: 8, completed: 7 },
  { day: "Tue", scheduled: 6, completed: 6 },
  { day: "Wed", scheduled: 10, completed: 8 },
  { day: "Thu", scheduled: 7, completed: 5 },
  { day: "Fri", scheduled: 9, completed: 4 },
  { day: "Sat", scheduled: 5, completed: 0 },
];

const recentServices = [
  { id: "#SV-1042", customer: "Praveen Kumar", tech: "Safeeq", mode: "UPI (GPay)", amount: "₹ 850", status: "Pending Verification", badge: "warning" as const, action: "Verify Ref ID" },
  { id: "#SV-1043", customer: "Ramesh Singh", tech: "Safeeq", mode: "Cash", amount: "₹ 700", status: "Cash with Tech", badge: "info" as const, action: "Settle Cash" },
  { id: "#SV-1040", customer: "Hotel Grand", tech: "Rajesh", mode: "Pre-paid", amount: "₹ 2,500", status: "Completed", badge: "success" as const, action: "View Report" },
  { id: "#SV-1039", customer: "Lakshmi Stores", tech: "Arun", mode: "UPI (PhonePe)", amount: "₹ 1,200", status: "Verified", badge: "success" as const, action: "View Report" },
  { id: "#SV-1038", customer: "Suresh Nair", tech: "Safeeq", mode: "Cash", amount: "₹ 450", status: "Cash with Tech", badge: "info" as const, action: "Settle Cash" },
];

const quickActions = [
  { label: "Add New Lead", icon: Plus, path: null, color: "text-white hover:opacity-90 shadow-[0px_5px_12px_rgba(39,47,158,0.2)]", style: { background: "linear-gradient(138.75deg, #942BF4 -42.53%, #1E2F96 94.59%)" } },
  { label: "Assign Service", icon: Wrench, path: "/services", color: "text-white hover:opacity-90 shadow-[0px_5px_12px_rgba(39,47,158,0.2)]", style: { background: "linear-gradient(138.75deg, #942BF4 -42.53%, #1E2F96 94.59%)" } },
  { label: "Pending Payments", icon: Eye, path: "/payments", color: "text-white hover:opacity-90 shadow-[0px_5px_12px_rgba(39,47,158,0.2)]", style: { background: "linear-gradient(138.75deg, #942BF4 -42.53%, #1E2F96 94.59%)" } },
  { label: "Quick Stock Update", icon: Package, path: "/inventory", color: "text-white hover:opacity-90 shadow-[0px_5px_12px_rgba(39,47,158,0.2)]", style: { background: "linear-gradient(138.75deg, #942BF4 -42.53%, #1E2F96 94.59%)" } },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [revenueFilter, setRevenueFilter] = useState("This Week");
  const [serviceFilter, setServiceFilter] = useState("This Week");
  const [servicesTableFilter, setServicesTableFilter] = useState("Recent");
  const [serviceBreakdownFilter, setServiceBreakdownFilter] = useState("Today");
  const [showRevenueDropdown, setShowRevenueDropdown] = useState(false);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [showServicesTableDropdown, setShowServicesTableDropdown] = useState(false);
  const [showServiceBreakdownDropdown, setShowServiceBreakdownDropdown] = useState(false);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [leadFormData, setLeadFormData] = useState({
    name: "",
    phone: "",
    address: "",
    services: [],
    notes: "",
  });
  const [serviceSearch, setServiceSearch] = useState("");
  const [showLeadServiceDropdown, setShowLeadServiceDropdown] = useState(false);

  const allServices = ["Cockroach Control", "Termite Control", "Bed Bug Treatment", "Rodent Control", "General Pest"];
  const filteredServices = allServices.filter(s => s.toLowerCase().includes(serviceSearch.toLowerCase()) && !leadFormData.services.includes(s));

  const revenueDropdownRef = useRef<HTMLDivElement>(null);
  const serviceDropdownRef = useRef<HTMLDivElement>(null);
  const servicesTableDropdownRef = useRef<HTMLDivElement>(null);
  const serviceBreakdownDropdownRef = useRef<HTMLDivElement>(null);
  const leadServiceDropdownRef = useRef<HTMLDivElement>(null);

  const filterOptions = ["This Week", "This Month", "This Year"];
  const servicesTableOptions = ["Recent", "This Week", "This Month", "All Time"];
  const serviceBreakdownOptions = ["Today", "This Week", "This Month"];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (revenueDropdownRef.current && !revenueDropdownRef.current.contains(event.target as Node)) {
        setShowRevenueDropdown(false);
      }
      if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(event.target as Node)) {
        setShowServiceDropdown(false);
      }
      if (servicesTableDropdownRef.current && !servicesTableDropdownRef.current.contains(event.target as Node)) {
        setShowServicesTableDropdown(false);
      }
      if (serviceBreakdownDropdownRef.current && !serviceBreakdownDropdownRef.current.contains(event.target as Node)) {
        setShowServiceBreakdownDropdown(false);
      }
      if (leadServiceDropdownRef.current && !leadServiceDropdownRef.current.contains(event.target as Node)) {
        setShowLeadServiceDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-card-foreground">Dashboard</h2>
        <p className="text-sm text-muted-foreground">Overview of today's activities and key metrics</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Active Projects" value="24" trend="+2 this week" trendType="up" icon={FolderKanban} />
        <KPICard title="Pending Payments" value="₹ 12,450" trend="-5% vs last month" trendType="down" icon={CreditCard} />
        <KPICard title="Cash to Settle" value="₹ 5,800" trend="From technicians" trendType="neutral" icon={Wallet} />
        <KPICard title="Low Stock Items" value="3" trend="Needs reordering" trendType="warning" icon={AlertTriangle} />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        {quickActions.map((a) => (
          a.path ? (
            <Link
              key={a.label}
              to={a.path}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90 ${a.color}`}
              style={a.style}
            >
              <a.icon className="w-4 h-4" />
              {a.label}
            </Link>
          ) : (
            <button
              key={a.label}
              onClick={() => setShowAddLeadModal(true)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90 ${a.color}`}
              style={a.style}
            >
              <a.icon className="w-4 h-4" />
              {a.label}
            </button>
          )
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl p-5 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-card-foreground">Weekly Revenue</h3>
            <div className="relative" ref={revenueDropdownRef}>
              <button
                onClick={() => setShowRevenueDropdown(!showRevenueDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-card-foreground bg-secondary/50 hover:bg-secondary rounded-lg transition-colors"
              >
                <Calendar className="w-3 h-3" />
                {revenueFilter}
                <ChevronDown className="w-3 h-3" />
              </button>
              {showRevenueDropdown && (
                <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg z-10 min-w-[120px]">
                  {filterOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setRevenueFilter(option);
                        setShowRevenueDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-secondary transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        revenueFilter === option ? 'text-primary font-medium bg-primary/5' : 'text-card-foreground'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 40%, 90%)" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 50%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 50%)" />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(214, 40%, 90%)", fontSize: 12 }} />
              <Area type="monotone" dataKey="expected" stroke="hsl(236, 60%, 39%)" fill="hsl(236, 60%, 39%)" fillOpacity={0.08} strokeWidth={2} />
              <Area type="monotone" dataKey="collected" stroke="hsl(142, 72%, 40%)" fill="hsl(142, 72%, 40%)" fillOpacity={0.08} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary" />Expected</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-success" />Collected</span>
          </div>
        </div>

        <div className="bg-card rounded-xl p-5 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-card-foreground">Service Breakdown</h3>
            <div className="relative" ref={serviceBreakdownDropdownRef}>
              <button
                onClick={() => setShowServiceBreakdownDropdown(!showServiceBreakdownDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-card-foreground bg-secondary/50 hover:bg-secondary rounded-lg transition-colors"
              >
                <Calendar className="w-3 h-3" />
                {serviceBreakdownFilter}
                <ChevronDown className="w-3 h-3" />
              </button>
              {showServiceBreakdownDropdown && (
                <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg z-10 min-w-[120px]">
                  {serviceBreakdownOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setServiceBreakdownFilter(option);
                        setShowServiceBreakdownDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-secondary transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        serviceBreakdownFilter === option ? 'text-primary font-medium bg-primary/5' : 'text-card-foreground'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie data={taskData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} dataKey="value" strokeWidth={0}>
                  {taskData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="ml-4 space-y-3">
              {taskData.map((t) => (
                <div key={t.name} className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
                  <span className="text-muted-foreground">{t.name}</span>
                  <span className="font-bold text-card-foreground ml-1">{t.value}</span>
                </div>
              ))}
              <div className="pt-1 border-t border-border text-sm font-bold text-card-foreground">33 Total Services</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl p-5 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-card-foreground">Service Performance</h3>
            <div className="relative" ref={serviceDropdownRef}>
              <button
                onClick={() => setShowServiceDropdown(!showServiceDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-card-foreground bg-secondary/50 hover:bg-secondary rounded-lg transition-colors"
              >
                <Calendar className="w-3 h-3" />
                {serviceFilter}
                <ChevronDown className="w-3 h-3" />
              </button>
              {showServiceDropdown && (
                <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg z-10 min-w-[120px]">
                  {filterOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setServiceFilter(option);
                        setShowServiceDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-secondary transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        serviceFilter === option ? 'text-primary font-medium bg-primary/5' : 'text-card-foreground'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={serviceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 40%, 90%)" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 50%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 50%)" />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(214, 40%, 90%)", fontSize: 12 }} />
              <Bar dataKey="scheduled" fill="hsl(236, 60%, 39%)" radius={[4, 4, 0, 0]} barSize={16} />
              <Bar dataKey="completed" fill="hsl(214, 100%, 95%)" radius={[4, 4, 0, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary" />Scheduled</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-secondary" />Completed</span>
          </div>
        </div>

        <div className="bg-card rounded-xl p-5 card-shadow">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Stock Levels</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={inventoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 40%, 90%)" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 50%)" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={90} stroke="hsl(220, 10%, 50%)" />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(214, 40%, 90%)", fontSize: 12 }} />
              <Bar dataKey="stock" fill="hsl(236, 60%, 39%)" radius={[0, 4, 4, 0]} barSize={14} />
              <Bar dataKey="reorder" fill="hsl(38, 92%, 50%)" radius={[0, 4, 4, 0]} barSize={14} opacity={0.3} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary" />Current Stock</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-warning/30" />Reorder Level</span>
          </div>
        </div>
      </div>

      {/* Recent Services Table */}
      <div className="bg-card rounded-xl card-shadow">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold text-card-foreground">Recent Transactions</h3>
          <div className="relative" ref={servicesTableDropdownRef}>
            <button
              onClick={() => setShowServicesTableDropdown(!showServicesTableDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-card-foreground bg-secondary/50 hover:bg-secondary rounded-lg transition-colors"
            >
              <Filter className="w-3 h-3" />
              {servicesTableFilter}
              <ChevronDown className="w-3 h-3" />
            </button>
            {showServicesTableDropdown && (
              <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg z-10 min-w-[120px]">
                {servicesTableOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setServicesTableFilter(option);
                      setShowServicesTableDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-secondary transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      servicesTableFilter === option ? 'text-primary font-medium bg-primary/5' : 'text-card-foreground'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Service ID", "Customer", "Technician", "Payment Mode", "Amount", "Status", "Action"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentServices.map((s, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-primary">{s.id}</td>
                  <td className="px-5 py-3.5 text-card-foreground">{s.customer}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{s.tech}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{s.mode}</td>
                  <td className="px-5 py-3.5 font-semibold text-card-foreground">{s.amount}</td>
                  <td className="px-5 py-3.5"><StatusBadge label={s.status} variant={s.badge} /></td>
                  <td className="px-5 py-3.5">
                    <button className="text-xs font-semibold text-primary hover:underline">{s.action}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Lead Modal */}
      {showAddLeadModal && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-white w-full h-full md:w-full md:h-auto md:rounded-xl md:shadow-lg md:max-w-md mx-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="p-6 space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">Add New Lead</h3>
                <button
                  onClick={() => setShowAddLeadModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Lead Name */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Lead Name</label>
                <input
                  type="text"
                  placeholder="Enter lead name"
                  value={leadFormData.name}
                  onChange={(e) => setLeadFormData({ ...leadFormData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-blue-50 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 border border-blue-100"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Phone Number</label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={leadFormData.phone}
                  onChange={(e) => setLeadFormData({ ...leadFormData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-blue-50 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 border border-blue-100"
                />
              </div>

              {/* Address */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Address</label>
                <input
                  type="text"
                  placeholder="Enter address"
                  value={leadFormData.address}
                  onChange={(e) => setLeadFormData({ ...leadFormData, address: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-blue-50 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 border border-blue-100"
                />
              </div>

              {/* Services */}
              <div ref={leadServiceDropdownRef}>
                <label className="text-sm font-medium text-gray-700 mb-3 block">Services</label>
                
                {/* Search Input */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                    onFocus={() => setShowLeadServiceDropdown(true)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-blue-50 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 border border-blue-100"
                  />
                  
                  {/* Service Dropdown - Inside Modal */}
                  {showLeadServiceDropdown && filteredServices.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-blue-100 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                      {filteredServices.map((service) => (
                        <button
                          key={service}
                          onClick={() => {
                            setLeadFormData({ ...leadFormData, services: [...leadFormData.services, service] });
                            setServiceSearch("");
                            setShowLeadServiceDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 transition-colors border-b border-blue-50 last:border-0"
                        >
                          {service}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected Services Tags */}
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 min-h-[44px] flex flex-wrap gap-2 items-center">
                  {leadFormData.services.length === 0 ? (
                    <span className="text-sm text-gray-400">No services selected</span>
                  ) : (
                    leadFormData.services.map((service) => (
                      <div key={service} className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        <span>{service}</span>
                        <button
                          onClick={() => setLeadFormData({ ...leadFormData, services: leadFormData.services.filter(s => s !== service) })}
                          className="hover:text-blue-900 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Notes</label>
                <textarea
                  placeholder="Add any special notes or requirements..."
                  value={leadFormData.notes}
                  onChange={(e) => setLeadFormData({ ...leadFormData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg bg-blue-50 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 border border-blue-100 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowAddLeadModal(false)}
                  className="flex-1 h-10 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowAddLeadModal(false);
                    navigate("/leads");
                  }}
                  className="flex-1 h-10 text-white rounded-lg hover:opacity-90 shadow-lg transition-all font-semibold text-sm"
                  style={{ background: "linear-gradient(138.75deg, #942BF4 -42.53%, #1E2F96 94.59%)" }}
                >
                  Save & Go to Leads
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
