const CONFIG = {
    // Google OAuth2 Client ID
    CLIENT_ID: 'YOUR_CLIENT_ID_HERE',
    
    // YouTube Data API Key
    YOUTUBE_API_KEY: 'YOUR_YOUTUBE_API_KEY_HERE',
    
    // Google Maps API Key
    MAPS_API_KEY: 'YOUR_MAPS_API_KEY_HERE',
    
    // OAuth2 Scopes
    SCOPES: [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/youtube.readonly'
    ].join(' ')
};