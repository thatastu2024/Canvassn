class PublicScript {
  constructor() {
      this.modal1 = null;
      this.modal2 = null;
      this.modal1Open = false;
      this.modal2Open = false;
      this.isLoggedIn = false;
      this.loadFontAwesome();
      this.init();
  }

  loadFontAwesome() {
      const faLink = document.createElement("link");
      faLink.rel = "stylesheet";
      faLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css";
      document.head.appendChild(faLink);
  }

  init() {
      console.log("🔥 Public Script Loaded!");
      this.createButton();

      if (!localStorage.getItem("authToken")) {
          this.createModals();
      } else {
          console.log("✅ User already logged in. Hiding login modal.");
      }
  }

  createButton() {
      this.btn = document.createElement("button");
      this.btn.innerHTML = '<i class="fa-solid fa-comments"></i> Open Modal';
      Object.assign(this.btn.style, {
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "10px 15px",
          background: "red",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          zIndex: "9999",
          display: "inline-flex",
          alignItems: "center",
          gap: "5px"
      });
      this.btn.addEventListener("click", () => this.toggleModal1());
      document.body.appendChild(this.btn);
  }

  createModals() {
      this.modal1 = this.createStyledModal("Canvassn-Eric", "Click Save to Continue", () => this.toggleModal1(), () => this.openModal2());
      document.body.appendChild(this.modal1);
  }

  createStyledModal(title, content, closeAction, saveAction) {
      const modal = document.createElement("div");
      Object.assign(modal.style, {
          position: "fixed",
          bottom: "-400px",
          right: "20px",
          width: "400px",
          height: "300px",
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

      const contentEl = document.createElement("p");
      contentEl.innerText = content;
      modal.appendChild(contentEl);

      if (saveAction) {
          const saveButton = document.createElement("button");
          saveButton.innerHTML = '<i class="fa-solid fa-save"></i> Save';
          Object.assign(saveButton.style, {
              background: "green",
              color: "white",
              border: "none",
              padding: "10px",
              marginTop: "10px",
              cursor: "pointer",
              borderRadius: "5px"
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
        <strong class="text-lg font-semibold mb-4 block">Login Required</strong>
        <form id="loginForm" class="w-full flex flex-col space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" placeholder="Enter your name" 
                    class="mt-1 p-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" placeholder="Enter your email" 
                    class="mt-1 p-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
            </div>

            <button type="submit" 
                class="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200">
                <i class="fa-solid fa-sign-in mr-2"></i> Login
            </button>
        </form>
    `;
    
    formContainer.querySelector("#loginForm").onsubmit = (e) => this.handleLogin(e);
    return formContainer;
}


  handleLogin(e) {
      e.preventDefault();
  
      const name = e.target.querySelector('input[type="text"]').value.trim();
      const email = e.target.querySelector('input[type="email"]').value.trim();
  
      if (!name || !email) {
          alert("Please enter both name and email.");
          return;
      }
  
      // API call to authenticate
      fetch("https://ai-voice-bot-mauve.vercel.app/api/prospects", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email }),
      })
      .then(response => response.json())
      .then(data => {
          if (data.token) {
              localStorage.setItem("authToken", data.token);
              alert("Login successful!");
  
              // Hide modal 1 after login
              this.modal1.innerHTML = "";
              this.modal1.appendChild(this.createStyledModal("Canvassn-Eric", "You are now logged in.", () => this.toggleModal1(), null));
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
}

new PublicScript();