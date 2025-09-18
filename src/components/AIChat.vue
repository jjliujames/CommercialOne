<template>
    <div class="ai-chat-container">
        <!-- Floating Chat Button -->
        <button v-if="!isOpen" @click="toggleChat" class="floating-chat-btn"
            :class="{ 'has-notification': hasUnreadSuggestions }">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 21l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
            </svg>
            <span v-if="hasUnreadSuggestions" class="notification-dot"></span>
        </button>

        <!-- Chat Interface -->
        <div v-if="isOpen" class="chat-interface">
            <!-- Chat Header -->
            <div class="chat-header">
                <div class="flex items-center space-x-3">
                    <div class="ai-avatar">
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-sm font-semibold text-white">TD AI Assistant</h3>
                        <p class="text-xs text-green-100">{{ getContextMessage() }}</p>
                    </div>
                </div>
                <button @click="toggleChat" class="text-green-100 hover:text-white">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Chat Messages -->
            <div class="chat-messages" ref="messagesContainer">
                <div v-for="message in messages" :key="message.id" class="message" :class="message.type">
                    <div v-if="message.type === 'ai'" class="ai-message">
                        <div class="ai-avatar-small">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <div class="message-content">
                            <div class="message-text" v-html="message.content"></div>
                            <div v-if="message.suggestions" class="suggestions">
                                <button v-for="suggestion in message.suggestions" :key="suggestion"
                                    @click="sendMessage(suggestion)" class="suggestion-btn">
                                    {{ suggestion }}
                                </button>
                            </div>
                            <div v-if="message.actions" class="action-buttons">
                                <button v-for="action in message.actions" :key="action.label"
                                    @click="handleAction(action)" class="action-btn" :class="action.type">
                                    {{ action.label }}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div v-else class="user-message">
                        <div class="message-content">
                            <div class="message-text">{{ message.content }}</div>
                        </div>
                    </div>
                    <div class="message-time">{{ formatTime(message.timestamp) }}</div>
                </div>
                <div v-if="isTyping" class="typing-indicator">
                    <div class="ai-avatar-small">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div v-if="quickActions.length > 0" class="quick-actions">
                <h4 class="text-xs font-medium text-gray-600 mb-2">Quick Actions</h4>
                <div class="grid grid-cols-2 gap-2">
                    <button v-for="action in quickActions" :key="action.label" @click="sendMessage(action.query)"
                        class="quick-action-btn">
                        <span class="text-lg">{{ action.icon }}</span>
                        <span class="text-xs">{{ action.label }}</span>
                    </button>
                </div>
            </div>

            <!-- Chat Input -->
            <div class="chat-input">
                <div class="input-container">
                    <input v-model="currentMessage" @keypress.enter="handleSendMessage"
                        placeholder="Ask about clients, risk analysis, opportunities..." class="message-input"
                        :disabled="isTyping" />
                    <button @click="handleSendMessage" :disabled="!currentMessage.trim() || isTyping" class="send-btn">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getClientById, getRMById, getRegionById, getMarketById, getMetroById } from '../data/mockData.js'

const route = useRoute()

// State
const isOpen = ref(false)
const currentMessage = ref('')
const isTyping = ref(false)
const messages = ref([])
const messagesContainer = ref(null)
const hasUnreadSuggestions = ref(true)

// Context awareness
const currentContext = computed(() => {
    const params = route.params
    return {
        view: route.name,
        metroId: params.metroId,
        marketId: params.marketId,
        regionId: params.regionId,
        rmId: params.rmId,
        clientId: params.clientId,
        relationshipId: params.relationshipId
    }
})

const contextData = computed(() => {
    const context = currentContext.value
    const data = {}

    if (context.clientId) {
        data.client = getClientById(context.clientId)
    }
    if (context.rmId) {
        data.rm = getRMById(context.rmId)
    }
    if (context.regionId) {
        data.region = getRegionById(context.regionId)
    }
    if (context.marketId) {
        data.market = getMarketById(context.marketId)
    }
    if (context.metroId) {
        data.metro = getMetroById(context.metroId)
    }

    return data
})

