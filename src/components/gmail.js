/* global gapi */

/* eslint-disable-next-line no-unused-vars */
async function loadGmailData() {
    const gmailContent = document.getElementById('gmail-content');
    if (!gmailContent) return;

    try {
      console.log('Loading Gmail data...');
      gmailContent.innerHTML = '<p>Loading email...</p>';

      // Retrieve the message list using the Gmail API
      const response = await gapi.client.gmail.users.messages.list({
        userId: 'me',
        maxResults: 10,
        q: ''
      });

      const messages = response.result.messages;

      if (!messages || messages.length === 0) {
        gmailContent.innerHTML = '<p>The email could not be found</p>';
        return;
      }

      console.log(`Found ${messages.length} messages`);

      // Retrieve details for each message (first five entries)
      const emailPromises = messages.slice(0, 5).map(async (message) => {
        try {
          const details = await gapi.client.gmail.users.messages.get({
            userId: 'me',
            id: message.id,
            format: 'metadata',
            metadataHeaders: ['From', 'Subject', 'Date']
          });
          return details.result;
        } catch (error) {
          console.error('Error fetching message:', error);
          return null;
        }
      });

      const emailDetails = await Promise.all(emailPromises);
      const validEmails = emailDetails.filter(email => email !== null);

      if (validEmails.length === 0) {
        gmailContent.innerHTML = '<p>The email details could not be loaded</p>';
        return;
      }

      // Generating HTML for the email list
      const emailsHTML = validEmails.map(email => {
        const headers = email.payload.headers;
        const from = getHeaderValue(headers, 'From') || 'Sender unknown';
        const subject = getHeaderValue(headers, 'Subject') || 'No subject';
        const date = formatDate(getHeaderValue(headers, 'Date'));

        // Snippet (part of the email body)
        const snippet = email.snippet || 'No preview';

        return `
        <div class="email-item" onclick="openEmail('${email.id}')">
          <div class="email-subject">${escapeHtml(subject)}</div>
          <div class="email-sender">From: ${escapeHtml(from)}</div>
          <div class="email-date">${date}</div>
          <div class="email-snippet">${escapeHtml(snippet)}</div>
        </div>
        `;
      }).join('');

      gmailContent.innerHTML = `
      <div class="email-list">
        <div class="section-info">
          <span> Latest email (${validEmails.length} cases)</span>
        </div>
        ${emailsHTML}
      </div>
      `;

      console.log('Gmail data loaded successfully');

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

function getHeaderValue(headers, name) {
  const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
  return header ? header.value : null;
}

function formatDate(dateString) {
  if (!dateString) return 'Date unknown';

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP') + ' ' + date.toLocaleTimeString('ja-JP');
  } catch {
    return dateString;
  }
}

function escapeHtml(text) {
  if (!text) return '';

  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/* eslint-disable-next-line no-unused-vars */
function openEmail(messageId) {
  console.log('Opening email:', messageId);
  // A location where the email details display function can be implemented in the future
  alert(`メール詳細機能は今後実装予定です\nMessage ID: ${messageId}`);
}

// For debugging purposes
console.log('Gmail component loaded')
