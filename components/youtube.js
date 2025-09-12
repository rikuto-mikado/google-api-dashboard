async function searchYouTube(query) {
    const youtubeResults = document.getElementById('youtube-results');
    if (!youtubeResults) return;

    try {
        console.log('Searching YouTube for:', query);
        youtubeResults.innerHTML = '<p>Searching for videos...</p>';

        // Search using the YouTube Data API v3
        const response = await gapi.client.youtube.search.list({
            part: 'snippet',
            q: query,
            maxResults: 8,
            type: 'video',
            order: 'relevance'
        });

        const videos = response.result.items;

        if (!videos || videos.length === 0) {
            youtubeResults.innerHTML = '<p>No search results were found</p>';
            return;
        }

        console.log(`Found ${videos.length} videos`);

        // Generating HTML for the video list
        const videosHTML = videos.map(video => {
            const snippet = video.snippet;
            const videoId = video.id.videoId;
            const thumbnailUrl = snippet.thumbnails.medium.url;
            const title = snippet.title;
            const channelTitle = snippet.channelTitle;
            const publishedAt = formatVideoDate(snippet.publishedAt);
            
            return `
            <div class="video-item" onclick="playVideo('${videoId}')">
              <img src="${thumbnailUrl}" alt="${escapeHtml(title)}" class="video-thumbnail" />
              <div class="video-info">
                <div class="video-title">${escapeHtml(title)}</div>
                <div class="video-channel">${escapeHtml(channelTitle)}</div>
                <div class="video-date">${publishedAt}</div>
              </div>
            </div>
            `;
        }).join('');

        youtubeResults.innerHTML = `
        <div class="video-grid">
          ${videosHTML}
        </div>
        `;

        console.log('YouTube search completed successfully');

    } catch (error) {
        console.error('YouTube search error:', error);
        youtubeResults.innerHTML = `
        <div class="error-message">
          <p>YouTube search failed</p>
          <p class="error-details">${error.message}</p>
        </div>
        `;
    }
}


function formatVideoDate(dateString) {
    if (!dateString) return '';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US');
    } catch (error) {
        return dateString;
    }
}

function playVideo(videoId) {
    console.log('Playing video:', videoId);
    // Open the YouTube video page in a new tab
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    window.open(youtubeUrl, '_blank');
}

function escapeHtml(text) {
    if (!text) return '';
    
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Function to retrieve popular videos (optional)
async function loadTrendingVideos() {
    const youtubeResults = document.getElementById('youtube-results');
    if (!youtubeResults) return;

    try {
        console.log('Loading trending videos...');
        youtubeResults.innerHTML = '<p>🔥 Loading trending videos...</p>';
        
        const response = await gapi.client.youtube.videos.list({
            part: 'snippet,statistics',
            chart: 'mostPopular',
            regionCode: 'JP',
            maxResults: 8
        });

        const videos = response.result.items;
        
        if (!videos || videos.length === 0) {
            youtubeResults.innerHTML = '<p>📭 No trending videos found</p>';
            return;
        }

        const videosHTML = videos.map(video => {
            const snippet = video.snippet;
            const videoId = video.id;
            const thumbnailUrl = snippet.thumbnails.medium.url;
            const title = snippet.title;
            const channelTitle = snippet.channelTitle;
            const viewCount = formatViewCount(video.statistics.viewCount);
            
            return `
            <div class="video-item" onclick="playVideo('${videoId}')">
              <img src="${thumbnailUrl}" alt="${escapeHtml(title)}" class="video-thumbnail" />
              <div class="video-info">
                <div class="video-title">${escapeHtml(title)}</div>
                <div class="video-channel">${escapeHtml(channelTitle)}</div>
                <div class="video-views">${viewCount} views</div>
              </div>
            </div>
            `;
        }).join('');

        youtubeResults.innerHTML = `
        <div class="section-info">
          <span>🔥 Trending Videos in Japan</span>
        </div>
        <div class="video-grid">
          ${videosHTML}
        </div>
        `;

        console.log('Trending videos loaded successfully');

    } catch (error) {
        console.error('Trending videos error:', error);
        youtubeResults.innerHTML = `
        <div class="error-message">
          <p>⚠️ Failed to load trending videos</p>
          <p class="error-details">${error.message}</p>
        </div>
        `;
    }
}


function formatViewCount(count) {
    if (!count) return '0';
    
    const num = parseInt(count);
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Load trending videos on initialization (optional)
document.addEventListener('DOMContentLoaded', () => {
    // If you want to automatically load trending videos after authentication,
    // call loadTrendingVideos() at the appropriate timing
});

// For debugging
console.log('YouTube component loaded');