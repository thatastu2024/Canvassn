class CanvassnChatWidget extends HTMLElement {
    constructor() {
      super();
      this.agentId = this.getAttribute("agent-id") || "default-agent";
      this.attachShadow({ mode: "open" });
    }
  
    connectedCallback() {
      this.render();
    }
  
    render() {
      this.shadowRoot.innerHTML = `
        <style>
          /* Floating Button */
          .widget-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #ff4081;
            color: white;
            padding: 12px 16px;
            border-radius: 50%;
            border: none;
            cursor: pointer;
            box-shadow: 0px 4px 6px rgba(0,0,0,0.1);
          }
  
          /* Popup Modal */
          .widget-modal {
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 300px;
            background: white;
            padding: 16px;
            border-radius: 12px;
            box-shadow: 0px 4px 6px rgba(0,0,0,0.1);
            display: none;
            border: 1px solid #ddd;
          }
  
          .widget-modal.active {
            display: block;
          }
  
          .close-btn {
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            position: absolute;
            top: 10px;
            right: 10px;
          }
  
        </style>
  
        <!-- Floating Button -->
        <button class="widget-button">Chat</button>
  
        <!-- Modal -->
        <div class="widget-modal">
          <button class="close-btn">&times;</button>
          <h3>Voice Chat</h3>
          <p>Agent ID: ${this.agentId}</p>
          <script src="https://elevenlabs.io/convai-widget/index.js" async type="text/javascript"></script>
          <elevenlabs-convai agent-id="${this.agentId}"></elevenlabs-convai>
        </div>
      `;
  
      // Event Listeners
      this.shadowRoot.querySelector(".widget-button").addEventListener("click", () => {
        this.shadowRoot.querySelector(".widget-modal").classList.toggle("active");
      });
  
      this.shadowRoot.querySelector(".close-btn").addEventListener("click", () => {
        this.shadowRoot.querySelector(".widget-modal").classList.remove("active");
      });
    }
  }
  
  // Define Custom Element
  customElements.define("voice-chat-widget", VoiceChatWidget);
  