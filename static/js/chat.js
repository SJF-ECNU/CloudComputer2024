document.addEventListener("DOMContentLoaded",function(){



    // 成功发送
   const chatBox=document.getElementById("chat-box");
   var input_button=document.getElementById("submit-btn");
   // 发送内容
   var userInput=document.getElementById("user-input");
   //定义消息类型
   var message_type1 = "user_message";
   var message_type2 = "system_message";
   

    function addToChatBox(message,message_type) {

        const newMessage = document.createElement("div");
        var date=new Date();
        var hour=date.getHours();
        var mm=date.getMinutes();
        var time=hour+':'+mm;
        message = message.replace(/ /g, "\u00A0");
        if(message_type === "user_message"){
            newMessage.style.margin = "10px"
            newMessage.style.maxWidth = '80%';
        
            newMessage.style['justify-content'] = 'right'
            newMessage.style.float = 'right';
            newMessage.style.width = "100%"
            newMessage.style.display = "inline-block";
            newMessage.style.textAlign = 'left';
            newMessage.style.justifyContent = 'right'
            newMessage.style.float = 'right';
            newMessage.style.overflowWrap = 'break-word';
            var content_div = document.createElement('div');
            content_div.className = "chat_right_content clearfix"
            content_div.style.right= '7%'
            content_div.style.float = 'right'
            content_div.textContent = message;
            
            var ans='<div class="chat_right_item_2">'+
            '<div class="chat_right_time clearfix">'+time+'&nbsp'+'&nbsp'+'&nbsp'+'&nbsp'+'<img src = "../images/chat_user.png" style =width="40" height="30">' +
            '</img>' +
            '</div>'
            
            ;
            // var oLi=document.createElement("div");
            // oLi.setAttribute("class","chat_right");
            newMessage.innerHTML=ans;
            newMessage.appendChild(content_div)
            
            chatBox.append(newMessage);
            userInput.value="";   
        }
        else{

            newMessage.style.margin = "10px"
            newMessage.style.maxWidth = '80%';  
            newMessage.style.float = 'left';
            newMessage.style.width = "100%"
            newMessage.style.display = "inline-block";
            newMessage.style.textAlign = 'left';
            newMessage.style.justifyContent = 'left'
            newMessage.style.float = 'left';
            newMessage.style.overflowWrap = 'break-word';
            var content_div = document.createElement('div');
            content_div.className = "chat_left_content clearfix"
            content_div.style.left= '7%'
            content_div.style.float = 'left'
            content_div.textContent = message;
            
            var reply='<div class="chat_left_item_2">'+
            '<div class="chat_left_time clearfix">'+ '<img src = "../images/aqi_chat.png" style =width="40" height="30">' +
            '</img>'+'&nbsp'+'&nbsp'+'&nbsp'+'&nbsp'
            +'</div>'
            
            ;
            // var oLi=document.createElement("div");
            // oLi.setAttribute("class","chat_right");
            newMessage.innerHTML=reply;
            newMessage.appendChild(content_div)
            
            chatBox.append(newMessage);
            userInput.value="";
            
        }
        //清除格式防止影响后置布局
        newMessage.style.clear = 'both';
        chatBox.scrollTop = chatBox.scrollHeight;
        
            
    }

    function sendques(question){
        const apiUrl = 'https://api.deepseek.com/chat/completions'; 
        const apiKey = 'sk-f7ce994da89645e5aa1b4588e97d332f'; 

        let data = JSON.stringify({
            "messages": [
                {
                    "content": "你是一个AQI智能聊天助手，名字叫AzureBot(蔚蓝精灵)",
                    "role": "system"
                },
                {
                    "content": question,
                    "role": "user"
                }
            ],
            "model": "deepseek-chat",
            "frequency_penalty": 0,
            "max_tokens": 2048,
            "presence_penalty": 0,
            "stop": null,
            "stream": true,
            "temperature": 1,
            "top_p": 1,
            "logprobs": false,
            "top_logprobs": null
        });

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: data
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            // const resultContainer = document.getElementById('result');

            const newMessage = document.createElement("div");
            var date=new Date();
            var hour=date.getHours();
            var mm=date.getMinutes();
            var time=hour+':'+mm;
        
        
            newMessage.style.margin = "10px"
            newMessage.style.maxWidth = '80%';  
            newMessage.style.float = 'left';
            newMessage.style.width = "100%"
            newMessage.style.display = "inline-block";
            newMessage.style.textAlign = 'left';
            newMessage.style.justifyContent = 'left'
            newMessage.style.float = 'left';
            newMessage.style.overflowWrap = 'break-word';
            var content_div = document.createElement('div');
            content_div.className = "chat_left_content clearfix"
            content_div.style.left= '7%'
            content_div.style.float = 'left'

            
            var reply='<div class="chat_left_item_2">'+
            '<div class="chat_left_time clearfix">'+ '<img src = "../images/aqi_chat.png" style =width="40" height="30">' +
            '</img>'+'&nbsp'+'&nbsp'+'&nbsp'+'&nbsp'
            +'</div>'
            
            ;
            // var oLi=document.createElement("div");
            // oLi.setAttribute("class","chat_right");
            newMessage.innerHTML=reply;
            newMessage.appendChild(content_div)
            
            chatBox.append(newMessage);
            userInput.value="";
                
            
            //清除格式防止影响后置布局
            newMessage.style.clear = 'both';
            chatBox.scrollTop = chatBox.scrollHeight;

            function processStream() {
                return reader.read().then(({ done, value }) => {
                    if (done) {
                        return;
                    }
                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n').filter(line => line.trim() !== '');
                    lines.forEach(line => {
                        if (line.startsWith('data: ')) {
                            const jsonStr = line.slice(6);
                            if (jsonStr.trim() === '[DONE]') {
                                return;
                            }
                            try {
                                const json = JSON.parse(jsonStr);
                                if (json.choices && json.choices[0].delta && json.choices[0].delta.content) {
                                    const content = json.choices[0].delta.content;
                                    content_div.textContent += content;
                                }
                            } catch (e) {
                                console.error('Error parsing JSON:', e);
                            }
                        }
                    });
                    
                    return processStream();
                });
            }

            processStream().then(data => {
                // content_div.innerHTML = marked.parse(content_div.textContent);
            });
          
        
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            addToChatBox("蔚蓝助手出错了,请重试...", message_type2)
        });
    }



    // 监听文本框的键盘按下事件
    userInput.addEventListener("keydown", function(event) {

        // 检查按下的键是否为 Enter 键并且同时按下了 Shift 键 (key 为 "Enter" 并且 shiftKey 为 true)
        if (event.key === "Enter" && event.shiftKey) {
            // 允许默认的 Shift + Enter 换行行为
            return;
        }

        // 检查按下的键是否为 Enter 键 (key 为 "Enter")
        if (event.key === "Enter") {
            // 阻止默认的 Enter 换行行为
            event.preventDefault();
            // 触发按钮的点击事件
            input_button.click();
        }
        
    });

   input_button.addEventListener("click",function(){
       const message = userInput.value;
       if (message.trim() === "") return;
       addToChatBox(`${message}`,message_type1);
       sendques(message)
   });

     
   addToChatBox("你好，我是 AzureBot (蔚蓝助手)。 欢迎向我提问 . . .", message_type2);


});

