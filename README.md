# Geospatial Data Visualization Tool

A tool designed to visualize geospatial data on a map, integrating custom layers fetched from a REST API, and displaying relevant time-series data. This project is built using React, with `react-map-gl` for map integration.

## Project Setup

To run this project locally, you'll need the following:

1. **MapTiler API Key** for basemap style
2. **Sentinel Hub Client ID and Secret** for fetching data and imagery from sentinel hubs

### Steps to Setup:

1. **Rename `.env.example` to `.env`.**
2. **Paste the API keys and credentials into the `.env` file.**
3. in the project directory, run `yarn install` in order to install required packages
4. run `yarn dev` to start the development server
5. goto `localhost:3000` and you shall see the app running.

## Project Goal

Implement a map component with custom layers fetched from a REST API, to be integrated into a dashboard for visualization and analysis.

## Feature Checklist

### Version 1.0 Checklist

- [x] Load markers on the map.
- [x] Show PAW status, battery level, name, serial number, and crop information in the marker popup.
- [x] Filter markers based on farm and state.
- [x] Toggle between map and satellite view.
- [x] Enable full-screen mode.
- [x] Add a pie chart on the map showing the percentage of each PAW status.
- [x] Display plots on the map.
- [x] Draw a polygon on the map and allow adding plots to it.
- [x] Persist map settings with the user account or in the local storage.
- [x] Add a new marker on the map.
- [x] Show a popup with time-series data when a plot is clicked.
- [x] Use Highcharts for chart visualization, following the configuration provided by Mr. Zakir.
- [ ] Explore and integrate ESA Sen-ET (explore documentation).
- [ ] Implement the Preline U module.
- [ ] Add translation files using the `i18n` library for multi-language support.
- [ ] Design the UI using `KendoReact` components with `TailwindCSS`.
- [ ] Show a loader when NDVI images are loading to indicate system status to the user.

## Observations

- A marker may belong to a farm, and a farm can have multiple markers.
- a farm can have many plots

## FAQs

- **Why does the backend throw a CORS error?**
  - Only port 3000 is allowed on the backend.
- **What is the difference between forecast markers and station markers?**
  - If a marker is associated with a device, it represents a station marker. Forecast markers, on the other hand, are not associated with devices, and their data is fetched from a third-party service.

## Known Issues

- ~~When drawing starts, a popup shows up, but if clicked anywhere else, the popup disappears and doesn’t show up again.~~
- ~~When a plot is added, the modal and the popup do not close automatically.~~
- ~~When a marker is drawn on the map, an error is thrown.~~
- [ ] NDVI images are lost when the map style is changed.
- [ ] New NDVI images are not downloaded when plot geometry is edited.
