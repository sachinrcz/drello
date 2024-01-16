import {create} from "zustand"

type CardModalStore = {
    id?: string,
    isOpen: boolean;
    onOpen: (id: string) => void;
    onClose: () => void;
}

export const useCardModel = create<CardModalStore>((set)=>({
    isOpen: false,
    id: undefined,
    onOpen: (id: string) => set({ isOpen: true, id: id }),
    onClose: () => set({isOpen: false, id: undefined})
}));