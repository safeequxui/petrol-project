import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type LeadStatus = "New" | "Contacted" | "Quote Sent" | "Converted" | "Lost";

export type Lead = {
  id: number;
  name: string;
  phone: string;
  address: string;
  services: string[];
  status: LeadStatus;
  date: string;
  quoteIsViewed: boolean;
  quoteViewedAt: string | null;
  quoteAmount?: number;
  quoteContract?: string;
  quoteNotes?: string;
  quoteLost?: boolean;
};

interface LeadsStore {
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id'>) => void;
  updateLead: (id: number, updates: Partial<Lead>) => void;
  deleteLead: (id: number) => void;
  getLead: (id: number) => Lead | undefined;
  getLeadsByStatus: (status: LeadStatus) => Lead[];
}

const initialLeads: Lead[] = [
  { id: 1, name: "Arun Sharma", phone: "9876543210", address: "12 MG Road, Kochi", services: ["Termite Treatment"], status: "Quote Sent", date: "Mar 5", quoteIsViewed: true, quoteViewedAt: "Mar 13, 2:30 PM", quoteAmount: 5000, quoteContract: "3 Months" },
  { id: 2, name: "safeeq", phone: "5555555555", address: "fffffffffffff", services: ["Pest Control", "Fumigation", "Termite Treatment"], status: "Quote Sent", date: "Mar 13, 2026", quoteIsViewed: true, quoteViewedAt: null, quoteAmount: 8000, quoteContract: "One-Time" },
  { id: 3, name: "kkkkkk", phone: "78987", address: "jkjio", services: ["General Pest"], status: "Quote Sent", date: "Mar 13, 2026", quoteIsViewed: false, quoteViewedAt: null, quoteAmount: 3000, quoteContract: "3 Months" },
  { id: 4, name: "Priya Nair", phone: "9876543211", address: "45 NH Bypass, Thrissur", services: ["General Pest"], status: "Contacted", date: "Mar 4", quoteIsViewed: false, quoteViewedAt: null },
  { id: 5, name: "Hotel Sunrise", phone: "9876543212", address: "Beach Road, Calicut", services: ["Commercial Pest Control", "Kitchen Deep Clean", "Fumigation Service"], status: "Converted", date: "Mar 3", quoteIsViewed: true, quoteViewedAt: "Mar 4, 2:30 PM", quoteAmount: 45000, quoteContract: "3 Months" },
  { id: 6, name: "Deepak M", phone: "9876543213", address: "Sector 5, Trivandrum", services: ["Rodent Control"], status: "Converted", date: "Mar 1", quoteIsViewed: true, quoteViewedAt: "Mar 2, 10:15 AM", quoteAmount: 12000, quoteContract: "One-Time" },
  { id: 7, name: "Fatima Begum", phone: "9876543214", address: "Old Town, Palakkad", services: ["Cockroach Control"], status: "Lost", date: "Feb 28", quoteIsViewed: false, quoteViewedAt: null },
  { id: 8, name: "Rajesh Pillai", phone: "9876543215", address: "Hill View, Munnar", services: ["Bed Bug Treatment", "Preventive Spray"], status: "New", date: "Mar 6", quoteIsViewed: false, quoteViewedAt: null },
];

export const useLeadsStore = create<LeadsStore>()(
  persist(
    (set, get) => ({
      leads: initialLeads,
      
      addLead: (lead) => set((state) => ({
        leads: [...state.leads, { ...lead, id: Math.max(...state.leads.map(l => l.id), 0) + 1 }]
      })),
      
      updateLead: (id, updates) => set((state) => ({
        leads: state.leads.map(lead => lead.id === id ? { ...lead, ...updates } : lead)
      })),
      
      deleteLead: (id) => set((state) => ({
        leads: state.leads.filter(lead => lead.id !== id)
      })),
      
      getLead: (id) => get().leads.find(lead => lead.id === id),
      
      getLeadsByStatus: (status) => get().leads.filter(lead => lead.status === status),
    }),
    {
      name: 'leads-store',
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migrate from version 0 to 1 - reset to fresh data
          return { leads: initialLeads };
        }
        return persistedState;
      },
    }
  )
);
