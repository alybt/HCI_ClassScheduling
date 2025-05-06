document.addEventListener('DOMContentLoaded', function() {
    // Initialize chat components
    initializeChatLauncher();
    initializeChatList();
    initializeChat();
});

/**
 * Initialize the chat launcher button
 */
function initializeChatLauncher() {
    const chatLauncher = document.querySelector('.chat-launcher');
    
    if (!chatLauncher) return;
    
    chatLauncher.addEventListener('click', function() {
        const chatList = document.querySelector('.chat-list');
        const chatContainer = document.querySelector('.chat-container');
        
        // If chat is already open, close it
        if (chatContainer && chatContainer.classList.contains('open')) {
            chatContainer.classList.remove('open');
            return;
        }
        
        // Show chat list
        if (chatList) {
            chatList.classList.toggle('visible');
        }
    });
}

/**
 * Initialize the chat list
 */
function initializeChatList() {
    const chatListItems = document.querySelectorAll('.chat-list-item');
    
    if (!chatListItems.length) return;
    
    chatListItems.forEach(item => {
        item.addEventListener('click', function() {
            // Get chat data
            const chatId = this.getAttribute('data-chat-id');
            const chatName = this.querySelector('.chat-name').textContent.trim();
            
            // Hide chat list
            const chatList = document.querySelector('.chat-list');
            if (chatList) {
                chatList.classList.remove('visible');
            }
            
            // Open chat with this contact
            openChat(chatId, chatName);
            
            // Mark as active
            chatListItems.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
            
            // Remove unread indicator if exists
            const unreadCount = this.querySelector('.unread-count');
            if (unreadCount) {
                unreadCount.remove();
            }
        });
    });
    
    // Initialize search functionality
    const searchInput = document.querySelector('.chat-list-search input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            chatListItems.forEach(item => {
                const chatName = item.querySelector('.chat-name').textContent.toLowerCase();
                const lastMessage = item.querySelector('.last-message').textContent.toLowerCase();
                
                if (chatName.includes(searchTerm) || lastMessage.includes(searchTerm)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
}

/**
 * Initialize the chat container
 */
function initializeChat() {
    const chatHeader = document.querySelector('.chat-header');
    
    if (!chatHeader) return;
    
    // Toggle chat open/close when clicking on header
    chatHeader.addEventListener('click', function(e) {
        // Don't toggle if clicking on action buttons
        if (e.target.closest('.chat-actions')) return;
        
        const chatContainer = document.querySelector('.chat-container');
        if (chatContainer) {
            chatContainer.classList.toggle('open');
        }
    });
    
    // Close chat button
    const closeBtn = document.querySelector('.chat-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            const chatContainer = document.querySelector('.chat-container');
            if (chatContainer) {
                chatContainer.classList.remove('open');
            }
        });
    }
    
    // Send message functionality
    const sendBtn = document.querySelector('.send-btn');
    const messageInput = document.querySelector('.message-input');
    
    if (sendBtn && messageInput) {
        // Send on button click
        sendBtn.addEventListener('click', function() {
            sendMessage();
        });
        
        // Send on Enter key
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
}

/**
 * Open chat with a specific contact
 * @param {string} chatId - The ID of the chat/contact
 * @param {string} chatName - The name of the contact
 */
function openChat(chatId, chatName) {
    // Check if chat container exists, if not create it
    let chatContainer = document.querySelector('.chat-container');
    
    if (!chatContainer) {
        chatContainer = createChatContainer();
        document.body.appendChild(chatContainer);
        initializeChat();
    }
    
    // Update chat header with contact name
    const headerTitle = chatContainer.querySelector('.chat-header h3');
    if (headerTitle) {
        headerTitle.textContent = chatName;
    }
    
    // Set chat ID as data attribute
    chatContainer.setAttribute('data-chat-id', chatId);
    
    // Clear existing messages
    const chatBody = chatContainer.querySelector('.chat-body');
    if (chatBody) {
        chatBody.innerHTML = '';
    }
    
    // Load messages for this chat
    loadChatMessages(chatId, chatBody);
    
    // Open the chat
    chatContainer.classList.add('open');
}

/**
 * Create chat container if it doesn't exist
 * @returns {HTMLElement} The chat container element
 */
function createChatContainer() {
    const chatContainer = document.createElement('div');
    chatContainer.className = 'chat-container';
    chatContainer.innerHTML = `
        <div class="chat-header">
            <div class="chat-header-left">
                <div class="status-indicator"></div>
                <h3>Chat</h3>
            </div>
            <div class="chat-actions">
                <button class="chat-minimize-btn" title="Minimize">
                    <i class="fas fa-minus"></i>
                </button>
                <button class="chat-close-btn" title="Close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
        <div class="chat-body">
            <!-- Messages will be loaded here -->
        </div>
        <div class="chat-footer">
            <button class="attachment-btn" title="Add Attachment">
                <i class="fas fa-paperclip"></i>
            </button>
            <input type="text" class="message-input" placeholder="Type a message...">
            <button class="send-btn" title="Send Message">
                <i class="fas fa-paper-plane"></i>
            </button>
        </div>
    `;
    
    return chatContainer;
}

/**
 * Load chat messages for a specific chat
 * @param {string} chatId - The ID of the chat
 * @param {HTMLElement} chatBody - The chat body element to append messages to
 */
function loadChatMessages(chatId, chatBody) {
    // In a real application, this would fetch messages from a server
    // For demo purposes, we'll use dummy data
    
    // Add a date divider
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    
    const dateDivider = document.createElement('div');
    dateDivider.className = 'message-divider';
    dateDivider.innerHTML = `<span>${dateStr}</span>`;
    chatBody.appendChild(dateDivider);
    
    // Sample messages based on chatId
    let messages = [];
    
    if (chatId === 'teacher-1') {
        messages = [
            {
                sender: 'Prof. John Doe',
                content: 'Good morning! I wanted to check if the CS 201 class schedule has been finalized for next semester?',
                time: '9:30 AM',
                type: 'received'
            },
            {
                sender: 'You',
                content: 'Good morning Professor! Yes, the schedule has been finalized. CS 201 will be on Mondays and Wednesdays from 9:00 AM to 10:30 AM in CCS Lab 1.',
                time: '9:35 AM',
                type: 'sent'
            },
            {
                sender: 'Prof. John Doe',
                content: 'Perfect, thank you! Also, could you please let me know if there are any changes to the course outline requirements?',
                time: '9:38 AM',
                type: 'received'
            },
            {
                sender: 'You',
                content: 'The requirements remain the same as last semester. The deadline for submission is June 15th. Would you like me to send you the template?',
                time: '9:42 AM',
                type: 'sent'
            }
        ];
    } else if (chatId === 'teacher-2') {
        messages = [
            {
                sender: 'Prof. Jane Smith',
                content: 'Hello! I noticed there might be a room conflict for my CC 101 class next Tuesday.',
                time: '11:15 AM',
                type: 'received'
            },
            {
                sender: 'You',
                content: 'Hi Professor Smith. Let me check the room assignments for next Tuesday.',
                time: '11:20 AM',
                type: 'sent'
            },
            {
                sender: 'You',
                content: 'You're right, there was a scheduling conflict. I've reassigned your class to LR 2 instead of LR 1. Does that work for you?',
                time: '11:25 AM',
                type: 'sent'
            },
            {
                sender: 'Prof. Jane Smith',
                content: 'Yes, LR 2 works perfectly. Thank you for the quick resolution!',
                time: '11:28 AM',
                type: 'received'
            }
        ];
    } else if (chatId === 'student-1') {
        messages = [
            {
                sender: 'Jane Smith (Student)',
                content: 'Hello Admin, I submitted a room reservation request for our group project meeting. Could you please check the status?',
                time: '2:45 PM',
                type: 'received'
            },
            {
                sender: 'You',
                content: 'Hello Jane, I can see your reservation request. It's currently pending approval from Prof. Johnson since it's for his course project.',
                time: '2:50 PM',
                type: 'sent'
            },
            {
                sender: 'Jane Smith (Student)',
                content: 'I see. Do you know how long the approval process usually takes?',
                time: '2:52 PM',
                type: 'received'
            },
            {
                sender: 'You',
                content: 'Usually within 24 hours. I'll send a reminder to Prof. Johnson and let you know once it's approved.',
                time: '2:55 PM',
                type: 'sent'
            },
            {
                sender: 'Jane Smith (Student)',
                content: 'Thank you so much for your help!',
                time: '2:56 PM',
                type: 'received'
            }
        ];
    } else {
        // Default messages
        messages = [
            {
                sender: 'System',
                content: 'Welcome to the chat! No previous messages found.',
                time: '12:00 PM',
                type: 'received'
            }
        ];
    }
    
    // Append messages to chat body
    messages.forEach(msg => {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${msg.type}`;
        
        let messageContent = '';
        if (msg.type === 'received') {
            messageContent += `<div class="sender">${msg.sender}</div>`;
        }
        
        messageContent += `
            <div class="content">${msg.content}</div>
            <div class="time">${msg.time}</div>
        `;
        
        messageEl.innerHTML = messageContent;
        chatBody.appendChild(messageEl);
    });
    
    // Scroll to bottom
    chatBody.scrollTop = chatBody.scrollHeight;
}

/**
 * Send a new message in the current chat
 */
function sendMessage() {
    const messageInput = document.querySelector('.message-input');
    const chatBody = document.querySelector('.chat-body');
    
    if (!messageInput || !chatBody || !messageInput.value.trim()) return;
    
    // Check if chat container exists and is open
    const chatContainer = document.querySelector('.chat-container');
    if (!chatContainer || !chatContainer.classList.contains('open')) return;
    
    const messageContent = messageInput.value.trim();
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = 'message sent';
    
    // Get current time
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    
    messageEl.innerHTML = `
        <div class="content">${messageContent}</div>
        <div class="time">${timeStr}</div>
    `;
    
    // Add message to chat
    chatBody.appendChild(messageEl);
    
    // Clear input
    messageInput.value = '';
    
    // Scroll to bottom
    chatBody.scrollTop = chatBody.scrollHeight;
    
    // Simulate reply after a delay (for demo purposes)
    setTimeout(() => {
        simulateReply(chatBody);
    }, 1000 + Math.random() * 2000);
}

/**
 * Simulate a reply message (for demo purposes)
 * @param {HTMLElement} chatBody - The chat body element
 */
function simulateReply(chatBody) {
    const chatContainer = document.querySelector('.chat-container');
    
    if (!chatContainer) return;
    
    const chatId = chatContainer.getAttribute('data-chat-id');
    const chatHeaderTitle = chatContainer.querySelector('.chat-header h3');
    
    if (!chatHeaderTitle) return;
    
    const chatName = chatHeaderTitle.textContent;
    
    // Create typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message received typing-indicator';
    typingIndicator.innerHTML = `
        <div class="sender">${chatName}</div>
        <div class="content">typing...</div>
    `;
    
    chatBody.appendChild(typingIndicator);
    chatBody.scrollTop = chatBody.scrollHeight;
    
    // Sample replies based on chatId
    let replies = [];
    
    if (chatId === 'teacher-1') {
        replies = [
            'Yes, please send me the template when you have a chance.',
            'Thank you for the information. I'll make sure to prepare accordingly.',
            'Is there anything else I should know about the upcoming semester?',
            'I appreciate your help with this matter.'
        ];
    } else if (chatId === 'teacher-2') {
        replies = [
            'Great! I'll make a note of the room change.',
            'Do you know if the room has the projector I requested?',
            'Thank you for addressing this so quickly.',
            'Is there anything else I need to do regarding this change?'
        ];
    } else if (chatId === 'student-1') {
        replies = [
            'No problem, I appreciate your assistance!',
            'Do you know if the room has whiteboards available?',
            'How many students can the room accommodate?',
            'Thanks again for your help with this reservation.'
        ];
    } else {
        replies = [
            'Thank you for your response.',
            'I understand, thanks for clarifying.',
            'That makes sense, I appreciate the information.',
            'Got it, thanks for letting me know.'
        ];
    }
    
    // Select a random reply
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    
    // Remove typing indicator and add actual reply after a delay
    setTimeout(() => {
        // Remove typing indicator
        typingIndicator.remove();
        
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = 'message received';

        // Get current time
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

        messageEl.innerHTML = `<div class="sender">${chatName}</div><div class="content">${randomReply}</div><div class="time">${timeStr}</div>`;

        
        // Add message to chat
        chatBody.appendChild(messageEl);
        
        // Scroll to bottom
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 1500);
}
