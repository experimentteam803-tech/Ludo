import { create } from 'zustand';

export interface UserProfile {
  uid: string;
  displayName: string;
  virtualCoins: number;
  avatarUrl: string;
  isAdmin: boolean;
}

interface AuthStore {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  updateCoins: (delta: number) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: {
    uid: 'guest_player_101',
    displayName: 'Arif Khan',
    virtualCoins: 80,
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    isAdmin: false,
  },
  setUser: (user) => set({ user }),
  updateCoins: (delta) =>
    set((state) => ({
      user: state.user
        ? { ...state.user, virtualCoins: Math.max(0, state.user.virtualCoins + delta) }
        : null,
    })),
}));
