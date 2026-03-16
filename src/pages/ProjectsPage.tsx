import { StatusBadge } from "@/components/StatusBadge";
import { Search, X, Edit2, Plus, Clipboard, Calendar, User, MapPin, Phone, CreditCard } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useProjectsStore } from "@/store/projectsStore";
import { useLeadsStore } from "@/store/leadsStore";

const projects = [
  {
    id: "WO-1025",
    customer: "Kumar",
    address: "Tambaram, Chennai",
    start: "Feb 1, 2026",
    end: "Jan 31, 2027",
    status: "Scheduled",
    phone: "9876543210",
    email: "kumar@email.com",
    serviceType: "Cockroach Control (AMC - 4/Year)",
    frequency: "Quarterly",
    totalValue: "₹ 12,000",
    paidAmount: "₹ 4,000",
    nextService: "Mar 15, 2026",
    assignedTech: "Mani",
    notes: "Residential apartment treatment. Customer prefers morning slots."
  },
  {
    id: "WO-1026",
    customer: "Lakshmi Stores",
    address: "12 MG Road, Coimbatore",
    start: "Mar 10, 2026",
    end: "Mar 10, 2026",
    status: "Open",
    phone: "9876543211",
    email: "lakshmi.stores@email.com",
    serviceType: "Termite Control (One-Time)",
    frequency: "One-Time",
    totalValue: "₹ 8,000",
    paidAmount: "₹ 0",
    nextService: "Unassigned",
    assignedTech: "Unassigned",
    notes: "Store perimeter treatment. Avoid peak business hours (10 AM - 6 PM)."
  },
  {
    id: "WO-1027",
    customer: "Hotel Grand",
    address: "Beach Road, Calicut",
    start: "Jan 15, 2026",
    end: "Jan 15, 2027",
    status: "Scheduled",
    phone: "9876543212",
    email: "manager@hotelgrand.com",
    serviceType: "Bed Bug Treatment (AMC - Monthly)",
    frequency: "Monthly",
    totalValue: "₹ 96,000",
    paidAmount: "₹ 48,000",
    nextService: "Mar 20, 2026",
    assignedTech: "Safeeq",
    notes: "Full hotel treatment including kitchen, rooms, and common areas."
  }
];

const statusMap = {
  Scheduled: "success",
  Open: "warning",
  Completed: "neutral",
} as const;

const statusLabels = {
  Scheduled: "Scheduled & Active",
  Open: "Not Yet Scheduled",
  Completed: "Completed",
} as const;

const ProjectsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { workOrders, addWorkOrder, getNextWorkOrderId } = useProjectsStore();
  const { getLead, updateLead } = useLeadsStore();
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [convertedLeadName, setConvertedLeadName] = useState("");
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    address: "",
    services: [] as string[],
    contract: "",
    estimatedValue: "",
    notes: ""
  });
  const [newService, setNewService] = useState("");

  useEffect(() => {
    const convertLeadId = searchParams.get("convertLeadId");
    if (convertLeadId) {
      const lead = getLead(parseInt(convertLeadId));
      if (lead) {
        setFormData({
          customerName: lead.name || "",
          phone: lead.phone || "",
          address: lead.address || "",
          services: lead.services || [],
          contract: lead.quoteContract || "",
          estimatedValue: lead.quoteAmount?.toString() || "",
          notes: lead.quoteNotes || ""
        });
        setShowCreateForm(true);
      }
    }
  }, [searchParams, getLead]);

      const filtered = projects.filter((p) =>
        p.customer.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase()) ||
        p.address.toLowerCase().includes(search.toLowerCase())
      );

  const closeModal = () => setSelectedProject(null);

  const handleAddService = () => {
    if (newService.trim() && !formData.services.includes(newService)) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, newService]
      }));
      setNewService("");
    }
  };

  const handleRemoveService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const getPaymentProgress = (project: typeof projects[0]) => {
    const total = parseInt(project.totalValue.replace(/[₹,\s]/g, ''));
    const paid = parseInt(project.paidAmount.replace(/[₹,\s]/g, ''));
    return Math.round((paid / total) * 100);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-success/10 border border-success/20 rounded-lg p-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-sm font-medium text-success">
            ✓ Lead "{convertedLeadName}" has been converted to a Work Order. Now assign a technician to start the service.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-card-foreground">Work Orders</h2>
          <p className="text-sm text-muted-foreground">View and manage all work orders and AMCs.</p>
        </div>
        <button onClick={() => setShowCreateForm(!showCreateForm)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 text-white shadow-[0px_5px_12px_rgba(39,47,158,0.2)] transition-all"
                style={{ background: "linear-gradient(138.75deg, #942BF4 -42.53%, #1E2F96 94.59%)" }}>
          <Plus className="w-4 h-4" />
          Create Work Order
        </button>
      </div>

      {/* Create Work Order Form */}
      {showCreateForm && (
        <div className="bg-card rounded-xl border border-border shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-card-foreground">Create New Work Order</h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Customer Name</label>
                <input
                  type="text"
                  placeholder="Enter customer name"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-secondary text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 border border-border"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Phone Number</label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-secondary text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 border border-border"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Service Address</label>
                <input
                  type="text"
                  placeholder="Enter service address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-secondary text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 border border-border"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Services (add or remove)</label>
                <div className="flex gap-2 mb-3">
                  <select 
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-secondary text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 border border-border">
                    <option value="">Select service to add</option>
                    <option>Cockroach Control</option>
                    <option>Termite Control</option>
                    <option>Bed Bug Treatment</option>
                    <option>Rodent Control</option>
                    <option>General Pest</option>
                    <option>Fumigation</option>
                    <option>Preventive Spray</option>
                    <option>Commercial Pest Control</option>
                    <option>Kitchen Deep Clean</option>
                  </select>
                  <button 
                    onClick={handleAddService}
                    className="px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.services.length > 0 ? (
                    formData.services.map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border hover:bg-secondary/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 flex-shrink-0">
                            <span className="text-xs font-bold text-primary">{index + 1}</span>
                          </div>
                          <span className="text-sm font-medium text-card-foreground">{service}</span>
                        </div>
                        <button 
                          onClick={() => handleRemoveService(index)}
                          className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                          title="Remove service"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 rounded-lg bg-secondary/30 border border-border text-center">
                      <span className="text-xs text-muted-foreground">No services added yet</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Contract</label>
                <select 
                  value={formData.contract}
                  onChange={(e) => setFormData({ ...formData, contract: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-secondary text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 border border-border">
                  <option>Select contract</option>
                  <option>One-Time</option>
                  <option>3 Months</option>
                  <option>4 Months</option>
                  <option>1 Year</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Estimated Value (₹)</label>
                <input
                  type="number"
                  placeholder="Enter estimated value"
                  value={formData.estimatedValue}
                  onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-secondary text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 border border-border"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Special Notes</label>
              <textarea
                placeholder="Add any special instructions or notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-secondary text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 border border-border"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={() => setShowCreateForm(false)}
                className="flex-1 h-10 border border-border text-card-foreground rounded-lg hover:text-primary transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!formData.customerName || !formData.phone || !formData.address || formData.services.length === 0 || !formData.contract || !formData.estimatedValue) {
                    toast.error("Please fill in all required fields and add at least one service");
                    return;
                  }
                  
                  const newWO = {
                    id: getNextWorkOrderId(),
                    customer: formData.customerName,
                    address: formData.address,
                    start: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                    end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                    status: "Open" as const,
                    phone: formData.phone,
                    email: "",
                    serviceType: formData.services.join(", "),
                    frequency: formData.contract,
                    totalValue: `₹ ${parseInt(formData.estimatedValue).toLocaleString()}`,
                    paidAmount: "₹ 0",
                    nextService: "Unassigned",
                    assignedTech: "Unassigned",
                    notes: formData.notes
                  };
                  
                  addWorkOrder(newWO);
                  
                  // Update lead status if converting from lead
                  const convertLeadId = searchParams.get("convertLeadId");
                  if (convertLeadId) {
                    updateLead(parseInt(convertLeadId), { status: "Converted" });
                  }
                  
                  toast.success("Work Order created successfully!");
                  setShowSuccessMessage(true);
                  setConvertedLeadName(formData.customerName);
                  setShowCreateForm(false);
                  setFormData({
                    customerName: "",
                    phone: "",
                    address: "",
                    services: [],
                    contract: "",
                    estimatedValue: "",
                    notes: ""
                  });
                  setNewService("");
                  setTimeout(() => setShowSuccessMessage(false), 5000);
                }}
                className="flex-1 h-10 text-white rounded-lg hover:opacity-90 shadow-[0px_5px_12px_rgba(39,47,158,0.2)] transition-all font-semibold text-sm"
                style={{ background: "linear-gradient(138.75deg, #942BF4 -42.53%, #1E2F96 94.59%)" }}
              >
                Create Work Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-5 card-shadow border border-border">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-warning/10 rounded-lg flex-shrink-0">
              <Clipboard className="w-5 h-5 text-warning" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground mb-1">Not Yet Scheduled</p>
              <p className="text-2xl font-bold text-card-foreground">
                {projects.filter(p => p.status === 'Open').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-5 card-shadow border border-border">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-success/10 rounded-lg flex-shrink-0">
              <Calendar className="w-5 h-5 text-success" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground mb-1">Scheduled & Active</p>
              <p className="text-2xl font-bold text-card-foreground">
                {projects.filter(p => p.status === 'Scheduled').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-5 card-shadow border border-border">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-primary/10 rounded-lg flex-shrink-0">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground mb-1">Completed This Month</p>
              <p className="text-2xl font-bold text-card-foreground">
                {projects.filter(p => p.status === 'Completed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-5 card-shadow border border-border">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-primary/10 rounded-lg flex-shrink-0">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground mb-1">Total Contract Value</p>
              <p className="text-2xl font-bold text-card-foreground">
                ₹{(projects.reduce((sum, p) => sum + parseInt(p.totalValue.replace(/[₹,\s]/g, '')), 0) / 1000).toFixed(0)}K
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, ID, or location..."
          className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      {/* Projects Table */}
      <div className="bg-card rounded-xl card-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Work Order ID", "Customer", "Service Type", "Status", "Payment", "Next Service", "Edit"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((project) => (
                <tr key={project.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-primary text-sm">{project.id}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-card-foreground text-sm">{project.customer}</div>
                    <div className="text-xs text-muted-foreground mt-1">{project.address}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-sm text-card-foreground">{project.serviceType}</div>
                    <div className="text-xs text-muted-foreground mt-1">{project.frequency}</div>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge label={statusLabels[project.status]} variant={statusMap[project.status]} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-secondary rounded-full h-2">
                        <div
                          className="bg-success h-2 rounded-full transition-all"
                          style={{ width: `${getPaymentProgress(project)}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">{getPaymentProgress(project)}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-sm text-card-foreground">{project.nextService}</div>
                    <div className="text-xs text-muted-foreground mt-1">{project.assignedTech}</div>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-lg transition-colors"
                      title="Edit work order"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Details Dropdown */}
      {selectedProject && (
        <div className="bg-card rounded-xl border border-border shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Clipboard className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-card-foreground">{selectedProject.id}</h3>
                  <p className="text-sm text-muted-foreground">{selectedProject.customer}</p>
                </div>
              </div>
              <div className="mt-2">
                <StatusBadge label={statusLabels[selectedProject.status]} variant={statusMap[selectedProject.status]} />
              </div>
            </div>
            <button
              onClick={closeModal}
              className="p-2 hover:bg-secondary rounded-lg transition-colors ml-4 flex-shrink-0"
            >
              <X className="w-6 h-6 text-muted-foreground" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="max-h-[70vh] overflow-y-auto">
            <div className="p-6 space-y-4">

              {/* Contact Information Card */}
              <div className="bg-secondary/30 rounded-xl p-5 border border-border">
                <h4 className="text-sm font-semibold text-card-foreground mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Contact Details
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Phone Number</p>
                      <p className="text-sm font-semibold text-card-foreground">{selectedProject.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Service Address</p>
                      <p className="text-sm font-semibold text-card-foreground">{selectedProject.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Details Card */}
              <div className="bg-secondary/30 rounded-xl p-5 border border-border">
                <h4 className="text-sm font-semibold text-card-foreground mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Work Order Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Pest & Service Type</p>
                    <p className="text-sm font-semibold text-card-foreground">{selectedProject.serviceType}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Frequency</p>
                    <p className="text-sm font-semibold text-card-foreground">{selectedProject.frequency}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Assigned Technician</p>
                    <p className="text-sm font-semibold text-card-foreground">{selectedProject.assignedTech}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Next Appointment</p>
                    <p className="text-sm font-semibold text-primary">{selectedProject.nextService}</p>
                  </div>
                </div>
              </div>

              {/* Payment Information Card */}
              <div className="bg-secondary/30 rounded-xl p-5 border border-border">
                <h4 className="text-sm font-semibold text-card-foreground mb-4 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  Payment Status
                </h4>
                <div className="space-y-4">
                  {/* Payment Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-card rounded-lg p-4 text-center border border-border">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Total Value</p>
                      <p className="text-lg font-bold text-card-foreground">{selectedProject.totalValue}</p>
                    </div>
                    <div className="bg-success/10 rounded-lg p-4 text-center border border-success/20">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Paid Amount</p>
                      <p className="text-lg font-bold text-success">{selectedProject.paidAmount}</p>
                    </div>
                    <div className="bg-warning/10 rounded-lg p-4 text-center border border-warning/20">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Pending</p>
                      <p className="text-lg font-bold text-warning">
                        ₹{(parseInt(selectedProject.totalValue.replace(/[₹,\s]/g, '')) - parseInt(selectedProject.paidAmount.replace(/[₹,\s]/g, ''))).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Payment Progress */}
                  <div className="bg-card rounded-lg p-4 border border-border">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-card-foreground">Payment Progress</span>
                      <span className="text-sm font-bold text-primary">{getPaymentProgress(selectedProject)}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-success h-2 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${getPaymentProgress(selectedProject)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contract Details Card */}
              <div className="bg-secondary/30 rounded-xl p-5 border border-border">
                <h4 className="text-sm font-semibold text-card-foreground mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Work Order Period
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-xs font-medium text-primary mb-2">Work Order Start</p>
                    <p className="text-sm font-bold text-card-foreground">{selectedProject.start}</p>
                  </div>
                  <div className="bg-card rounded-lg p-4 border border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Work Order End</p>
                    <p className="text-sm font-bold text-card-foreground">{selectedProject.end}</p>
                  </div>
                </div>
              </div>

              {/* Notes Card */}
              <div className="bg-secondary/30 rounded-xl p-5 border border-border">
                <h4 className="text-sm font-semibold text-card-foreground mb-4">Special Notes</h4>
                <div className="bg-card rounded-lg p-4 border border-border">
                  <p className="text-sm text-card-foreground leading-relaxed">{selectedProject.notes}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={closeModal}
                  className="flex-1 h-10 border border-border text-card-foreground rounded-lg hover:text-primary transition-colors font-medium text-sm"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    closeModal();
                    navigate(`/services?workOrderId=${selectedProject.id}`);
                  }}
                  className="flex-1 h-10 text-white rounded-lg hover:opacity-90 shadow-[0px_5px_12px_rgba(39,47,158,0.2)] transition-all font-semibold text-sm"
                  style={{ background: "linear-gradient(138.75deg, #942BF4 -42.53%, #1E2F96 94.59%)" }}>
                  Assign Service
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;