import { create } from "zustand";

interface LayoutState {
  hideHeaderFooter: boolean;
  setHideHeaderFooter: (hide: boolean) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  hideHeaderFooter: false,
  setHideHeaderFooter: (hide) => set({ hideHeaderFooter: hide }),
}));
