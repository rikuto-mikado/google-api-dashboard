async function loadGmailData() {
    const gmailContent = document.getElementById('gmail-content');
    if (!gmailContent) return;

    try {

    } catch (error) {
        console.error('Gmail loading error:', error);
        gmailContent.innerHTML = `
          <div class="error-message">
            <p>Failed to load email</p>
            <p class="error-details">${error.message}</p>
          </div>
        `;
    }
}