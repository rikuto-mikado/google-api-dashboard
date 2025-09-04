async function loadDriveData() {
    const driveContent = document.getElementById('drive-content');
    if (!driveCotent) return;

    try {
        console.log('Loading Drive data...');
        driveContent.innerHTML = '<p>Loading file...</p>';

        // Retrieve a file list using the Google Drive API
        const response = await gapi.client.drive.files.list({
            pageSize: 10,
            fields: 'files(id, name, mineType, size, modifiedTime, webViewLink, iconLink)',
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
            const fileIcon = getFileIcon(file.mineType);
            const fileType = getFileType(file.mineType);

            return `
                <div class="file-item" onclick="openFile('${file.webViewLink}', '${escapeHtml(fileName)}')")>
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

function getFileIcon(mineType) {
    if (!mineType) return '📄';

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

    return iconMap[mineType] || '📄';
}

function getFileType(mineType) {
    
}