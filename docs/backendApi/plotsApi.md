# API Documentation

## Plot API Endpoints

### 1. Obtain List of Plots

- **Endpoint**: `GET https://agviewer.com/api/dashboard/plot/`
- **Method**: `GET`
- **Authentication**: Basic Auth

#### Description:

This endpoint retrieves a list of all plots associated with the authenticated user.

#### Filtering Plots:

- **Endpoint**: `GET https://agviewer.com/api/dashboard/plot/?farm=<farm_name:String>&name=<plot_name:String>`
- **Query Parameters**:
  - `farm`: `<string>` (Name of the farm)
  - `name`: `<string>` (Name of the plot)

### 2. Create a Plot

- **Endpoint**: `POST https://agviewer.com/api/dashboard/plot/`
- **Method**: `POST`
- **Authentication**: Basic Auth

#### Required Fields:

- **name**: `string` (Name of the plot)

#### Request Body Example:

```json
{
  "name": "My second plot",
  "option": { "Option1": "Value" }
}
```

#### Response Example:

```json
{
  "id": 2,
  "user": "test_user",
  "name": "My second plot",
  "area": null,
  "options": { "Option1": "Value" },
  "farm": null
}
```

---

### 3. Get a Plot

- **Endpoint**: `GET https://agviewer.com/api/dashboard/plot/<plot_id:Integer>/`
- **Method**: `GET`
- **Authentication**: Basic Auth

#### Description:

This endpoint retrieves the details of a specific plot by its ID.

---

### 4. Update a Plot

- **Endpoint**: `PUT https://agviewer.com/api/dashboard/plot/<plot_id:Integer>/`
- **Method**: `PUT`
- **Authentication**: Basic Auth

#### Request Body Example:

```json
{
  "name": "My second plot",
  "area": 22,
  "options": { "Option": "Value" },
  "farm": null
}
```

---

### 5. Delete a Plot

- **Endpoint**: `DELETE https://agviewer.com/api/dashboard/plot/<plot_id:Integer>/`
- **Method**: `DELETE`
- **Authentication**: Basic Auth

#### Description:

This endpoint deletes a specific plot by its ID.

---
