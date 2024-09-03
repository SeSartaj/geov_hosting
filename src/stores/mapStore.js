import { is } from 'immutable';
import { create } from 'zustand';

const VIEW_MODES = {
  PICKER: 'PICKER',
  NORMAL: 'NORMAL',
  DRAW: 'DRAW',
};

const useMapStore = create((set) => ({
  viewMode: VIEW_MODES.NORMAL,
  loadingNDVIImages: [],
  addLoadingNDVIImage: (id) =>
    set((state) => ({
      loadingNDVIImages: [...state.loadingNDVIImages, id],
    })),
  removeLoadingNDVIImage: (id) =>
    set((state) => ({
      loadingNDVIImages: state.loadingNDVIImages.filter((i) => i !== id),
    })),
  isNDVIImageLoading: (id) => {
    return useMapStore.getState().loadingNDVIImages.includes(id);
  },
  setViewMode: (mode) => set({ viewMode: mode }),
  toPickerMode: () => set({ viewMode: VIEW_MODES.PICKER }),
  toNormalMode: () => set({ viewMode: VIEW_MODES.NORMAL }),
  toDrawMode: () => set({ viewMode: VIEW_MODES.DRAW }),
  toggleNormalPickerMode: () =>
    set((state) => ({
      viewMode:
        state.viewMode === VIEW_MODES.NORMAL
          ? VIEW_MODES.PICKER
          : VIEW_MODES.NORMAL,
    })),
}));

export default useMapStore;
