import { create } from "zustand";

import { useUserStore } from "./userStore";

export const useChatStore = create((set) => ({
  currentUser: null,
  user: null,
  isCurrentUserBlocked: false,
  isReceivedBlocked: false,
  changeChat: (chatId, user) => {
    const currentUser = useUserStore.getState().currentUser;

    if (user.blocked.includes(currentUser.id)) {
      return set({
        chatId,
        user: null,
        isCurrentUserBlocked: true,
        isReceivedBlocked: false,
      });
    } else if (currentUser.blocked.includes(user.id)) {
      return set({
        chatId,
        user: user,
        isCurrentUserBlocked: false,
        isReceivedBlocked: true,
      });
    } else {
      return set({
        chatId,
        user,
        isCurrentUserBlocked: false,
        isReceivedBlocked: false,
      });
    }
  },
  changeBlock: () => {
    set((state) => ({ ...state, isReceivedBlocked: !state.isReceivedBlocked }));
  },
}));
