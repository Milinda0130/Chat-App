const chatList = [];
let user = "2"; 

document.getElementById("Select").addEventListener("change", function() {
    user = this.value;
    console.log("User changed to:", this.value);
});

document.getElementById("message").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        send();
    }
});

function send() {
    let message = document.getElementById("message").value.trim();
    if (!message) return; 
    
    
    let userChatBubble = `<div class="message_sent ms-auto" id="sent">${message}</div><br>`;
    chatList.push(userChatBubble);
    loadChatBox();
    
    
    document.getElementById("message").value = "";
    
    
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "contents": [
            {
                "parts": [
                    {
                        "text": message
                    }
                ]
            }
        ]
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
    };

    
    const loadingId = chatList.length;
    chatList.push(`<div class="message_sent me-auto" id="loading-${loadingId}">plesae waiting...</div><br>`);
    loadChatBox();


    fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDFnm9aRnmqUZqvYtfxg4M_K2-Jhgwbj1g", requestOptions)
        .then((response) => response.json())
        .then((result) => {
    
            chatList.pop();
            
            
            const aiResponse = result.candidates[0].content.parts[0].text;
            
            
            const formattedResponse = aiResponse
                .replace(/\n/g, '<br>')  
                .replace(/\s{2,}/g, function(match) {  
                    return '&nbsp;'.repeat(match.length);
                });
            
            let aiBubble = `<div class="message_sent me-auto" id="sent">${formattedResponse}</div><br>`;
            chatList.push(aiBubble);
            loadChatBox();
        })
        .catch((error) => {
            
            chatList.pop();
            chatList.push(`<div class="message_sent me-auto" id="sent">Sorry, I couldn't process that request.</div><br>`);
            loadChatBox();
            console.error(error);
        });
}

function loadChatBox() {
    const chatBox = document.getElementById("chat_box");
    chatBox.innerHTML = chatList.join("");
    
    
    chatBox.scrollTop = chatBox.scrollHeight;
}
