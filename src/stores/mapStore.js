import { layerOptions } from '@/constants';
import { create } from 'zustand';

const VIEW_MODES = {
  PICKER: 'PICKER',
  NORMAL: 'NORMAL',
  DRAW: 'DRAW',
};

const MAP_CURSORS = {
  // all posible cursors on react-map-gl (maplibre)
  DEFAULT: 'default',
  POINTER: 'pointer',
  CROSSHAIR: 'crosshair',
  MOVE: 'move',
  GRAB: 'grab',
  GRABBING: 'grabbing',
  TEXT: 'text',
  WAIT: 'wait',
  HELP: 'help',
};

const useMapStore = create((set) => ({
  hoveredValue: null,
  setHoveredValue: (color) => set({ hoveredValue: color }),
  cursor: MAP_CURSORS.DEFAULT,
  setCursor: (cursor) => set({ cursor }),
  viewMode: VIEW_MODES.NORMAL,
  pickerData: null,
  setPickerData: (data) => set({ pickerData: data }),
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

  cursorCords: [0, 0],
  setCursorCords: (cords) => set({ cursorCords: cords }),
  rasterLayer: layerOptions[0],
  setRasterLayer: (layer) => set({ rasterLayer: layer }),
  rasterOpacity: 100,
  setRasterOpacity: (opacity) => set({ rasterOpacity: opacity }),
}));

export default useMapStore;
