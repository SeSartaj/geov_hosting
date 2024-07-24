# Geospatial Data Visualisation Tool

## Goal

Implement a light weight minimal version of kepler.gl with a small subset of the original features. (Kepler is heavy!)

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
- [x] UI (same as kepler) to pick base map
- [x] render GeoJSON layer
- [x] Add/Remove Layers (same as kepler)
- [ ] Draw polygon on the map
- [ ] Render markers and show popup
- [ ] Render time-series chart on click or selection
- [ ] save and load features
