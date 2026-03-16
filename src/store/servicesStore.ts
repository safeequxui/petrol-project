import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ServiceAppointment = {
  id: string;
  workOrderId: string;
  date: string;
  time: string;
  employeeId: string;
  employeeName: string;
  instructions: string;
  tasks: Task[];
  status: "Scheduled" | "Completed" | "Cancelled";
};

export type Task = {
  id: string;
  title: string;
  completed: boolean;
};

interface ServicesStore {
  appointments: ServiceAppointment[];
  addAppointment: (appointment: ServiceAppointment) => void;
  updateAppointment: (id: string, updates: Partial<ServiceAppointment>) => void;
  deleteAppointment: (id: string) => void;
  getAppointment: (id: string) => ServiceAppointment | undefined;
  getAppointmentsByWorkOrder: (workOrderId: string) => ServiceAppointment[];
  getNextAppointmentId: () => string;
}

export const useServicesStore = create<ServicesStore>()(
  persist(
    (set, get) => ({
      appointments: [],
      
      addAppointment: (appointment) => set((state) => ({
        appointments: [...state.appointments, appointment]
      })),
      
      updateAppointment: (id, updates) => set((state) => ({
        appointments: state.appointments.map(apt => apt.id === id ? { ...apt, ...updates } : apt)
      })),
      
      deleteAppointment: (id) => set((state) => ({
        appointments: state.appointments.filter(apt => apt.id !== id)
      })),
      
      getAppointment: (id) => get().appointments.find(apt => apt.id === id),
      
      getAppointmentsByWorkOrder: (workOrderId) => 
        get().appointments.filter(apt => apt.workOrderId === workOrderId),
      
      getNextAppointmentId: () => {
        const ids = get().appointments.map(apt => parseInt(apt.id.split('-')[1]));
        const nextNum = Math.max(...ids, 0) + 1;
        return `SA-${nextNum}`;
      }
    }),
    {
      name: 'services-store',
      version: 0,
    }
  )
);
