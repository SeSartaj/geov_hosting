# Geospatial Data Visualization Tool

A tool designed to visualize geospatial data on a map, integrating custom layers fetched from a REST API, and displaying relevant time-series data. This project is built using React, with `react-map-gl` for map integration.

## Project Setup

To run this project locally, you'll need the following:

1. **MapTiler API Key** for basemap style
2. **Sentinel Hub Client ID and Secret** for fetching data and imagery from sentinel hubs

the following environment variables are required:

```
VITE_MAPTILER_ACCESS_KEY=your-maptiler-key
VITE_SENTINAL_HUB_CLIENT_ID=your-sentinal-hub-api-key
VITE_SENTINAL_HUB_CLIENT_SECRET=your-sentinal-hub-client-secret
VITE_SENTINAL_HUB_WMTS_ID=sentinal-hub-wmts-layer-id
VITE_AGV_API_USERNAME=your_username
VITE_AGV_API_PASSWORD=your_password
```

### Steps to Setup:

1. **Rename `env.example` to `.env`.**
2. **Paste the API keys and credentials into the `.env` file.**
3. in the project directory, run `yarn install` in order to install required packages
4. run `yarn dev` to start the development server
5. goto `localhost:3000` and you shall see the app running.

### USage example

```
<AgvMap
  configs={{
    VITE_MAPTILER_ACCESS_KEY: your-value,
    VITE_SENTINAL_HUB_CLIENT_ID:  your-value,
    VITE_SENTINAL_HUB_CLIENT_SECRET:  your-value,
    VITE_SENTINAL_HUB_WMTS_ID:  your-value,
  }}

  requestHeaders={{
    Authentication: your-value
  }}

>
```

## Project Goal

Implement a map component with custom layers fetched from a REST API, to be integrated into a dashboard for visualization and analysis.

## Observations

- A marker may belong to a farm, and a farm can have multiple markers.
- a farm can have many plots

## FAQs

- **Why does the backend throw a CORS error?**
  - Only port 3000 is allowed on the backend.
- **What is the difference between forecast markers and station markers?**
  - If a marker is associated with a device, it represents a station marker. Forecast markers, on the other hand, are not associated with devices, and their data is fetched from a third-party service.
