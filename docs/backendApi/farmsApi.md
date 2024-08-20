# API Documentation

## Farm API Endpoints

### 1. List of User Farms

- **Endpoint**: `GET https://agviewer.com/api/dashboard/farm/`
- **Method**: `GET`
- **Authentication**: Basic Auth

#### Description:

This endpoint retrieves a list of all farms associated with the authenticated user.

### 2. Create a New Farm

- **Endpoint**: `POST https://agviewer.com/api/dashboard/farm/`
- **Method**: `POST`
- **Authentication**: Basic Auth

#### Required Fields:

- **name**: `string` (Name of the farm)
- **marker_set**: `array of objects` (List of markers to add to this farm, each containing a marker ID)

#### Request Body Example:

```json
{
  "marker_set": [{ "id": 123 }],
  "name": "new farm"
}
```

---

### 3. Update a Farm

- **Endpoint**: `PUT https://agviewer.com/api/dashboard/farm/<farm_id:Integer>`
- **Method**: `PUT`
- **Authentication**: Basic Auth

#### Required Fields:

- **name**: `string` (Name of the farm)
- **marker_set**: `array of objects` (List of markers to add to this farm, each containing a marker ID)

#### Request Body Example:

```json
{
  "marker_set": [{ "id": 123 }],
  "name": "new farm"
}
```

---

### 4. Get a Farm

- **Endpoint**: `GET https://agviewer.com/api/dashboard/farm/<farm_id:Integer>`
- **Method**: `GET`
- **Authentication**: Basic Auth

#### Description:

This endpoint retrieves the details of a specific farm by its ID.

---

### 5. Delete a Farm

- **Endpoint**: `DELETE https://agviewer.com/api/dashboard/farm/<farm_id:Integer>`
- **Method**: `DELETE`
- **Authentication**: Basic Auth

#### Description:

This endpoint deletes a specific farm by its ID.

---
