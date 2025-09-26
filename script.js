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

    // Wait for gapi to be available
    if (typeof gapi !== 'undefined') {
        handleClientLoad();
    } else {
        // Poll for gapi to be available
        const checkGapi = setInterval(() => {
            if (typeof gapi !== 'undefined') {
                clearInterval(checkGapi);
                handleClientLoad();
            }
        }, 100);
    }
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
        elements.signoutButton.addEventListener('click', handleSignOut);
    }

    // Refresh button
    const refreshGmail = document.getElementById('refresh-gmail');
    if (refreshGmail) {
        refreshGmail.addEventListener('click', () => {
            if (typeof loadGmailData === 'function') loadGmailData();
        });
    }

    const refreshDrive = document.getElementById('refresh-drive');
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

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

async function initClient() {
    try {
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
        console.log('Starting sign in...');
        showLoading(true);

        const authInstance = gapi.auth2.getAuthInstance();
        const user = await authInstance.signIn();

        console.log('Sign in successful');
        handleAuthSuccess(user);
    } catch (error) {
        console.error('Sign in error:', error);
        showError('Failed to log in: ' + error.message);
        showLoading(false);
    }
}

function handleAuthSuccess(user) {
    console.log('Handling auth success...');
    currentUser = user;
    accessToken = user.getAuthResponse().access_token;

    // Update UI
    const profile = user.getBasicProfile();
    if (elements.userName) {
        elements.userName.textContent = profile.getName();
    }

    if (elements.loginSection) {
        elements.loginSection.style.display = 'none';
    }

    if (elements.userSection) {
        elements.userSection.style.display = 'flex';
    }

    if (elements.welcomeMessage) {
        elements.welcomeMessage.style.display = 'none';
    }

    if (elements.dashboard) {
        elements.dashboard.style.display = 'block';
    }

    console.log('Logged in as:', profile.getName());

    // Data loading
    loadAllData();
}


async function handleSignOut() {
    try {
        console.log('Starting sign out...');
        const authInstance = gapi.auth2.getAuthInstance();
        await authInstance.signOut();
        
        currentUser = null;
        accessToken = null;
        
        // Update UI
        if (elements.loginSection) {
            elements.loginSection.style.display = 'block';
        }
        if (elements.userSection) {
            elements.userSection.style.display = 'none';
        }
        if (elements.welcomeMessage) {
            elements.welcomeMessage.style.display = 'block';
        }
        if (elements.dashboard) {
            elements.dashboard.style.display = 'none';
        }
        
        console.log('Sign out successful');
        
    } catch (error) {
        console.error('Sign out error:', error);
        showError('Failed to sign out: ' + error.message);
    }
}

async function loadAllData() {
    console.log('Loading all data...');
    showLoading(true);
    hideError();
    
    try {
        // Load data in parallel
        const promises = [];
        
        if (typeof loadGmailData === 'function') {
            promises.push(loadGmailData());
        }
        
        if (typeof loadDriveData === 'function') {
            promises.push(loadDriveData());
        }
        
        if (typeof loadCalendarData === 'function') {
            promises.push(loadCalendarData());
        }
        
        await Promise.allSettled(promises);
        
        console.log('All data loaded');
        
    } catch (error) {
        console.error('Data loading error:', error);
        showError('An error occurred while loading data');
    } finally {
        showLoading(false);
    }
}

// YouTube search handler
async function handleYouTubeSearch() {
    const searchInput = document.getElementById('youtube-search');
    if (!searchInput) return;
    
    const query = searchInput.value.trim();
    if (!query) return;
    
    console.log('Searching YouTube for:', query);
    
    if (typeof searchYouTube === 'function') {
        await searchYouTube(query);
    } else {
        console.error('searchYouTube function not found');
        showError('YouTube search function is not loaded');
    }
}

// Utility function
function showLoading(show) {
    if (elements.loading) {
        elements.loading.style.display = show ? 'block' : 'none';
    }
}

function showError(message) {
    console.error('Error:', message);
    if (elements.errorMessage && elements.errorText) {
        elements.errorText.textContent = message;
        elements.errorMessage.style.display = 'block';
    }
}

function hideError() {
    if (elements.errorMessage) {
        elements.errorMessage.style.display = 'none';
    }
}

// API Request Helper
function getAuthHeaders() {
    return {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
    };
}

async function makeAPIRequest(url, options = {}) {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...getAuthHeaders(),
                ...options.headers
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
}

// Global error handling
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    showError('An unexpected error has occurred.: ' + event.error.message);
})

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    showError('An error occurred during processing.: ' + event.reason);
});

// Settings check
if (typeof CONFIG === 'undefined') {
    showError('Configuration file (config.js) not found. Please copy config.example.js to config.js and set it up.');
} else if (CONFIG.CLIENT_ID === 'YOUR_CLIENT_ID_HERE' || CONFIG.CLIENT_ID.includes('#')) {
    showError('Google Client ID is not set. Please set it in the config.js file.');
} else if (CONFIG.GOOGLE_API_KEY === 'YOUR_API_KEY_HERE' || CONFIG.GOOGLE_API_KEY.includes('#')) {
    showError('Google API Key is not set. Please set it in the config.js file.');
}

// For debugging purposes
console.log('Script.js loaded successfully');
console.log('CONFIG available:', typeof CONFIG !== 'undefined');