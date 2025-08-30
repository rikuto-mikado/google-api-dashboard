let gapi = null;
let currentUser = null;
let accessToken = null;

// DOM elements
const elements = {
    signinButton: null,
    signoutButton: null,
    userSection: null,
    loginSection: null,
    userName: null,
    dashboard: null,
    welcomeMessage: null,
    loading: null,
    errorMessage: null,
    errorText: null
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...');
    initializeElements();
    loadGoogleAPI();
});

function initializeElements() {
    elements.signinButton = document.getElementById('signin-button');
    elements.signoutButton = document.getElementById('signout-button');
    elements.userSection = document.getElementById('user-section');
    elements.loginSection = document.getElementById('login-section');
    elements.userName = document.getElementById('user-name');
    elements.dashboard = document.getElementById('dashboard');
    elements.welcomeMessage = document.getElementById('welcome-message');
    elements.loading = document.getElementById('loading');
    elements.errorMessage = document.getElementById('error-message');
    elements.errorText = document.getElementById('error-text');

    // Event Listener
    if (elements.signinButton) {
        elements.signinButton.addEventListener('click', handleSignIn);
    }
    if (elements.signoutButton) {
        element.signoutButton.addEventListener('click', handleSignOut);
    }

    // Refresh button
    const refreshGmail = document.getElementById('refresh-gmail');
    if (refreshGmail) {
        refreshGmail.addEventListener('click', () => {
            if (typeof loadGmailData === 'function') loadGmailData();
        });
    }

    const refreshDrive = documenet.getElementById('refresh-drive');
    if (refreshDrive) {
        refreshDrive.addEventListener('click', () => {
            if (typeof loadDriveData === 'function') loadDriveData();
        });
    }

    const refreshCalendar = document.getElementById('refresh-calendar');
    if (refreshCalendar) {
        refreshCalendar.addEventListener('click', () => {
            if (typeof loadCalendarData === 'function') loadCalendarData();
        });
    }

    // Searching with Youtube
    const youtubeSearchBtn = document.getElementById('youtube-search-btn');
    if (youtubeSearchBtn) {
        youtubeSearchBtn.addEventListener('click', handleYouTubeSearch);
    }

    const youtubeSearch = document.getElementById('youtube-search');
    if (youtubeSearch) {
        youtubeSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleYouTubeSearch();
        });
    }
}

async function loadGoogleAPI() {
    try {
        console.log('Loading Google API...');

        // Waiting for the Google API Client Library to load
        await new Promise((resolve) => {
            if (typeof gapi !== 'undefined') {
                resolve();
                return;
            }

            const checkGapi = setInterval(() => {
                if (typeof gapi !== 'underfined') {
                    clearInterval(checkGapi);
                    resolve();
                }
            }, 100);

            // Timeout in 10 seconds
            setTimeout(() => {
                clearInterval(checkGapi);
                throw new Error('Google API loading timeout');
            }, 10000);
        });

        // GAPI initialisation
        await new Promise((resolve) => {
            gapi.load('auth2:client', resolve);
        });

        console.log('Initializing GAPI client...');
        await gapi.client.init({
            apiKey: CONFIG.GOOGLE_API_KEY,
            clientId: CONFIG.CLIENT_ID,
            discoveryDocs: [
                'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest',
                'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
                'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
                'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'
            ],
            scope: CONFIG.SCOPES
        });

        console.log('Google API initialized successfully');

        // Check authentication status
        const authInstance = gapi.auth2.getAuthInstance();
        if (authInstance.isSignedIn.get()) {
            console.log('User already signed in');
            handleAuthSuccess(authInstance.currentUser.get());
        } else {
            console.log('User not signed in');
        }

    } catch (error) {
        console.error('Google API initialization error', error);
        showError('Failed to initialise the Google API: ' + error.message);
    }
}

async function handleSignIn() {
    try {

    } catch (error) {
        console.error('Sign in error:', error);
        showError('Failed to log in: ' + error.message);
        showLoading(false);
    }
}