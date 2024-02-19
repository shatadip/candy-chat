// /public/chat.js
socket.on('connect', function () {
    console.log('Connected to server');
    let storedHandle = localStorage.getItem('handle');
    if (storedHandle) {
        handle.value = storedHandle;
    } else {
        // Generate a unique handle and store it in localStorage
        let uniqueHandle = generateHandle();
        handle.value = uniqueHandle;
        localStorage.setItem('handle', uniqueHandle);
    }

    // Load stored messages from localStorage
    let storedMessages = localStorage.getItem('messages');
    if (storedMessages) {
        output.innerHTML = storedMessages;
    }
});

// Query DOM

let message = document.getElementById('message'),
    handle = document.getElementById('handle'),
    btn = document.getElementById('send'),
    output = document.getElementById('output'),
    feedback = document.getElementById('feedback');

message.focus();
// Generate a unique handle

// Array of candies for random selection
const candies = [
    'Snickers', 'Twizzlers', 'Skittles', 'M&Ms', 'KitKat', 'Chocolate', 'Lollipop', 'Jellybean',
    'Gummybear', 'Sourpatch', 'Zoot', 'Starburst', 'JellyRoll', 'Razorback', 'SugarDaddy', 'Gummyworm',
    'Sherbet', 'Liquorice', 'CottonCandy', 'Taffy', 'Fudge', 'Gummi', 'Sours', 'Peppermint',
    'Cherry', 'Lemon', 'Strawberry', 'Watermelon', 'BlueRaspberry', 'Grape', 'Bubblegum', 'BubblegumChew',
    'Mint', 'Menthol', 'Cinnamon', 'Banana', 'Orange', 'Lime', 'Pineapple', 'Peach', 'Coconut',
    'ChocolateChip', 'Almond', 'Cashew', 'Pecan', 'Nutmeg', 'CinnamonRoll', 'Macaroon', 'Marshmallow',
    'Cookie', 'Brownie', 'Biscuit', 'Croissant', 'Flan', 'Custard', 'Cream', 'IceCream', 'Pudding',
    'Honeydew', 'Pineapple', 'Mango', 'Apple', 'Orange', 'Peach', 'Grape', 'Watermelon', 'Melon',
    'Berry', 'Raspberry', 'Strawberry', 'Cherry', 'Blueberry', 'Blackberry', 'Cranberry', 'Raspberry',
    'Lemon', 'Lime', 'Orange', 'Peach', 'Pineapple', 'Mango', 'Banana', 'Grapefruit', 'Kiwi',
    'Papaya', 'Passionfruit', 'Pomegranate', 'Tangerine', 'Plum', 'Apricot', 'Blackcurrant', 'Boysenberry',
    'Cantaloupe', 'Cucumber', 'Elderberry', 'Fig', 'Gooseberry', 'Honeydew', 'Kumquat', 'Lemon', 'Lime',
    'Loquat', 'Mandarin', 'Melon', 'Mulberry', 'Nectarine', 'Papaya', 'Peach', 'Pear', 'Pineapple',
    'Plum', 'Pomegranate', 'Quince', 'Raspberry', 'Rhubarb', 'Strawberry', 'Tangerine', 'Tomato',
    'Watermelon'
  ];
// Function to generate a random candy name
function getRandomCandy() {
    const index = Math.floor(Math.random() * candies.length);
    return candies[index];
}

// Function to generate a random  4-digit number
function getRandomNumber() {
    return Math.floor(1000 + Math.random() * 9000);
}

// Generate a unique handle and set it as the value of the handle input field
const uniqueHandle = `${getRandomCandy()}-${getRandomNumber()}`;
document.getElementById('handle').value = uniqueHandle;

// Emit events

btn.addEventListener('click', function () {
    console.log('Button clicked');
    sendMessage();
});

message.addEventListener('keypress', () => {
    socket.emit('typing', handle.value);
});

message.addEventListener('keyup', () => {
    if (message.value === '') {
        socket.emit('stop typing', handle.value);
    }
});

// Add keydown event listener
message.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default action (form submission)
        sendMessage();
    }
});

function sendMessage() {
    socket.emit('chat', {
        message: message.value,
        handle: handle.value
    });
    message.value = "";
    message.focus();
    socket.emit('stop typing', handle.value); // Emit stop typing event
}

// Listen for stop typing event
socket.on('stop typing', (data) => {
    feedback.innerHTML = '';
});

// Listen for events
socket.on('chat', (data) => {
    feedback.innerHTML = '';
    console.log('Received chat message:', data);
    // Append the new message to the output and store it in localStorage
    let newMessage = '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
    output.innerHTML += newMessage;
    localStorage.setItem('messages', output.innerHTML);
    // Auto-scroll to the bottom of the output div
    // Use setTimeout to ensure that the new content is rendered before scrolling
    setTimeout(() => {
        output.scrollTop = output.scrollHeight;
    }, 1000);
});

socket.on('typing', (data) => {
    feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});