const quickActions = computed(() => {
    const context = currentContext.value
    const actions = []

    if (context.clientId) {
        actions.push(
            { icon: '🚨', label: 'Risk Analysis', query: 'Analyze risk flags for this client' },
            { icon: '💰', label: 'Revenue Opportunities', query: 'What revenue opportunities exist for this client?' },
            { icon: '📊', label: 'Portfolio Summary', query: 'Summarize this client\'s portfolio' },
            { icon: '🔍', label: 'Investigation', query: 'Should we investigate this client?' }
        )
    } else if (context.rmId) {
        actions.push(
            { icon: '📈', label: 'RM Performance', query: 'Analyze this RM\'s performance' },
            { icon: '🎯', label: 'Coaching Tips', query: 'What coaching recommendations do you have?' },
            { icon: '👥', label: 'Client Summary', query: 'Summarize this RM\'s client portfolio' },
            { icon: '⚠️', label: 'Risk Alerts', query: 'What are the highest risk clients in this portfolio?' }
        )
    } else {
        actions.push(
            { icon: '📊', label: 'Portfolio Overview', query: 'Give me a portfolio overview' },
            { icon: '🚨', label: 'Risk Summary', query: 'What are the main risk concerns?' },
            { icon: '💡', label: 'Opportunities', query: 'What are the best opportunities?' },
            { icon: '🎯', label: 'Action Items', query: 'What actions should I prioritize today?' }
        )
    }

    return actions
})

// Methods
const getContextMessage = () => {
    const context = currentContext.value
    const data = contextData.value

    if (data.client) {
        return `Analyzing ${data.client.name}`
    } else if (data.rm) {
        return `Reviewing ${data.rm.name}'s portfolio`
    } else if (data.region) {
        return `Regional analysis: ${data.region.name}`
    } else if (data.market) {
        return `Market insights: ${data.market.name}`
    } else if (data.metro) {
        return `Metro overview: ${data.metro.name}`
    } else {
        return 'Ready to help with portfolio analysis'
    }
}

const toggleChat = () => {
    isOpen.value = !isOpen.value
    if (isOpen.value) {
        hasUnreadSuggestions.value = false
        if (messages.value.length === 0) {
            showWelcomeMessage()
        }
        nextTick(() => {
            scrollToBottom()
        })
    }
}

const showWelcomeMessage = () => {
    const context = currentContext.value
    const data = contextData.value

    let welcomeMessage = "Hello! I'm your TD AI Assistant. I can help you with:"
    let suggestions = []

    if (data.client) {
        welcomeMessage = `I'm analyzing <strong>${data.client.name}</strong>. How can I help?`
        suggestions = ['Risk assessment', 'Revenue opportunities', 'Product recommendations', 'Investigation guidance']
    } else if (data.rm) {
        welcomeMessage = `I'm reviewing <strong>${data.rm.name}'s</strong> portfolio. What would you like to know?`
        suggestions = ['Performance analysis', 'Coaching recommendations', 'Risk alerts', 'Growth opportunities']
    } else {
        suggestions = ['Portfolio overview', 'Risk analysis', 'Market opportunities', 'Regulatory compliance']
    }

    addMessage({
        type: 'ai',
        content: welcomeMessage,
        suggestions: suggestions
    })
}

const addMessage = (message) => {
    messages.value.push({
        id: Date.now() + Math.random(),
        timestamp: new Date(),
        ...message
    })
    nextTick(() => {
        scrollToBottom()
    })
}

const scrollToBottom = () => {
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
}

const handleSendMessage = () => {
    if (!currentMessage.value.trim() || isTyping.value) return

    sendMessage(currentMessage.value)
    currentMessage.value = ''
}

const sendMessage = async (message) => {
    // Add user message
    addMessage({
        type: 'user',
        content: message
    })

    // Show typing indicator
    isTyping.value = true

    // Simulate AI response delay
    setTimeout(() => {
        const response = generateAIResponse(message)
        addMessage(response)
        isTyping.value = false
    }, 1000 + Math.random() * 2000)
}

