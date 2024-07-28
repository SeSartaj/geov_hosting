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
