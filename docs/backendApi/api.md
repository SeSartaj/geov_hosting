# API Documentation

## Station & Device API Endpoints

### 1. List of User Stations

- **Endpoint**: `GET https://agviewer.com/api/dashboard/station/`
- **Method**: `GET`
- **Authentication**: Basic Auth

#### Description:

This endpoint retrieves a list of all stations associated with the authenticated user.

---

### 2. List of User PAW Graphs

- **Endpoint**: `GET https://agviewer.com/api/allgraphs/?graph_type=paw`
- **Method**: `GET`
- **Authentication**: Basic Auth

#### Description:

This endpoint retrieves a list of all PAW graphs associated with the authenticated user.

---

### 3. List of User Graphs

- **Endpoint**: `GET https://agviewer.com/api/allgraphs/`
- **Method**: `GET`
- **Authentication**: Basic Auth

#### Description:

This endpoint retrieves a list of all graphs associated with the authenticated user.

---

### 4. Download Forecast Data for a Marker

- **Endpoint**: `POST https://agviewer.com/api/dashboard/marker/download/`
- **Method**: `POST`
- **Authentication**: Basic Auth

#### Required Fields:

- **id**: `integer` (ID of the marker)

#### Request Body Example:

```json
{
    "id": <marker_id:integer>
}
```
