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
    // Add a date divider
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    
    const dateDivider = document.createElement('div');
    dateDivider.className = 'message-divider';
    dateDivider.innerHTML = `<span>${dateStr}</span>`;
    chatBody.appendChild(dateDivider);
    
    // Sample messages based on chatId
    let messages = [];
    
    if (chatId === 'admin-1') {
        messages = [
            {
                sender: 'Admin',
                content: 'Good morning Professor! I wanted to inform you that the room for your CS 201 class has been changed to CCS Lab 1 for next Tuesday.',
                time: '9:30 AM',
                type: 'received'
            },
            {
                sender: 'You',
                content: 'Good morning. Thank you for letting me know. Is there any specific reason for the change?',
                time: '9:35 AM',
                type: 'sent'
            },
            {
                sender: 'Admin',
                content: 'Yes, there was a scheduling conflict with another class that needed the lab equipment. CCS Lab 1 has all the same equipment you requested.',
                time: '9:38 AM',
                type: 'received'
            },
            {
                sender: 'You',
                content: 'That works for me. I\'ll make sure to inform my students about the room change.',
                time: '9:42 AM',
                type: 'sent'
            }
        ];
    } else if (chatId === 'student-1') {
        messages = [
            {
                sender: 'Jane Smith',
                content: 'Hello Professor, I wanted to ask if we could schedule a consultation about the final project requirements?',
                time: '11:15 AM',
                type: 'received'
            },
            {
                sender: 'You',
                content: 'Hello Jane, yes that would be fine. I have office hours tomorrow from 1-3 PM. Would that work for you?',
                time: '11:20 AM',
                type: 'sent'
            },
            {
                sender: 'Jane Smith',
                content: 'That works perfectly. I'll come by your office at 1:30 PM. Thank you!',
                time: '11:25 AM',
                type: 'received'
            },
            {
                sender: 'You',
                content: 'Great, I\'ll see you then. Please bring your project outline so we can discuss it in detail.',
                time: '11:28 AM',
                type: 'sent'
            }
        ];
    } else if (chatId === 'student-2') {
        messages = [
            {
                sender: 'John Doe',
                content: 'Professor, I submitted my assignment through the online portal but I\'m not sure if it went through correctly. Could you please check?',
                time: '2:45 PM',
                type: 'received'
            },
            {
                sender: 'You',
                content: 'Hello John, let me check the system for you.',
                time: '2:50 PM',
                type: 'sent'
            },
            {
                sender: 'You',
                content: 'I can confirm that your assignment was successfully submitted. The timestamp shows 2:30 PM today.',
                time: '2:55 PM',
                type: 'sent'
            },
            {
                sender: 'John Doe',
                content: 'Thank you for checking! I was worried because I didn't receive a confirmation email.',
                time: '2:56 PM',
                type: 'received'
            },
            {
                sender: 'You',
                content: 'The system sometimes delays sending confirmation emails. But your submission is definitely in the system and on time.',
                time: '3:00 PM',
                type: 'sent'
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
    const chatId = chatContainer.getAttribute('data-chat-id');
    const chatName = chatContainer.querySelector('.chat-header h3').textContent;
    
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
    
    if (chatId === 'admin-1') {
        replies = [
            'You\'re welcome! Let me know if you need anything else.',
            'I\'ll update the room information in the system so students can see it as well.',
            'Would you like me to send an announcement to the class about the room change?',
            'The projector in CCS Lab 1 was also recently upgraded, so you\'ll have better resolution for your presentations.'
        ];
    } else if (chatId === 'student-1') {
        replies = [
            'Thank you, Professor! I\'ll be there with my outline.',
            'I have a few questions about the required references for the project as well.',
            'Is it okay if I bring my project partner along?',
            'I really appreciate your time and guidance.'
        ];
    } else if (chatId === 'student-2') {
        replies = [
            'That\'s a relief! Thank you for checking.',
            'Should I be concerned if this happens with future assignments?',
            'I\'ll make sure to take screenshots of my submissions from now on just in case.',
            'Thanks again for your quick response!'
        ];
    } else {
        replies = [
            'Thank you for your message.',
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
        
        messageEl.innerHTML = `
            <div class="sender">${chatName}</div>
            <div class="content">${randomReply}</div>
            <div class="time">${timeStr}</div>
        `;
        
        // Add message to chat
        chatBody.appendChild(messageEl);
        
        // Scroll to bottom
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 1500);
}
