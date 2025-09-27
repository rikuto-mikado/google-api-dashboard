# Google API Dashboard

This is a simple dashboard that uses the Google API to display data from various Google services.

## Features

- Login with your Google account
- View your latest emails from Gmail
- View your recent files from Google Drive
- View your upcoming events from Google Calendar
- Search for videos on YouTube
- Search for locations on Google Maps

## Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/google-api-dashboard.git
    cd google-api-dashboard
    ```

2.  **Create a `config.js` file**
    Copy `config.example.js` to `config.js`.
    ```bash
    cp config.example.js config.js
    ```

3.  **Get your Google API Key and Client ID**
    - Go to the [Google Cloud Console](https://console.cloud.google.com/).
    - Create a new project.
    - Enable the following APIs:
        - Gmail API
        - Google Drive API
        - Google Calendar API
        - YouTube Data API v3
        - Maps JavaScript API
    - Create credentials:
        - **API Key**: Restrict it to your domain.
        - **OAuth 2.0 Client ID**:
            - Application type: Web application
            - Authorized JavaScript origins: `http://localhost` and your domain
            - Authorized redirect URIs: `http://localhost` and your domain

4.  **Update `config.js`**
    Open `config.js` and replace the placeholder values with your API Key and Client ID.

5.  **Run the application**
    Open the `index.html` file in your web browser.

## Usage

- Click the "Login with Google" button to authenticate.
- Once logged in, the dashboard will display data from the various Google services.
- Use the refresh buttons to update the data for each service.
- Use the search boxes to search on YouTube and Google Maps.