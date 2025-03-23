class PublicScript {
  constructor() {
    this.modal1 = null;
    this.modal2 = null;
    this.modal1Open = false;
    this.modal2Open = false;
    this.isLoggedIn = false;
    this.loadFontAwesome();
    this.init();
    this.agentId=null
    this.isConversationActive = false;
    this.isMuted = false;
    this.timerInterval = null;
    this.startTime = null;
    this.session = null;
    this.conversation=null,
    this.messageCount=0,
    this.userData=[],
    this.fetchUserDetail(),
    this.conversationId=null;
  }

  loadFontAwesome() {
      const faLink = document.createElement("link");
      faLink.rel = "stylesheet";
      faLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css";
      document.head.appendChild(faLink);
  }

    loadElevenLabsSDK() {
        return new Promise((resolve, reject) => {
            if (this.elevenLabs) {
                resolve(this.elevenLabs);
                return;
            }
    
            import("https://cdn.jsdelivr.net/npm/@11labs/client@latest/+esm")
                .then((module) => {
                    this.elevenLabs = module;
                    resolve(this.elevenLabs);
                })
                .catch((error) => {
                    console.error("❌ Failed to load ElevenLabs SDK", error);
                    reject(error);
                });
        });
    }

  init() {
      console.log("🔥 Public Script Loaded!");
      this.createButton();

      if (!localStorage.getItem("authToken")) {
          this.createModals();
      } else {
        console.log("✅ User already logged in. Hiding login modal.");
        this.modal1 = this.createLoggedInModal();  // Load logged-in modal
        document.body.appendChild(this.modal1);
      }
  }

    createButton() {
        this.btn = document.createElement("button");
        this.btn.innerHTML = '<i class="fa-solid fa-comment-dots"></i>';

        Object.assign(this.btn.style, {
            position: "fixed",
            bottom: "12px",
            right: "20px",
            padding: "15px",
            background: "#3A0CA3",
            color: "white",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            zIndex: "9999",
            fontSize: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "60px",
            height: "60px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
            transition: "all 0.3s ease-in-out"
        });

        this.btn.addEventListener("mouseover", () => {
            this.btn.style.background = "#2A008F";
        });

        this.btn.addEventListener("mouseout", () => {
            this.btn.style.background = "#3A0CA3";
        });

        this.btn.addEventListener("click", () => this.toggleModal1());
        document.body.appendChild(this.btn);
    }

    createModals() {
        this.modal1 = this.createStyledModal("Ask Anythings", () => this.toggleModal1(), () => this.openModal2());
        document.body.appendChild(this.modal1);
    }
 
    createLoggedInModal() {
        const modal = document.createElement("div");
        Object.assign(modal.style, {
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "400px",
            height: "350px",
            background: "white",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            borderRadius: "10px",
            transition: "bottom 0.3s ease-in-out",
            zIndex: "10000",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        });

        const header = document.createElement("div");
        header.style.display = "flex";
        header.style.justifyContent = "space-between";
        header.style.width = "100%";
        
        const titleEl = document.createElement("strong");
        titleEl.style.color="black"
        titleEl.innerText = "Ask Anything";
        header.appendChild(titleEl);

        const profileBlock = document.createElement("div");
        profileBlock.innerHTML = `<i class="fa fa-user" aria-hidden="true"></i>`
        Object.assign(profileBlock.style, {
            width: "35px",
            height: "35px",
            borderRadius: "50%",
            background: "black",
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            position: "relative",
            margin:"0px 0px 0px 160px"
        });

        const dropdown = document.createElement("div");
        Object.assign(dropdown.style, {
            position: "relative",
            top: "40px",
            right: "0",
            background: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            borderRadius: "5px",
            display: "none",
            flexDirection: "column",
            zIndex: "10001"
        });

        // const showProfile = document.createElement("button");
        // showProfile.innerText = "Profile";
        // Object.assign(showProfile.style, {
        //     padding: "10px",
        //     border: "none",
        //     background: "transparent",
        //     color:'black',
        //     cursor: "pointer",
        //     textAlign: "left"
        // });

        const logout = document.createElement("button");
        logout.innerText = "Logout";
        Object.assign(logout.style, {
            padding: "10px",
            border: "none",
            background: "transparent",
            color:'black',
            cursor: "pointer",
            textAlign: "left"
        });

        logout.onclick = () => this.logoutUser();
        // dropdown.appendChild(showProfile);
        dropdown.appendChild(logout);

        profileBlock.onclick = () => {
            dropdown.style.display = dropdown.style.display === "none" ? "flex" : "none";
        };

        profileBlock.appendChild(dropdown);

        header.appendChild(profileBlock);

        const closeBtn = document.createElement("button");
        closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        closeBtn.style.border = "none";
        closeBtn.style.background = "transparent";
        closeBtn.style.color = "black";
        closeBtn.style.cursor = "pointer";
        closeBtn.onclick = () => this.toggleModal1();
        header.appendChild(closeBtn);
        modal.appendChild(header);

        const img = document.createElement("img");
        img.style.color="black"
        img.src = "https://ai-voice-bot-mauve.vercel.app/Men.webp"; 
        img.alt = "User Avatar";
        Object.assign(img.style, {
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            margin: "30px 0px 10px"
        });
        modal.appendChild(img);

        // Timer Display
        this.timerDisplay = document.createElement("div");
        this.timerDisplay.innerText = "00:00";
        this.timerDisplay.style.color = "black";
        this.timerDisplay.style.fontSize = "20px";
        this.timerDisplay.style.fontWeight = "bold";
        this.timerDisplay.style.marginBottom = "10px";
        modal.appendChild(this.timerDisplay);


        this.muteIcon = document.createElement("i");
        this.isMuted = false;
        this.updateMuteIcon();
        this.muteIcon.style.fontSize = "20px";
        this.muteIcon.style.cursor = "pointer";
        this.muteIcon.style.margin = "0px 0px 15px 0px";
        this.muteIcon.onclick = () => this.toggleMute();
        modal.appendChild(this.muteIcon);

        this.conversationButton = document.createElement("button");
        this.updateConversationButton();
        modal.appendChild(this.conversationButton);

        return modal;
   }

    updateConversationButton() {
        if (!this.conversationButton) return;

        if (this.isConversationActive) {
            this.conversationButton.innerHTML = '<i class="fa-solid fa-microphone-slash"></i> End Conversation';
            this.conversationButton.style.background = "red";
            this.conversationButton.onclick = () => this.handleEndConversation();
        } else {
            this.conversationButton.innerHTML = '<i class="fa-solid fa-microphone"></i> Start Conversation';
            this.conversationButton.style.background = "black";
            this.conversationButton.onclick = () => this.handleStartConversation();
        }

        Object.assign(this.conversationButton.style, {
            color: "white",
            border: "none",
            padding: "10px",
            cursor: "pointer",
            borderRadius: "5px",
            width: "80%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px"
        });
    }

    updateMuteIcon() {
        if (!this.muteIcon) return;
        this.muteIcon.className = this.isMuted ? "fa-solid fa-volume-mute" : "fa-solid fa-volume-up";
        this.muteIcon.style.color = this.isMuted ? "gray" : "black";
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        console.log(this.isMuted ? "🔇 Muted" : "🔊 Unmuted");
        this.updateMuteIcon();
    }

    async handleStartConversation() {
        console.log("🎤 Conversation Started!");
        this.isConversationActive = true;
        this.updateConversationButton();
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            const elapsedTime = Date.now() - this.startTime;
            this.timerDisplay.innerText = this.formatTime(elapsedTime);
        }, 1000);
        const elevenLabsModule = await this.loadElevenLabsSDK();
        const ElevenLabsClient = elevenLabsModule.Conversation;
        this.getAgentId()
        this.conversation = await ElevenLabsClient.startSession({
            agentId: this.agentId,
            onConnect: () => {
                console.log("Connected to ElevenLabs");
            },
            onDisconnect: () => {
                console.log("Disconnected from ElevenLabs");
            },
            onMessage: (message) => {
                console.log("Received message:", message);
                this.messageCount = this.messageCount + 1
                if(message.source === "ai"){
                    this.messageCount
                console.log("ai",message.message)
                }
                if(message.source === "user"){
                console.log("user",message.message)
                }
            },
            onError: (error) => {
                console.error("Error:", error);
            },
            onModeChange: (mode) =>{
                console.error("mode:", mode);
            },
            onStatusChange:(status) =>{
                console.error("status:", status);
            }
        });
        let userData=await this.fetchUserDetail()  
        let authToken=localStorage.getItem('authToken')
        this.conversationId=this.conversation.getId()
        fetch("https://ai-voice-bot-mauve.vercel.app/api/bot", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                data:{
                    agent_id:this.agentId,
                    conversation_id:this.conversation.getId(),
                    start_time_unix_secs:this.getUnixTime(),
                    status:'processing',
                    prospect_id:userData._id 
                }
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
        .catch(error => {
            console.error("Login Error:", error);
            alert("Something went wrong. Please try again.");
        });
        console.log("🟢 ElevenLabs session started.");
    }

    async handleEndConversation() {
        this.isConversationActive = false;
        this.updateConversationButton();

        clearInterval(this.timerInterval);
        const elapsedTime = Date.now() - this.startTime;
        await this.conversation.endSession();
        let authToken=localStorage.getItem('authToken')
        fetch("https://ai-voice-bot-mauve.vercel.app/api/bot/"+this.conversationId, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                call_duration_secs:elapsedTime,
                total_message_exchange:this.messageCount
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
        .catch(error => {
            console.error("Login Error:", error);
            alert("Something went wrong. Please try again.");
        });
    }

    formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
        const seconds = String(totalSeconds % 60).padStart(2, "0");
        return `${minutes}:${seconds}`;
    }

    getUnixTime = () => Math.floor(Date.now() / 1000);

    createStyledModal(title, closeAction, saveAction) {
        const modal = document.createElement("div");
        Object.assign(modal.style, {
            position: "fixed",
            bottom: "-400px",
            right: "20px",
            width: "400px",
            height: "325px",
            background: "white",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            borderRadius: "10px",
            transition: "bottom 0.3s ease-in-out",
            zIndex: "10000",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        });
        
        const header = document.createElement("div");
        header.style.display = "flex";
        header.style.justifyContent = "space-between";
        header.style.width = "100%";
        
        const titleEl = document.createElement("strong");
        titleEl.innerText = title;
        header.appendChild(titleEl);

        const closeBtn = document.createElement("button");
        closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        closeBtn.style.border = "none";
        closeBtn.style.background = "transparent";
        closeBtn.style.cursor = "pointer";
        closeBtn.onclick = closeAction;
        header.appendChild(closeBtn);
        modal.appendChild(header);


        const img = document.createElement("img");
        img.style.color="black"
        img.src = "https://ai-voice-bot-mauve.vercel.app/Men.webp"; 
        img.alt = "User Avatar";
        Object.assign(img.style, {
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            margin: "30px 0px 10px"
        });
        modal.appendChild(img);

        // Timer Display
        this.timerDisplay = document.createElement("div");
        this.timerDisplay.innerText = "00:00";
        this.timerDisplay.style.color = "black";
        this.timerDisplay.style.fontSize = "20px";
        this.timerDisplay.style.fontWeight = "bold";
        this.timerDisplay.style.marginBottom = "10px";
        modal.appendChild(this.timerDisplay);


        // Mute/Unmute Button
        this.muteIcon = document.createElement("i");
        this.isMuted = false; // Default state
        this.updateMuteIcon(); // Initialize mute/unmute UI
        this.muteIcon.style.fontSize = "20px";
        this.muteIcon.style.cursor = "pointer";
        this.muteIcon.style.margin = "0px 0px 15px 0px";
        this.muteIcon.onclick = () => this.toggleMute();
        modal.appendChild(this.muteIcon);

        if (saveAction) {
            const saveButton = document.createElement("button");
            saveButton.innerHTML = '<i class="fa-solid fa-microphone"></i> Start Conversation';
            Object.assign(saveButton.style, {
                background: "black",
                color: "white",
                border: "none",
                padding: "10px",
                cursor: "pointer",
                borderRadius: "5px",
                width: "80%",
            });
            saveButton.onclick = saveAction;
            modal.appendChild(saveButton);
        }

        return modal;
    }

    openModal2() {
        this.modal1.innerHTML = "";
        this.modal1.appendChild(this.createLoginForm());
    }

    createLoginForm() {
        const formContainer = document.createElement("div");
        formContainer.innerHTML = `
            <style>
                /* Title */
                .title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: black;
                    margin-bottom: 16px;
                    display: block;
                }
                .form {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .form-group {
                    text-align: left;
                }
                .form-group label {
                    font-size: .857rem;
                    font-weight: 500;
                    color: #4a4a4a;
                    display: block;
                    margin-bottom: 4px;
                    line-height:1.25rem;
                }

                /* Input fields */
                .form-group input {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #ccc;
                    border-radius: 6px;
                    font-size: 14px;
                }

                /* Button */
                .btn {
                    background-color: #007bff;
                    color: white;
                    font-size: 16px;
                    font-weight: 500;
                    padding: 10px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: background 0.2s ease-in-out;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .btn i {
                    margin-right: 8px;
                }

                .btn:hover {
                    background-color: #0056b3;
                }
            </style>
            <strong class="title">Login Required</strong>
            <form id="loginForm" class="form">
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" placeholder="Enter your name">
                </div>

                <div class="form-group">
                    <label>Email</label>
                    <input type="email" placeholder="Enter your email">
                </div>

                <button type="submit" class="btn">
                    <i class="fa-solid fa-sign-in"></i> Login
                </button>
            </form>
        `;
        
        formContainer.querySelector("#loginForm").onsubmit = (e) => this.handleLogin(e);
        return formContainer;
    }

    getAgentId(){
        const scripts = document.getElementsByTagName("canvassn-chat-widget");
        let tempAId
        for(let script of scripts){
            this.agentId=script.getAttribute("agent-id")
            tempAId=script.getAttribute("agent-id")
        }   
        return tempAId
    }

    handleLogin(e) {
        e.preventDefault();
        this.getAgentId()
        const name = e.target.querySelector('input[type="text"]').value.trim();
        const email = e.target.querySelector('input[type="email"]').value.trim();
        if (!name || !email) {
            alert("Please enter both name and email.");
            return;
        }
        fetch("https://ai-voice-bot-mauve.vercel.app/api/prospects", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                agent_id:this.agentId,
                prospect_name: name,
                prospect_email: email,
                prospect_location: "mumbai"
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.data.prospectToken) {
                localStorage.setItem("authToken", data.data.prospectToken);
                alert("Login successful!");
    
                this.modal1.innerHTML = "";
                this.modal1.appendChild(this.createLoggedInModal());
            } else {
                alert("Login failed. Please try again.");
            }
        })
        .catch(error => {
            console.error("Login Error:", error);
            alert("Something went wrong. Please try again.");
        });
    }
  
    logoutUser() {
        localStorage.removeItem("authToken");
        alert("You have logged out!");
        location.reload(); // Refresh to reset state
    }

    toggleModal1() {
        if (!this.modal1) return;
        this.modal1.style.bottom = this.modal1Open ? "-400px" : "80px";
        this.modal1Open = !this.modal1Open;
    }

    async fetchUserDetail(){
        let authToken=localStorage.getItem('authToken')
        if (!authToken) {
            console.error("❌ No auth token found. User might not be logged in.");
            return;
        }
        const response =await fetch(`https://ai-voice-bot-mauve.vercel.app/api/prospects/details?token=${authToken}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json"
            }
        })

        const data=await response.json()
        if(data?.expired === true){
            localStorage.removeItem('authToken')
            location.reload();
        }else{
            return data.data
        }
    }
 

}

new PublicScript();
