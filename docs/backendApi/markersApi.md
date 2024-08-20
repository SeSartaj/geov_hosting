# API Documentation

## Marker API Endpoints

### 1. List of All User Markers

- **Endpoint**: `GET https://agviewer.com/api/dashboard/marker/primary/`
- **Method**: `GET`
- **Authentication**: Basic Auth

#### Description:

This endpoint retrieves a list of all markers associated with the authenticated user.

---

### 2. Create a New Marker

- **Endpoint**: `POST https://agviewer.com/api/dashboard/marker/`
- **Method**: `POST`
- **Authentication**: Basic Auth

#### Required Fields:

- **marker_map**: `integer` (ID of the map)
- **device**: `string` (ID of the device)
- **paw_graphs**: `array of UUIDs` (List of PAW graph IDs)
- **graphs**: `array of UUIDs` (List of other graph IDs)
- **lng**: `float` (Longitude)
- **lat**: `float` (Latitude)
- **location_name**: `string` (Name of the location)
- **farm**: `integer` (ID of the farm)
- **use_custom_location**: `boolean` (Flag to use a custom location)

#### Request Body Example:

```json
{
  "marker_map": 4864,
  "device": "a8fbc",
  "paw_graphs": ["52b9a8e7-f660-4eae-9bab-4278053b4afa"],
  "graphs": ["e100a4ed-912b-47e5-bc52-6ab4b203410f"],
  "lng": null,
  "lat": null,
  "location_name": "",
  "farm": null,
  "use_custom_location": true
}
```

---
