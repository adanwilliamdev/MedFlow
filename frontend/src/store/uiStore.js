import { create } from 'zustand'

let toastSeq = 1

export const useUiStore = create((set, get) => ({
  // Sidebar
  sidebarCollapsed: localStorage.getItem('medflow_sidebar_collapsed') === '1',
  mobileNavOpen: false,
  toggleSidebarCollapsed: () =>
    set((state) => {
      const next = !state.sidebarCollapsed
      localStorage.setItem('medflow_sidebar_collapsed', next ? '1' : '0')
      return { sidebarCollapsed: next }
    }),
  toggleMobileNav: () => set((state) => ({ mobileNavOpen: !state.mobileNavOpen })),
  closeMobileNav: () => set({ mobileNavOpen: false }),

  // Toasts
  toasts: [],
  pushToast: (message, type = 'success') => {
    const id = toastSeq++
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }))
    setTimeout(() => get().dismissToast(id), 4000)
    return id
  },
  dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))
