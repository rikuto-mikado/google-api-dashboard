const CONFIG = {
    // Google OAuth2 Client ID
    CLIENT_ID: 'YOUR_CLIENT_ID_HERE',
    
     GOOGLE_API_KEY: "YOUR_API_KEY",
    
    // OAuth2 Scopes
    SCOPES: [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/youtube.readonly'
    ].join(' ')
};