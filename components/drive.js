async function loadDriveData() {
    const driveContent = document.getElementById('drive-content');
    if (!driveContent) return;

    try {
        console.log('Loading Drive data...');
        driveContent.innerHTML = '<p>Loading file...</p>';

        // Retrieve a file list using the Google Drive API
        const response = await gapi.client.drive.files.list({
            pageSize: 10,
            fields: 'files(id, name, mimeType, size, modifiedTime, webViewLink, iconLink)',
            orderBy: 'modifiedTime desc'
        });

        const files = response.result.files;

        if (!files || files.length === 0) {
            driveContent.innerHTML = '<p>The file could not be found</p>';
            return;
        }

        console.log(`Found ${files.length} files`);

        // ファイル一覧のHTML生成
        const filesHTML = files.map(file => {
            const fileName = file.name || 'File name unknown';
            const fileSize = formatFileSize(file.size);
            const modifiedTime = formatDate(file.modifiedTime);
            const fileIcon = getFileIcon(file.mimeType);
            const fileType = getFileType(file.mimeType);

            return `
                <div class="file-item" onclick="openFile('${file.webViewLink}', '${escapeHtml(fileName)}')">
                    <div class="file-icon">${fileIcon}</div>
                    <div class="file-info">
                        <div class="file-name">${escapeHtml(fileName)}</div>
                        <div class="file-meta">
                            <span class="file-type">${fileType}</span>
                            ${fileSize ? ` • ${fileSize}`: ''}
                            <span class="file-date"> • ${modifiedTime}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        driveContent.innerHTML = `
            <div class="file-list">
                <div class="section-info">
                    <span>Recent files (${files.length}件)</span>
                </div>
                ${filesHTML}
            </div>
        `;

        console.log('Drive data loaded successfully');
    
    } catch (error) {
        console.error('Drive loading error:', error);
        driveContent.innerHTML = `
            <div class="error-message">
                <p>Failed to load the file</p>
                <p class="error-details">${error.message}</p>
            </div>
        `;
    }
}

function formatFileSize(bytes) {
    if (!bytes || bytes === '0') return '';

    const sizes = ['B', 'KB', 'MB', 'GB'];
    const num = parseInt(bytes);

    if (num === 0) return '';

    const i = Math.floor(Math.log(num) / Math.log(1024));
    return Math.round(num / Math.pow(1024, i) * 10) / 10 + ' ' + sizes[i];
}

function formatDate(dateString) {
    if (!dateString) return 'Date unknown';

    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString('ja-Jp');
        }
    } catch (error) {
        return dateString;
    }
}

function getFileIcon(mimeType) {
    if (!mimeType) return '📄';

    const iconMap = {
        'application/vnd.google-apps.document': '📝',
        'application/vnd.google-apps.spreadsheet': '📊',
        'application/vnd.google-apps.presentation': '📊',
        'application/vnd.google-apps.folder': '📁',
        'application/pdf': '📕',
        'image/jpeg': '🖼️',
        'image/png': '🖼️',
        'image/gif': '🖼️',
        'video/mp4': '🎬',
        'video/quicktime': '🎬',
        'audio/mpeg': '🎵',
        'audio/wav': '🎵',
        'text/plain': '📄',
        'application/zip': '🗜️',
        'application/vnd.ms-excel': '📊',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊',
        'application/msword': '📝',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝'
    };

    return iconMap[mimeType] || '📄';
}

function getFileType(mimeType) {
    if (!mimeType) return 'File';

    const typeMap = {
        'application/vnd.google-apps.document': 'Google Docs',
        'application/vnd.google-apps.spreadsheet': 'Google Sheets',
        'application/vnd.google-apps.presentation': 'Google Slides',
        'application/vnd.google-apps.folder': 'Folder',
        'application/pdf': 'PDF',
        'image/jpeg': 'Image (JPEG)',
        'image/png': 'Image (PNG)',
        'image/gif': 'Image (GIF)',
        'video/mp4': 'Video (MP4)',
        'video/quicktime': 'Video',
        'audio/mpeg': 'Audio (MP3)',
        'audio/wav': 'Audio (WAV)',
        'text/plain': 'Text',
        'application/zip': 'ZIP File',
        'application/vnd.ms-excel': 'Excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel',
        'application/msword': 'Word',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word'
    };

    return typeMap[mimeType] || 'File';
}

function openFile(webViewLink, fileName) {
    console.log('Opening file:', fileName);

    if (webViewLink) {
        window.open(webViewLink, '_blank');
    } else {
        alert('This file cannot be opened');
    }
}

function escapeHtml(text) {
    if (!text) return '';

    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// File search function
async function searchDriveFiles(query) {
    const driveContent = document.getElementById('drive-content');
    if (!driveContent) return;

    try {
        console.log('Searching Drive for:', query);
        driveContent.innerHTML = '<p>Searching for files...</p>';

        const response = await gapi.client.drive.files.list({
            q: `name contains '${query}'`,
            pageSize: 20,
            fields: 'files(id, name, mimeType, size, modifiedTime, webViewLink, iconLink)',
            orderBy: 'modifiedTime desc'
        });

        const files = response.result.files;

        if (!files || files.length === 0) {
            driveContent.innerHTML  = `No files matching ‘${query}’ were found.`;
            return;
        }

        const filesHTML = files.map(file => {
            const fileName = file.name || 'File name unknown';
            const fileSize = formatFileSize(file.size);
            const modifiedTime = formatDate(file.modifiedTime);
            const fileIcon = getFileIcon(file.mimeType);
            const fileType = getFileType(file.mimeType);

            return `
                <div class="file-item" onclick="openFile('${file.webViewLink}', '${escapeHtml(fileName)}')">
                    <div class="file-icon">${fileIcon}</div>
                    <div class="file-info">
                        <div class="file-name">${escapeHtml(fileName)}</div>
                        <div class="file-meta">
                            <span class="file-type">${fileType}</span>
                            ${fileSize ? ` • ${fileSize}` : ''}
                            <span class="file-date"> • ${modifiedTime}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        driveContent.innerHTML = `
            <div class="file-list">
                <div class="section-info">
                    <span>Search results for ${query} (${files.length} Results)</span>
                </div>
                ${filesHTML}
            </div>
        `;

        console.log('Drive search completed successfully');

    } catch (error) {
        console.error('Drive search error:', error);
        driveContent.innerHTML = `
            <div class="error-message">
                <p>File search failed</p>
                <p class="error-details">${error.message}</p>
            </div>
        `;
    }
}

console.log('Drive component loaded');