(function () {
  const app = document.querySelector(".app");
  const socket = io();

  let uname;
  app.querySelector(".join-screen #join-user").addEventListener("click", () => {
    let username = app.querySelector(".join-screen #username").value;
    if (username.length == 0) {
      return;
    }
    uname = username;
    socket.emit("newuser", username);

    app.querySelector(".join-screen").classList.remove("active");
    app.querySelector(".chat-screen").classList.add("active");
  });

  app.querySelector(".chat-screen #exit-chat").addEventListener("click", () => {
    app.querySelector(".join-screen").classList.add("active");
    app.querySelector(".chat-screen").classList.remove("active");
  });

  app
    .querySelector(".chat-screen #send-message")
    .addEventListener("click", () => {
      let message = app.querySelector(".chat-screen #message-input").value;
      if (message.length == 0) {
        return;
      }
      renderMessage("user", { username: uname, text: message });
      socket.emit("prompt", { username: uname, text: message });
    });

  socket.on("chatbot", (message) => {
    renderMessage("bot", message);
  });

  function renderMessage(type, message) {
    let messageContainer = app.querySelector(".chat-screen .messages");
    if (type == "user") {
      let el = document.createElement("div");
      el.setAttribute("class", "message my-message");
      el.innerHTML = `
            <div>
                <div class="name">${message.username} </div>
                <div class="text">${message.text} </div>
            </div>
        `;

      messageContainer.appendChild(el);
    } else if (type == "bot") {
      let el = document.createElement("div");
      el.setAttribute("class", "message other-message");
      el.innerHTML = `
            <div>
                <div class="name">${message.username} </div>
                <div class="text">${message.text} </div>
            </div>
        `;

      messageContainer.appendChild(el);
    }
  }
})();
