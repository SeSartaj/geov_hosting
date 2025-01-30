# Geospatial Data Visualization Tool

A tool designed to visualize geospatial data on a map, integrating custom layers fetched from a REST API, and displaying relevant time-series data. This project is built using React, with `react-map-gl` for map integration.

## Project Setup

To run this project locally, you'll need the following:

1. **MapTiler API Key** for basemap style
2. **Sentinel Hub Client ID and Secret** for fetching data and imagery from sentinel hubs

### Steps to Setup:

1. **Rename `env.example` to `.env`.**
2. **Paste the API keys and credentials into the `.env` file.**
3. in the project directory, run `yarn install` in order to install required packages
4. run `yarn dev` to start the development server
5. goto `localhost:3000` and you shall see the app running.

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
