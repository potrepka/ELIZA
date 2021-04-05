const userID = Math.random().toString(36).substring(7);

const $chat = $('#chat');

const preDelay = 0;
const interDelay = 100;

const formatDate = (date) => {
    let options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };
    return date.toLocaleTimeString("en-us", options); 
}

const addSenderMessage = (message, time = '12:00 PM | April 1') => {
    $chat.prepend(`
        <div class="media w-33 mb-2">
            <img
                src="https://s3.amazonaws.com/com.getstoryflow.api.images/1613581528795-app-icons-big-sur-type-2-v3.png" alt="user" width="50"
                class="rounded-circle" />
            <div class="media-body ml-3">
                <div class="bg-light rounded py-2 px-3 mb-2">
                    <p class="text-small mb-0 text-muted">${message}</p>
                </div>
                <p class="small text-muted">${time}</p>
            </div>
        </div>
    `);
};

const addSenderMessages = async (response) => {
    await delay(preDelay);
    for (const message of response) {
        addSenderMessage(message, formatDate(new Date()));
        await delay(interDelay);
    }
}

const addRecieverMessage = (message, time = '12:00 PM | April 1') => {
    $chat.prepend(`
        <div class="media w-50 ml-auto mb-2">
            <div class="media-body">
                <div class="bg-primary rounded py-2 px-3 mb-2">
                    <p class="text-small mb-0 text-white">${message}</p>
                </div>
                <p class="small text-muted">${time}</p>
            </div>
        </div>
    `);
};

const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

$(document).ready(async () => {
    $.ajax({
        url: 'http://localhost:4000/start',
        type: 'post',
        data: {
            userID
        },
        success: addSenderMessages,
        error() {
            alert('Could not retrieve messages.');
        },
    });
})

$('#message').submit(async (e) => {
    e.preventDefault();

    const message = $('#message-input').val();
    if (!message) {
        return false;
    }
    $('#message-input').val('');

    addRecieverMessage(message, formatDate(new Date()));

    $.ajax({
        url: 'http://localhost:4000/message',
        type: 'post',
        data: {
            userID,
            message,
        },
        success: addSenderMessages,
        error() {
            alert('Could not retrieve messages.');
        },
    });
});
