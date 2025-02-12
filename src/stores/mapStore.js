import { layerOptions } from '@/constants';
import { create } from 'zustand';

export const VIEW_MODES = {
  PICKER: 'PICKER',
  NORMAL: 'NORMAL',
  DRAW: 'DRAW',
  EDIT_PLOT: 'EDIT_PLOT',
  ADD_PLOT: 'ADD_PLOT',
  ADD_MARKER: 'ADD_MARKER',
  EDIT_MARKER: 'EDIT_MARKER',
  ADD_NEW_FARM: 'ADD_NEW_FARM',
};

const MAP_CURSORS = {
  // all posible cursors on react-map-gl (maplibre)
  DEFAULT: '',
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
  configs: {},
  setConfigs: (configs) => set({ configs: configs }),
  requestHeaders: undefined,
  setRequestHeaders: (requestHeaders) =>
    set({ requestHeaders: requestHeaders }),
  setAccessToken: (accessToken) => set({ accessToken: accessToken }),
  sidebarExpanded: true,
  setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),
  hoveredValue: null,
  setHoveredValue: (color) => set({ hoveredValue: color }),
  cursor: MAP_CURSORS.DEFAULT,
  previousCursor: MAP_CURSORS.DEFAULT,
  setCursor: (cursor) =>
    set((state) => ({
      previousCursor: 'grab',
      cursor: cursor,
    })),
  resetCursor: () => set((state) => ({ cursor: state.previousCursor })),
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
  rasterLayer: { value: '3_NDVI', label: 'NDVI' },
  setRasterLayer: (layer) => set({ rasterLayer: layer }),
  rasterOpacity: 100,
  setRasterOpacity: (opacity) => set({ rasterOpacity: opacity }),
  clickedMarker: null,
  setClickedMarker: (m) => set({ clickedMarker: m }),
  setShowCroppedImages: (m) => set({ showCroppedImages: m }),
  showCroppedImages: false,
}));

export default useMapStore;
