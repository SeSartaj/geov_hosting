# Geospatial Data Visualisation Tool

## Goal

Implement a map component with custom layers fetched from a REST API, to be integrated into a dashboard.

## Requirements

- Use https://visgl.github.io/react-map-gl/
- Implement the tool as a pluggable react component for use in a web or react native app

**Features to implement:**

- Same or similar UI to pick a base map (see Kepler demo: https://kepler.gl/demo)
- Render GeoJSON layer on the map from file upload or from a REST API (will be provided) similar UI as kepler.gl also see https://visgl.github.io/react-map-gl/examples/geojson
- Add/remove layers like Kepler.gl
- Render a time series chart on click or selection of an area on the map (see 4:15 in this video https://youtu.be/PX2fwIWVPCw?t=255)
- Draw polygon on map like (see example https://visgl.github.io/react-map-gl/examples/draw-polygon)
- Render markers and show popup based on data from REST API (see example https://visgl.github.io/react-map-gl/examples/controls)
- Save and load features (polygons, shapes etc.) through the REST API

## CheckList

- [x] use react-map-gl
- [x] Add and load markers
- [x] show popup with time-series data chart on marker
- [ ] draw polygon and add fields
- [ ] render ndvi layer
- [ ] show popup with time series data on each feature of ndvi

## Checklist for version 1

- [x] load markers
- [x] show paw, battery level, name, serial, and crop on popup
- [x] filter markers based on farm and state
- [x] switch between map and satellite map
- [x] full screen mode
- [] map settings
- [] add new marker
- [x] add a pie chart on map that shows percentage of each paw status.

## Observations

- there are different types of markers
- a marker may belong to a farm, and a farm can have many markers

## FAQs

- why backend throws CORS error?
- only port 3000 is allowed on the backend.
- what is the difference between forecast marker and station marker?
- If a marker is associated with a device, it represents a station marker. Otherwise, it is a forecast marker, and data for forecast marker is fetched from a third-party service.
-
