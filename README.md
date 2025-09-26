# Google API Dashboard

A web dashboard that integrates with multiple Google APIs to display and manage your Google services data.

## Features

- **Gmail**: View your recent emails
- **Google Drive**: Browse your files and folders
- **Google Calendar**: Display upcoming events
- **YouTube**: Search for videos
- **Google Maps**: Search locations and display maps

## Setup

1. Clone the repository
2. Copy `config.example.js` to `config.js` and update with your API credentials
3. Open `index.html` in a web browser

## Configuration

You'll need to set up Google API credentials:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the required APIs:
   - Gmail API
   - Google Drive API
   - Google Calendar API
   - YouTube Data API v3
   - Google Maps JavaScript API
4. Create credentials (OAuth 2.0 Client ID and API Key)
5. Update `config.js` with your credentials

## File Structure

- `index.html` - Main HTML file
- `script.js` - Core JavaScript functionality
- `style.css` - Styling
- `config.js` - API configuration (not included in repo)
- `config.example.js` - Example configuration file
- `components/` - Individual API component files
  - `gmail.js` - Gmail integration
  - `drive.js` - Google Drive integration
  - `calendar.js` - Google Calendar integration
  - `youtube.js` - YouTube integration
  - `maps.js` - Google Maps integration

## License

MIT