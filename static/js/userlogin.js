document.addEventListener("DOMContentLoaded", function () {// const socket = io('http://127.0.0.1:8090');

    // 获取具有ID为"signUp"的元素
    var signUpButton = document.getElementById("signUp");

    // 获取具有ID为"signIn"的元素
    var signInButton = document.getElementById("signIn");

    // 获取具有ID为"login-box"的元素
    var loginBox = document.getElementById("login-box");

    // 获取所有具有类名为"txtb"的元素
    var inputElements = document.querySelectorAll(".txtb input");


function azureBot(){
    window.parent.location.replace('../template/index.html');
}

function reload_loginhtml(){


    loginBox.classList.remove("right-panel-active");

}

function loginCheck(){

    let username = document.getElementById("loginAccount").value;

    let password = document.getElementById("loginPassword").value;

 
    if(username == "" || password == ""){
       alert("请输入账号或密码！") 
    }
    else{
        return new Promise((resolve, reject) => {
            fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success_flag) {
                    alert(data.message);
                    azureBot()
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                alert("登录错误，请重试！")
            });
        }); 
    }

}

function signCheck(){


    let username = document.getElementById("signupAccount").value;
    
    let email = document.getElementById("signupEmail").value;


    let password = document.getElementById("signupPassword").value;

    let confirmPassword = document.getElementById("signupConfirmedPassword").value;


    if((username != "") && (email != "") && (password == confirmPassword)){

        return new Promise((resolve, reject) => {
            // 构建要发送的数据对象
         
            fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                
                body: JSON.stringify({ username, email, password })
            })
            .then(response => response.json())
            .then(data => {
                
                if (data.success_flag) {
                    alert(data.message);
                    reload_loginhtml()
                } 
                else{
                    alert(data.message);
                }
            })
            .catch(error => {
                alert("注册错误，请重试！")
            });
        }); 

    }
    else{
        if(user_id == ""){
            alert("请输入正确的账号！")
        }
        if(email == ""){
            alert("请输入正确邮箱格式！")
        }
        if(password != confirmPassword){
            alert("两次密码输入不一致！")
        }
    }


 

}

function loginClose(){

       
        // 找到父页面中的 iframe 元素
        var iframeToRemove = window.parent.document.getElementById('userLoginhtml');

        // 如果找到了 iframe 元素，则将其从父元素中移除
        if (iframeToRemove) {
            iframeToRemove.parentNode.removeChild(iframeToRemove);
        }
    
}


    // 添加点击事件处理程序，给具有ID为"login-box"的元素添加名为'right-panel-active'的CSS类
    signUpButton.addEventListener("click", function () {
        loginBox.classList.add("right-panel-active");
    });

    // 添加点击事件处理程序，从具有ID为"login-box"的元素中移除名为'right-panel-active'的CSS类
    signInButton.addEventListener("click", function () {
        loginBox.classList.remove("right-panel-active");
    });

    // 遍历所有具有类名为"txtb"的元素，添加焦点事件处理程序
    inputElements.forEach(function (inputElement) {
        inputElement.addEventListener("focus", function () {
            // 给当前输入元素添加名为'focus'的CSS类
            inputElement.classList.add("focus");
        });

        // 添加失焦事件处理程序
        inputElement.addEventListener("blur", function () {
            // 如果当前输入元素的值为空，移除名为'focus'的CSS类
            if (inputElement.value === '') {
                inputElement.classList.remove("focus");
            }
        });
    });


    /* 用户实际登录与注册按钮 */
    var login_Button = document.getElementById("loginButton");
    var signup_Button = document.getElementById("signup_Button");

    login_Button.addEventListener("click",function(){

        loginCheck();
    })

    signup_Button.addEventListener("click",function(){
        signCheck();
    })

    /* 给关闭按钮添加点击事件 */
    var closeButton = document.getElementById("loginClose")
    closeButton.addEventListener("click",function(){
        loginClose();
    })



});