const generateAIResponse = (userMessage) => {
    const context = currentContext.value
    const data = contextData.value
    const message = userMessage.toLowerCase()

    // Risk analysis responses
    if (message.includes('risk') || message.includes('flags')) {
        if (data.client) {
            return {
                type: 'ai',
                content: `<strong>Risk Analysis for ${data.client.name}:</strong><br/>
        • Current Risk Score: <span class="text-red-600 font-bold">7.8/10</span><br/>
        • Primary Concerns: High cash transactions, crypto activity<br/>
        • Recent Alerts: 12 in last 90 days<br/>
        • Recommendation: Enhanced monitoring required`,
                actions: [
                    { label: 'Create Investigation Case', type: 'primary', action: 'create_case' },
                    { label: 'View Transaction History', type: 'secondary', action: 'view_transactions' }
                ]
            }
        } else {
            return {
                type: 'ai',
                content: `<strong>Portfolio Risk Summary:</strong><br/>
        • High Risk Clients: 23 requiring attention<br/>
        • Critical Alerts: 8 today<br/>
        • SLA Performance: 84% (below 90% target)<br/>
        • Top Risk Types: Crypto transactions, structuring patterns`,
                suggestions: ['Show high-risk clients', 'Generate risk report', 'Review alert trends']
            }
        }
    }

    // Opportunity analysis
    if (message.includes('opportunity') || message.includes('revenue')) {
        if (data.client) {
            return {
                type: 'ai',
                content: `<strong>Revenue Opportunities for ${data.client.name}:</strong><br/>
        • FX Services: <span class="text-green-600 font-bold">$450K potential</span><br/>
        • Trade Finance: <span class="text-green-600 font-bold">$280K potential</span><br/>
        • Treasury Management: Product gap identified<br/>
        • Current Product Penetration: 68%`,
                actions: [
                    { label: 'Schedule Product Discussion', type: 'primary', action: 'schedule_meeting' },
                    { label: 'Generate Proposal', type: 'secondary', action: 'generate_proposal' }
                ]
            }
        } else {
            return {
                type: 'ai',
                content: `<strong>Portfolio Opportunities:</strong><br/>
        • Total Revenue Potential: <span class="text-green-600 font-bold">$12.3M</span><br/>
        • Top Product Gaps: FX Services (38% gap), Trade Finance (42% gap)<br/>
        • High-Value Prospects: 15 clients with >$1M potential<br/>
        • Cross-sell Success Rate: 34% (target: 50%)`,
                suggestions: ['Show opportunity pipeline', 'Product gap analysis', 'Client prioritization']
            }
        }
    }

    // Performance and coaching
    if (message.includes('performance') || message.includes('coaching')) {
        if (data.rm) {
            return {
                type: 'ai',
                content: `<strong>Performance Analysis for ${data.rm.name}:</strong><br/>
        • Overall Score: <span class="text-blue-600 font-bold">87/100</span><br/>
        • Strengths: Client retention (98%), risk management<br/>
        • Development Areas: Cross-selling (-16% vs target)<br/>
        • Recommended Training: Treasury solutions certification`,
                actions: [
                    { label: 'Create Development Plan', type: 'primary', action: 'create_plan' },
                    { label: 'Schedule Coaching Session', type: 'secondary', action: 'schedule_coaching' }
                ]
            }
        }
    }

    // Investigation guidance
    if (message.includes('investigate') || message.includes('investigation')) {
        return {
            type: 'ai',
            content: `<strong>Investigation Guidance:</strong><br/>
      Based on the risk profile and transaction patterns, I recommend:<br/>
      • Priority Level: <span class="text-orange-600 font-bold">Medium-High</span><br/>
      • Estimated Timeline: 3-5 business days<br/>
      • Required Documents: Transaction history, beneficial ownership<br/>
      • Regulatory Considerations: BSA/AML compliance review needed`,
            actions: [
                { label: 'Create Investigation Case', type: 'primary', action: 'create_investigation' },
                { label: 'Request Documents', type: 'secondary', action: 'request_docs' }
            ]
        }
    }

    // Default responses
    const defaultResponses = [
        {
            type: 'ai',
            content: `I can help you analyze that. Based on current data:<br/>
      • Portfolio Value: $485M across 156 clients<br/>
      • Risk Score Distribution: 23% high-risk, 45% medium-risk<br/>
      • Revenue Growth: +12.5% YoY<br/>
      What specific area would you like to explore?`,
            suggestions: ['Risk details', 'Growth opportunities', 'Client analysis', 'Compliance status']
        },
        {
            type: 'ai',
            content: `Let me analyze the current situation:<br/>
      • Active Alerts: 47 requiring attention<br/>
      • Top Performers: 8 RMs exceeding targets<br/>
      • Compliance Status: 94% BSA/AML score<br/>
      • Opportunity Pipeline: $12.3M potential revenue`,
            suggestions: ['Show alert details', 'RM performance', 'Opportunity breakdown', 'Compliance report']
        }
    ]

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
}

const handleAction = (action) => {
    // Handle different action types
    switch (action.action) {
        case 'create_case':
            addMessage({
                type: 'ai',
                content: '✅ Investigation case created successfully. Case #INV-2024-1205 has been assigned to the risk team.'
            })
            break
        case 'schedule_meeting':
            addMessage({
                type: 'ai',
                content: '📅 Meeting request sent to client and product specialist. Proposed times have been shared.'
            })
            break
        case 'generate_proposal':
            addMessage({
                type: 'ai',
                content: '📄 Product proposal generated and saved to client folder. Ready for RM review and customization.'
            })
            break
        default:
            addMessage({
                type: 'ai',
                content: `Action "${action.label}" has been initiated. You'll receive an update shortly.`
            })
    }
}

