import { create } from "zustand";

interface DialogState {
    isOpen: boolean;
    onConfirm: () => void;
    title?: string;
    message?: string;
}

interface DialogActions {
    openDialog: (options: {
        onConfirm: () => void;
        title?: string;
        message?: string;
    }) => void;
    closeDialog: () => void;
    confirmAndClose: () => void;
}

const initialState: Omit<DialogState, "onConfirm"> = {
    isOpen: false,
    title: undefined,
    message: undefined,
};

export const useDeleteDialogStore = create<DialogState & DialogActions>(
    (set, get) => ({
        ...initialState,
        onConfirm: () => { },

        openDialog: (options) => {
            set({
                isOpen: true,
                onConfirm: options.onConfirm,
                title: options.title,
                message: options.message,
            });
        },

        closeDialog: () => {
            set({
                ...initialState,
                onConfirm: () => { },
            });
        },

        confirmAndClose: () => {
            const { onConfirm } = get();
            get().closeDialog();
            onConfirm();
        },
    }),
);
