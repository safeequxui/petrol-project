import { StatusBadge } from "@/components/StatusBadge";
import { Plus, Search, X, Calendar, Clock, MapPin, User, CheckCircle2, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useServicesStore } from "@/store/servicesStore";
import { useProjectsStore } from "@/store/projectsStore";

const employees = [
  { id: 1, name: "Safeeq", phone: "9876543220", availability: "Available" },
  { id: 2, name: "Rajesh", phone: "9876543221", availability: "Available" },
  { id: 3, name: "Arun", phone: "9876543222", availability: "Busy" },
];

const statusMap = { "In Progress": "warning", Scheduled: "info", Completed: "success" } as const;

const ServicesPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { appointments, addAppointment, getNextAppointmentId } = useServicesStore();
  const { getWorkOrder } = useProjectsStore();
  const [search, setSearch] = useState("");
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [workOrderData, setWorkOrderData] = useState<any>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedService, setSelectedService] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    workOrderId: "",
    customer: "",
    address: "",
    serviceType: "",
    appointmentDate: "",
    appointmentTime: "",
    employee: "",
    instructions: "",
    tasks: [] as Array<{ id: string; title: string }>
  });
  
  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    const workOrderId = searchParams.get("workOrderId");
    if (workOrderId) {
      const workOrder = getWorkOrder(workOrderId);
      if (workOrder) {
        setWorkOrderData(workOrder);
        setFormData(prev => ({
          ...prev,
          workOrderId: workOrder.id,
          customer: workOrder.customer,
          address: workOrder.address,
          serviceType: workOrder.serviceType,
          appointmentDate: new Date().toISOString().split('T')[0]
        }));
        setShowAssignForm(true);
      }
    }
  }, [searchParams, getWorkOrder]);

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask = {
        id: `TSK-${Date.now()}`,
        title: newTaskTitle
      };
      setFormData(prev => ({
        ...prev,
        tasks: [...prev.tasks, newTask]
      }));
      setNewTaskTitle("");
    }
  };

  const removeTask = (taskId: string) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== taskId)
    }));
  };

  const handleAssignService = () => {
    if (!formData.employee) {
      toast.error("Please select a technician");
      return;
    }
    if (!formData.appointmentDate) {
      toast.error("Please select an appointment date");
      return;
    }
    if (!formData.appointmentTime) {
      toast.error("Please select an appointment time");
      return;
    }
    
    const newAppointment = {
      id: getNextAppointmentId(),
      workOrderId: formData.workOrderId,
      date: formData.appointmentDate,
      time: formData.appointmentTime,
      employeeId: formData.employee,
      employeeName: formData.employee,
      instructions: formData.instructions,
      tasks: formData.tasks,
      status: "Scheduled" as const
    };
    
    addAppointment(newAppointment);
    
    setSuccessMessage(`Service assigned to ${formData.employee} for ${formData.customer}`);
    setShowSuccessMessage(true);
    setShowAssignForm(false);
    setFormData({
      workOrderId: "",
      customer: "",
      address: "",
      serviceType: "",
      appointmentDate: "",
      appointmentTime: "",
      employee: "",
      instructions: "",
      tasks: []
    });
    setNewTaskTitle("");
    
    toast.success("Service appointment created successfully!");
    setTimeout(() => setShowSuccessMessage(false), 5000);
  };

  const closeForm = () => {
    setShowAssignForm(false);
    setFormData({
      workOrderId: "",
      customer: "",
      address: "",
      serviceType: "",
      appointmentDate: "",
      appointmentTime: "",
      employee: "",
      instructions: "",
      tasks: []
    });
    setNewTaskTitle("");
  };

  const closeServiceModal = () => {
    setSelectedService(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-success/10 border border-success/20 rounded-lg p-4 animate-in fade-in slide-in-from-top-2 duration-300 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
          <p className="text-sm font-medium text-success">
            ✓ {successMessage}. Employee will receive the task in their mobile app.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-card-foreground">Service Appointments</h2>
          <p className="text-sm text-muted-foreground">Assign and track service appointments</p>
        </div>
        <button 
          onClick={() => setShowAssignForm(!showAssignForm)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 text-white shadow-[0px_5px_12px_rgba(39,47,158,0.2)] transition-all" 
          style={{ background: "linear-gradient(138.75deg, #942BF4 -42.53%, #1E2F96 94.59%)" }}
        >
          <Plus className="w-4 h-4" /> Assign Service
        </button>
      </div>

      {/* Assign Service Form */}
      {showAssignForm && (
        <div className="bg-card rounded-xl border border-border shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Form Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h3 className="text-lg font-bold text-card-foreground">Assign Service Appointment</h3>
              <p className="text-sm text-muted-foreground mt-1">Schedule and assign a service to an employee</p>
            </div>
            <button 
              onClick={closeForm}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Work Order Information */}
            {workOrderData && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <p className="text-xs font-medium text-primary mb-2">Work Order</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-card-foreground">{workOrderData.id}</span>
                    <span className="text-sm font-semibold text-card-foreground">{workOrderData.customer}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {workOrderData.address}
                  </div>
                </div>
              </div>
            )}

            {/* Appointment Details */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-card-foreground">Appointment Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1 block">
                    <Calendar className="w-3 h-3" />
                    Date <span className="text-destructive">*</span>
                  </label>
                  <input 
                    type="date"
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1 block">
                    <Clock className="w-3 h-3" />
                    Time <span className="text-destructive">*</span>
                  </label>
                  <input 
                    type="time"
                    value={formData.appointmentTime}
                    onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            {/* Employee Assignment */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-card-foreground">Assign Employee</h4>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1 block">
                  <User className="w-3 h-3" />
                  Select Technician <span className="text-destructive">*</span>
                </label>
                <select 
                  value={formData.employee}
                  onChange={(e) => setFormData({ ...formData, employee: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Choose a technician...</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.name}>
                      {emp.name} {emp.availability === "Busy" ? "(Busy)" : "(Available)"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Service Instructions */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-card-foreground">Service Instructions</h4>
              <textarea 
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                placeholder="Add specific instructions for this service appointment..."
                rows={3}
                className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>

            {/* Task Checklist */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div>
                <h4 className="text-sm font-semibold text-card-foreground mb-2">Task Checklist</h4>
                <p className="text-xs text-muted-foreground mb-4">Add tasks for the employee to complete during this service</p>
              </div>

              {/* Add Task Input */}
              <div className="space-y-3 p-4 bg-secondary/30 rounded-lg border border-border">
                <input 
                  type="text"
                  placeholder="e.g., Inspect equipment, Collect payment, Document findings..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  className="w-full px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  onClick={addTask}
                  disabled={!newTaskTitle.trim()}
                  className="w-full px-3 py-2 text-xs font-semibold text-white rounded-lg hover:opacity-90 transition-all shadow-[0px_5px_12px_rgba(39,47,158,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(138.75deg, #942BF4 -42.53%, #1E2F96 94.59%)" }}
                >
                  + Add Task
                </button>
              </div>

              {/* Tasks List */}
              {formData.tasks.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Tasks ({formData.tasks.length})</p>
                  {formData.tasks.map((task, idx) => (
                    <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-secondary/20 transition-colors">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 flex-shrink-0">
                        <span className="text-xs font-bold text-primary">{idx + 1}</span>
                      </div>
                      <p className="text-sm font-medium text-card-foreground flex-1">{task.title}</p>
                      <button
                        onClick={() => removeTask(task.id)}
                        className="p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 p-6 border-t border-border">
            <button 
              onClick={closeForm}
              className="flex-1 h-10 border border-border text-card-foreground text-sm font-medium hover:text-primary transition-colors rounded-lg"
            >
              Cancel
            </button>
            <button 
              onClick={handleAssignService}
              className="flex-1 h-10 text-sm font-semibold hover:opacity-90 text-white shadow-[0px_5px_12px_rgba(39,47,158,0.2)] transition-all rounded-lg" 
              style={{ background: "linear-gradient(138.75deg, #942BF4 -42.53%, #1E2F96 94.59%)" }}
            >
              Assign Service
            </button>
          </div>
        </div>
      )}

      {/* Services Table */}
      <div className="bg-card rounded-xl card-shadow overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-secondary/30">
          <h3 className="text-sm font-semibold text-card-foreground">Assigned Services</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Service ID", "Work Order", "Customer", "Technician", "Date & Time", "Status"].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {appointments.filter((a) => {
              const wo = getWorkOrder(a.workOrderId);
              return wo && wo.customer.toLowerCase().includes(search.toLowerCase());
            }).map((a) => {
              const wo = getWorkOrder(a.workOrderId);
              return (
                <tr 
                  key={a.id} 
                  onClick={() => setSelectedService({ ...a, workOrder: wo })}
                  className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors cursor-pointer"
                >
                  <td className="px-5 py-4 font-semibold text-primary text-sm">{a.id}</td>
                  <td className="px-5 py-4 text-muted-foreground text-sm">{a.workOrderId}</td>
                  <td className="px-5 py-4 text-card-foreground text-sm font-medium">{wo?.customer}</td>
                  <td className="px-5 py-4 text-muted-foreground text-sm">{a.employeeName}</td>
                  <td className="px-5 py-4 text-muted-foreground text-sm">{a.date} {a.time}</td>
                  <td className="px-5 py-4">
                    <StatusBadge label={a.status} variant={statusMap[a.status as keyof typeof statusMap]} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Service Details Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/20 z-50 animate-in fade-in duration-300 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-card rounded-xl shadow-lg w-full max-w-2xl flex flex-col animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Modal Header - Fixed */}
            <div className="flex items-center justify-between p-6 border-b border-border bg-card flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Eye className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-card-foreground">Service Details</h3>
                  <p className="text-sm text-muted-foreground">{selectedService.id}</p>
                </div>
              </div>
              <button
                onClick={closeServiceModal}
                className="p-2 hover:bg-secondary rounded-lg transition-colors flex-shrink-0"
              >
                <X className="w-6 h-6 text-muted-foreground" />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="overflow-y-auto flex-1 p-6 space-y-6 min-h-0">
              {/* Service Appointment Info */}
              <div className="bg-secondary/30 rounded-xl p-5 border border-border">
                <h4 className="text-sm font-semibold text-card-foreground mb-4">Appointment Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Service ID</span>
                    <span className="text-sm font-semibold text-primary">{selectedService.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Work Order</span>
                    <span className="text-sm font-semibold text-card-foreground">{selectedService.workOrderId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Status</span>
                    <StatusBadge label={selectedService.status} variant={statusMap[selectedService.status as keyof typeof statusMap]} />
                  </div>
                </div>
              </div>

              {/* Customer & Work Order Details */}
              {selectedService.workOrder && (
                <div className="bg-secondary/30 rounded-xl p-5 border border-border">
                  <h4 className="text-sm font-semibold text-card-foreground mb-4">Customer Information</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Customer Name</p>
                      <p className="text-sm font-semibold text-card-foreground">{selectedService.workOrder.customer}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Service Address</p>
                      <p className="text-sm font-semibold text-card-foreground">{selectedService.workOrder.address}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Phone</p>
                      <p className="text-sm font-semibold text-card-foreground">{selectedService.workOrder.phone}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Services to be Performed */}
              {selectedService.workOrder && (
                <div className="bg-secondary/30 rounded-xl p-5 border border-border">
                  <h4 className="text-sm font-semibold text-card-foreground mb-4">Services to be Performed</h4>
                  <div className="space-y-2">
                    {selectedService.workOrder.serviceType.split(", ").map((service, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 flex-shrink-0">
                          <span className="text-xs font-bold text-primary">{idx + 1}</span>
                        </div>
                        <span className="text-sm font-medium text-card-foreground">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Appointment Schedule */}
              <div className="bg-secondary/30 rounded-xl p-5 border border-border">
                <h4 className="text-sm font-semibold text-card-foreground mb-4">Appointment Schedule</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="text-sm font-semibold text-card-foreground">{selectedService.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Time</p>
                      <p className="text-sm font-semibold text-card-foreground">{selectedService.time}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assigned Employee */}
              <div className="bg-secondary/30 rounded-xl p-5 border border-border">
                <h4 className="text-sm font-semibold text-card-foreground mb-4">Assigned Technician</h4>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                  <User className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Technician Name</p>
                    <p className="text-sm font-semibold text-card-foreground">{selectedService.employeeName}</p>
                  </div>
                </div>
              </div>

              {/* Service Instructions */}
              {selectedService.instructions && (
                <div className="bg-secondary/30 rounded-xl p-5 border border-border">
                  <h4 className="text-sm font-semibold text-card-foreground mb-3">Service Instructions</h4>
                  <p className="text-sm text-card-foreground leading-relaxed">{selectedService.instructions}</p>
                </div>
              )}

              {/* Task Checklist */}
              {selectedService.tasks && selectedService.tasks.length > 0 && (
                <div className="bg-secondary/30 rounded-xl p-5 border border-border">
                  <h4 className="text-sm font-semibold text-card-foreground mb-4">Task Checklist ({selectedService.tasks.length})</h4>
                  <div className="space-y-2">
                    {selectedService.tasks.map((task, idx) => (
                      <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 flex-shrink-0">
                          <span className="text-xs font-bold text-primary">{idx + 1}</span>
                        </div>
                        <span className="text-sm font-medium text-card-foreground">{task.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer - Fixed */}
            <div className="flex gap-3 p-6 border-t border-border bg-card flex-shrink-0">
              <button
                onClick={closeServiceModal}
                className="flex-1 h-10 border border-border text-card-foreground text-sm font-medium hover:text-primary transition-colors rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
