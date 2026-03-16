import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WorkOrderStatus = "Open" | "Scheduled" | "Completed";

export type WorkOrder = {
  id: string;
  customer: string;
  address: string;
  start: string;
  end: string;
  status: WorkOrderStatus;
  phone: string;
  email: string;
  serviceType: string;
  frequency: string;
  totalValue: string;
  paidAmount: string;
  nextService: string;
  assignedTech: string;
  notes: string;
  leadId?: number;
};

interface ProjectsStore {
  workOrders: WorkOrder[];
  addWorkOrder: (workOrder: WorkOrder) => void;
  updateWorkOrder: (id: string, updates: Partial<WorkOrder>) => void;
  deleteWorkOrder: (id: string) => void;
  getWorkOrder: (id: string) => WorkOrder | undefined;
  getWorkOrdersByStatus: (status: WorkOrderStatus) => WorkOrder[];
  getNextWorkOrderId: () => string;
}

const initialWorkOrders: WorkOrder[] = [
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

export const useProjectsStore = create<ProjectsStore>()(
  persist(
    (set, get) => ({
      workOrders: initialWorkOrders,
      
      addWorkOrder: (workOrder) => set((state) => ({
        workOrders: [...state.workOrders, workOrder]
      })),
      
      updateWorkOrder: (id, updates) => set((state) => ({
        workOrders: state.workOrders.map(wo => wo.id === id ? { ...wo, ...updates } : wo)
      })),
      
      deleteWorkOrder: (id) => set((state) => ({
        workOrders: state.workOrders.filter(wo => wo.id !== id)
      })),
      
      getWorkOrder: (id) => get().workOrders.find(wo => wo.id === id),
      
      getWorkOrdersByStatus: (status) => get().workOrders.filter(wo => wo.status === status),
      
      getNextWorkOrderId: () => {
        const ids = get().workOrders.map(wo => parseInt(wo.id.split('-')[1]));
        const nextNum = Math.max(...ids, 1024) + 1;
        return `WO-${nextNum}`;
      }
    }),
    {
      name: 'projects-store',
      version: 0,
    }
  )
);
