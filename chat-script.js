document.addEventListener('DOMContentLoaded', () => {
    const messagesContainer = document.getElementById('messages');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const imageGenBtn = document.getElementById('image-gen-btn');
    const newChatBtn = document.querySelector('.new-chat-btn');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');

    // Sidebar toggle for mobile
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Auto-resize textarea
    chatInput.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        if (this.value === '') this.style.height = 'auto';
    });

    // Send message on Enter (but Shift+Enter for newline)
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleUserMessage();
        }
    });

    sendBtn.addEventListener('click', handleUserMessage);

    // Image Generation Button
    imageGenBtn.addEventListener('click', () => {
        const prompt = chatInput.value.trim();
        if (!prompt) {
            alert('Please describe the image you want to generate first.');
            return;
        }
        addMessage(prompt, 'user');
        chatInput.value = '';
        chatInput.style.height = 'auto';
        generateImage(prompt);
    });

    newChatBtn.addEventListener('click', () => {
        // Clear chat (visual only for demo)
        messagesContainer.innerHTML = `
            <div class="message">
                <div class="avatar ai-avatar"><i class="fa-solid fa-robot"></i></div>
                <div class="content">
                    <p>Hello! I'm your EduAI tutor. I can help you solve problems, explain complex topics, or generate images to visualize concepts. What are we learning today?</p>
                </div>
            </div>
        `;
    });

    function handleUserMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        chatInput.value = '';
        chatInput.style.height = 'auto';

        // Scroll to bottom
        scrollToBottom();

        // Simulate AI thinking and response
        showTypingIndicator();

        // Determine if image request or text request
        const lowerText = text.toLowerCase();
        if (lowerText.startsWith('generate image') || lowerText.startsWith('draw') || lowerText.includes('image of')) {
            generateImage(text);
        } else {
            generateTextResponse(text);
        }
    }

    function addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);

        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('avatar', sender === 'user' ? 'user-avatar' : 'ai-avatar');
        avatarDiv.innerHTML = sender === 'user' ? '<i class="fa-solid fa-user"></i>' : '<i class="fa-solid fa-robot"></i>';

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('content');

        if (typeof content === 'string') {
            contentDiv.innerHTML = `<p>${content}</p>`;
        } else {
            contentDiv.appendChild(content); // For image elements
        }

        // Order depends on sender (controlled by CSS row-reverse for user)
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);

        messagesContainer.appendChild(messageDiv);
        scrollToBottom();
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.classList.add('message');
        typingDiv.innerHTML = `
            <div class="avatar ai-avatar"><i class="fa-solid fa-robot"></i></div>
            <div class="content">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async function generateImage(prompt) {
        setTimeout(() => {
            removeTypingIndicator();

            let cleanPrompt = prompt.replace(/generate image|draw|image of/gi, '').trim();
            // Fallback for empty prompts
            if (!cleanPrompt) {
                if (prompt.trim().length > 0) cleanPrompt = prompt.trim();
                else {
                    addMessage("Please describe what image you want me to generate.", 'ai');
                    return;
                }
            }

            // Primary: Pollinations AI
            // Secondary: LoremFlickr (Robust keyword fallback)
            const seed = Math.floor(Math.random() * 10000);
            const primaryUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=800&height=600&nologo=true&seed=${seed}`;

            // For backup, replace spaces with commas for keywords
            const keywords = cleanPrompt.split(' ').join(',');
            const backupUrl = `https://loremflickr.com/800/600/${encodeURIComponent(keywords)}/all`;

            const imgContainer = document.createElement('div');

            // Initial Caption
            const caption = document.createElement('p');
            caption.innerHTML = `Generating image for: "<em>${cleanPrompt}</em>"...`;
            caption.style.marginBottom = '0.5rem';
            imgContainer.appendChild(caption);

            // Try Loading Primary
            const img = new Image();
            img.classList.add('generated-image');
            img.loading = 'lazy';
            img.alt = cleanPrompt;
            img.src = primaryUrl;

            img.onload = function () {
                // Success
                caption.innerHTML = `Here is a generated image for: "<em>${cleanPrompt}</em>"`;
                imgContainer.appendChild(img);
                scrollToBottom();
            };

            img.onerror = function () {
                // Primary Failed - Try Backup
                console.log("Primary Pollinations image failed. Trying LoremFlickr backup.");
                caption.innerHTML = `Generating alternative visual for: "<em>${cleanPrompt}</em>"...`;

                const backupImg = new Image();
                backupImg.classList.add('generated-image');
                backupImg.loading = 'lazy';
                backupImg.alt = cleanPrompt;
                backupImg.src = backupUrl;

                backupImg.onload = function () {
                    caption.innerHTML = `Here is a visual for: "<em>${cleanPrompt}</em>"`;
                    imgContainer.appendChild(backupImg);
                    scrollToBottom();
                };

                backupImg.onerror = function () {
                    // Both Failed
                    caption.innerHTML = `<span style="color: #ef4444;"><i class="fa-solid fa-circle-exclamation"></i> Sorry, I couldn't generate that image right now. Please check your internet connection.</span>`;
                    scrollToBottom();
                };
            };

            addMessage(imgContainer, 'ai');

        }, 1500); // Simulate processing time
    }

    function generateTextResponse(query) {
        setTimeout(() => {
            removeTypingIndicator();
            let response = "";
            const q = query.toLowerCase();

            // Simple heuristic response logic
            if (q.includes('hello') || q.includes('hi')) {
                response = "Hello! Ready to learn? Ask me about math, science, history, or ask me to generate an image!";
            } else if (q.includes('math') || q.includes('algebra') || q.includes('equation')) {
                response = "Mathematics is a great subject. I can help you solve equations, understand calculus, or practice geometry. Please enter the specific problem you'd like me to explain.";
            } else if (q.includes('science') || q.includes('physics') || q.includes('chemistry')) {
                response = "Science helps us understand the world. Whether it's Newton's laws or the Periodic table, I can clear up your doubts. What concept are you stuck on?";
            } else if (q.includes('history')) {
                response = "History is full of fascinating stories. I can explain the causes of major wars, the rise of civilizations, or biographies of historical figures.";
            } else if (q.includes('subscription') || q.includes('price') || q.includes('cost')) {
                response = "You are currently on the 1-month free trial! After that, our premium plan is just $10/month. You can manage your subscription on the Pricing page.";
            } else if (q.includes('thank')) {
                response = "You're welcome! Happy to help. Keep the questions coming!";
            } else {
                // Generic "Smart" response simulation
                response = `That's an interesting question about "${query}". To explain this properly: <br><br>
                1. <strong>Concept:</strong> This relates to core principles in its field.<br>
                2. <strong>Application:</strong> We see this applied in various real-world scenarios.<br>
                3. <strong>Summary:</strong> Effectively, it bridges the gap between theory and practice.<br><br>
                Would you like me to go into more specific detail or generate a diagram for this?`;
            }

            addMessage(response, 'ai');
        }, 1500);
    }
});
