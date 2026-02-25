'use client';
import { create } from 'zustand';

export interface Resource {
  title: string;
  url: string;
  snippet: string;
  type: string;
  source: string;
}

export interface SavedResource extends Resource {
  status: 'learning' | 'completed';
  savedAt: number;
}

export interface CertGoal {
  id: string;
  name: string;
  resources: SavedResource[];
}

interface CertStore {
  goals: CertGoal[];
  isLoaded: boolean;
  isProModalOpen: boolean;
  // Temporary local Pro state until we link the Vercel Postgres DB
  isProLocal: boolean; 
  
  init: () => void;
  openProModal: () => void;
  closeProModal: () => void;
  upgradeToProLocal: () => void;
  
  addGoal: (name: string) => void;
  removeGoal: (id: string) => void;
  saveResource: (goalName: string, resource: Resource) => void;
  removeResource: (goalId: string, url: string) => void;
  toggleResourceStatus: (goalId: string, url: string) => void;
}

export const useCertStore = create<CertStore>((set, get) => ({
  goals: [],
  isLoaded: false,
  isProModalOpen: false,
  isProLocal: false,

  init: () => {
    const storedGoals = localStorage.getItem('cert_goals');
    const storedPro = localStorage.getItem('cert_pro_status');
    set({
      goals: storedGoals ? JSON.parse(storedGoals) : [],
      isProLocal: storedPro === 'true',
      isLoaded: true
    });
  },

  openProModal: () => set({ isProModalOpen: true }),
  closeProModal: () => set({ isProModalOpen: false }),
  
  upgradeToProLocal: () => {
    localStorage.setItem('cert_pro_status', 'true');
    set({ isProLocal: true });
  },

  addGoal: (name) => {
    const { goals } = get();
    if (goals.find(g => g.name.toLowerCase() === name.toLowerCase())) return;
    const newGoals = [...goals, { id: Date.now().toString(), name, resources: [] }];
    localStorage.setItem('cert_goals', JSON.stringify(newGoals));
    set({ goals: newGoals });
  },

  removeGoal: (id) => {
    const { goals } = get();
    const newGoals = goals.filter(g => g.id !== id);
    localStorage.setItem('cert_goals', JSON.stringify(newGoals));
    set({ goals: newGoals });
  },

  saveResource: (goalName, resource) => {
    const { goals } = get();
    let goal = goals.find(g => g.name.toLowerCase() === goalName.toLowerCase());
    let newGoals = [...goals];
    
    if (!goal) {
      goal = { id: Date.now().toString(), name: goalName, resources: [] };
      newGoals.push(goal);
    } else {
      if (goal.resources.find(r => r.url === resource.url)) return;
      newGoals = newGoals.filter(g => g.id !== goal!.id);
      newGoals.push(goal);
    }
    
    goal.resources.push({ ...resource, status: 'learning', savedAt: Date.now() });
    localStorage.setItem('cert_goals', JSON.stringify(newGoals));
    set({ goals: newGoals });
  },

  removeResource: (goalId, url) => {
    const { goals } = get();
    const newGoals = goals.map(g => {
      if (g.id === goalId) {
        return { ...g, resources: g.resources.filter(r => r.url !== url) };
      }
      return g;
    });
    localStorage.setItem('cert_goals', JSON.stringify(newGoals));
    set({ goals: newGoals });
  },

  toggleResourceStatus: (goalId, url) => {
    const { goals } = get();
    const newGoals = goals.map(g => {
      if (g.id === goalId) {
        return {
          ...g,
          resources: g.resources.map((r): SavedResource => 
            r.url === url ? { ...r, status: r.status === 'learning' ? 'completed' : 'learning' } : r
          )
        };
      }
      return g;
    });
    localStorage.setItem('cert_goals', JSON.stringify(newGoals));
    set({ goals: newGoals });
  }
}));
