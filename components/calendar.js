async function loadCalendarData() {
    const calendarContent = document.getElementById('calendar-content');
    if (!calendarContent) return;

    try {
        console.log('Loading Calendar data...');
        calendarContent.innerHTML = '<p>Loading schedule...</p>';

        // Retrieve today's date
        const now = new Date();
        const timeMin = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const timeMax = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7).toISOString();

        // Retrieve events using the Google Calendar API
        const response = await gapi.client.calendar.events.list({
            calendarId: 'primary',
            timeMin: timeMin,
            timeMax: timeMax,
            showDeleted: false,
            singleEvents: true,
            maxResults: 10,
            orderBy: 'startTime'
        });

        const events = response.result.items;

        if (!events || events.length === 0) {
            calendarContent.innerHTML = '<p>There are no plans for this week.</p>';
            return;
        }

        console.log(`Found ${events.length} events`);

        // Group events by date
        const eventsByDate = groupEventsByDate(events);

        // Generating HTML for the Event List
        let eventsHTML = '';

        for (const [date, dayEvents] of Object.entries(eventsByDate)) {
            const dayName = formatDayName(date);
            const eventsForDay = dayEvents.map(event => {
                const title = event.summary || 'Event';
                const time = formatEventTime(event);
                const location = event.location ? ` @ ${event.location}` : '';
                const description = event.description || '';
                
                return `
                    <div class="event-item" onclick="openEvent('${event.id}', '${escapeHtml(title)}')">
                        <div class="event-title">${escapeHtml(title)}</div>
                        <div class="event-time">${time}${escapeHtml(location)}</div>
                        ${description ? `<div class="event-description">${escapeHtml(description.substring(0, 100))}</div>` : ''}
                    </div>
                `;
            }).join('');
            
            eventsHTML += `
                <div class="calendar-day">
                    <div class="day-header">${dayName}</div>
                    ${eventsForDay}
                </div>
            `;
        }

        calendarContent.innerHTML = `
            <div class="calendar-list">
                <div class="section-info">
                    <span>📅 This week's schedule (${events.length} events)</span>
                </div>
                ${eventsHTML}
            </div>
        `;

        console.log('Calendar data loaded successfully');

    } catch (error) {
        console.error('Calendar loading error:', error);
        calendarContent.innerHTML = `
            <div class="error-message">
                <p>Failed to load the calendar</p>
                <p class="error-details">${error.message}</p>
            </div>
        `;
    }
}