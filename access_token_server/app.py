from flask import Flask, jsonify
import requests
from dotenv import load_dotenv
import os
from flask_cors import CORS

# Load environment variables from the .env file
load_dotenv()

app = Flask(__name__)

CORS(app)

# Get client_id and client_secret from the .env file
CLIENT_ID = os.getenv("SENTINEL_HUB_CLIENT_ID")
CLIENT_SECRET = os.getenv("SENTINEL_HUB_CLIENT_SECRET")
print(CLIENT_ID, CLIENT_SECRET)

TOKEN_URL = "https://services.sentinel-hub.com/oauth/token"


@app.route("/api/token", methods=["GET"])
def get_access_token():
    try:
        # Prepare the request data for the token
        data = {
            "grant_type": "client_credentials",
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
        }

        # Send a POST request to get the token
        response = requests.post(TOKEN_URL, data=data)

        # Check if the request was successful
        if response.status_code == 200:
            # Return the access token as a JSON response
            token_data = response.json()
            return jsonify(token_data)
        else:
            # Return an error if the token fetch failed
            return (
                jsonify({"error": "Failed to fetch access token"}),
                response.status_code,
            )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