const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    })
}

// Watch for route changes to update context
watch(() => route.path, () => {
    if (isOpen.value && messages.value.length > 0) {
        addMessage({
            type: 'ai',
            content: `Context updated. ${getContextMessage()}. How can I help with this view?`,
            suggestions: quickActions.value.map(action => action.query).slice(0, 3)
        })
    }
})

onMounted(() => {
    // Show initial notification
    setTimeout(() => {
        hasUnreadSuggestions.value = true
    }, 3000)
})
</script>

<style scoped>
.ai-chat-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
}

.floating-chat-btn {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #00A651, #008542);
    border-radius: 50%;
    color: white;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(0, 166, 81, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    position: relative;
}

.floating-chat-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 25px rgba(0, 166, 81, 0.4);
}

.floating-chat-btn.has-notification {
    animation: pulse 2s infinite;
}

.notification-dot {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 12px;
    height: 12px;
    background: #ff4444;
    border-radius: 50%;
    border: 2px solid white;
}

.chat-interface {
    width: 380px;
    height: 600px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid #e5e7eb;
}

.chat-header {
    background: linear-gradient(135deg, #00A651, #008542);
    color: white;
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.ai-avatar {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.ai-avatar-small {
    width: 24px;
    height: 24px;
    background: linear-gradient(135deg, #00A651, #008542);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;
}

.chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.message {
    display: flex;
    flex-direction: column;
}

.ai-message {
    display: flex;
    gap: 8px;
    align-items: flex-start;
}

.user-message {
    align-items: flex-end;
}

.user-message .message-content {
    background: #00A651;
    color: white;
    margin-left: 40px;
}

.message-content {
    background: #f3f4f6;
    padding: 12px 16px;
    border-radius: 12px;
    max-width: 85%;
}

.message-text {
    font-size: 14px;
    line-height: 1.4;
}

.message-time {
    font-size: 11px;
    color: #6b7280;
    margin-top: 4px;
    text-align: right;
}

.ai-message .message-time {
    text-align: left;
    margin-left: 32px;
}

.suggestions {
    margin-top: 8px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.suggestion-btn {
    background: #e5e7eb;
    border: 1px solid #d1d5db;
    border-radius: 20px;
    padding: 4px 12px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
}

.suggestion-btn:hover {
    background: #00A651;
    color: white;
    border-color: #00A651;
}

.action-buttons {
    margin-top: 8px;
    display: flex;
    gap: 8px;
}

.action-btn {
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
}

.action-btn.primary {
    background: #00A651;
    color: white;
}

.action-btn.primary:hover {
    background: #008542;
}

.action-btn.secondary {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
}

.action-btn.secondary:hover {
    background: #e5e7eb;
}

.typing-indicator {
    display: flex;
    gap: 8px;
    align-items: center;
}

.typing-dots {
    display: flex;
    gap: 4px;
    padding: 12px 16px;
    background: #f3f4f6;
    border-radius: 12px;
}

.typing-dots span {
    width: 6px;
    height: 6px;
    background: #9ca3af;
    border-radius: 50%;
    animation: typing 1.4s infinite;
}

.typing-dots span:nth-child(2) {
    animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
    animation-delay: 0.4s;
}

.quick-actions {
    padding: 12px 16px;
    border-top: 1px solid #e5e7eb;
    background: #f9fafb;
}

.quick-action-btn {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    transition: all 0.2s;
}

.quick-action-btn:hover {
    border-color: #00A651;
    background: #f0f9f4;
}

.chat-input {
    padding: 16px;
    border-top: 1px solid #e5e7eb;
    background: white;
}

.input-container {
    display: flex;
    gap: 8px;
    align-items: center;
}

.message-input {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid #d1d5db;
    border-radius: 24px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
}

.message-input:focus {
    border-color: #00A651;
}

.message-input:disabled {
    background: #f9fafb;
    color: #9ca3af;
}

.send-btn {
    width: 40px;
    height: 40px;
    background: #00A651;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.send-btn:hover:not(:disabled) {
    background: #008542;
}

.send-btn:disabled {
    background: #9ca3af;
    cursor: not-allowed;
}

@keyframes pulse {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.05);
    }
}

@keyframes typing {

    0%,
    60%,
    100% {
        transform: translateY(0);
    }

    30% {
        transform: translateY(-10px);
    }
}

/* Scrollbar styling */
.chat-messages::-webkit-scrollbar {
    width: 4px;
}

.chat-messages::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.chat-messages::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 2px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}
</style>