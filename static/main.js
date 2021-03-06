const userID = Math.random().toString(36).substring(7);

const $chat = $('#chat');

const audioQueue = [];
const audioDelay = 200;

setInterval(() => {
  if (audioQueue.length > 0) {
    const audio = audioQueue[0];
    if (audio.currentTime == 0) {
      audio.play().catch((error) => {});
    } else if (audio.ended) {
      audioQueue.shift();
    }
  }
}, audioDelay);

const preDelay = 0;
const interDelay = 0;

const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

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
      <img src="./chatbot.png" width="50" class="rounded-circle" />
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
  for (const payload of response) {
    addSenderMessage(payload.message, formatDate(new Date()));
    audioQueue.push(new Audio(payload.src));
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

$(document).ready(async () => {
  $.ajax({
    url: '/start',
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
    url: '/message',
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
