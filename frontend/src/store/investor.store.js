import { create } from 'zustand'

export const useInvestorStore = create((set, get) => ({
  images: ['/cover4.png', '/cover1.jpg', '/cover2.jpg', '/cover3.jpg', '/cover4.jpg'],
  selectedIndex: 0,
  selectImage: (index) => set({ selectedIndex: index }),
  getSelectedImage: () => get().images[get().selectedIndex],

  // KPI data
  totalEarnings: 45892,
  earningsChangePercent: 25.98,
  completedDeals: 13546,

  // Simple setter for KPI if needed
  setKpis: (kpis) => set(kpis),
}))
