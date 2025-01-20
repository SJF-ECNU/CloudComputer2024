document.addEventListener("DOMContentLoaded",function(){
    var button1 = document.getElementById("button1")
    var button2 = document.getElementById("button2")
    var button3 = document.getElementById("button3")
    // window.alert('设置已保存！');

    button1.addEventListener("click",function(){
        sendVerificationCode();
    })

    button2.addEventListener("click",function(){
        verifyCode();
    })

    button3.addEventListener("click",function(){
        resetPassword();
    })

   
});

function sendVerificationCode() {
    var email = document.getElementById('email').value;
    // Implement the logic to send the verification code (e.g., through AJAX)
    // window.alert('验证码已发送到邮箱，请检查您的邮箱！')
    document.getElementById('emailMessage').innerText = '验证码已发送到邮箱，请检查您的邮箱!';
}

function verifyCode() {
    var code = document.getElementById('verification-code').value;
    // Check if the code is correct
    if (code === '765765') {
        document.getElementById('verification-message').innerText = '验证码验证成功。';
    } else {
        document.getElementById('verification-message').innerText = '验证码错误。';
    }
}

function resetPassword() {
    var newPassword = document.getElementById('new-password').value;
    var verificationCode = document.getElementById('verification-code').value;
    // 判断验证码是否正确
    if (verificationCode === '765765') {
        // 在这里可以实现重设密码的逻辑，例如通过 AJAX 请求将新密码发送到后端进行更新
        // 这里仅作演示，显示一个提示消息
        // window.alert('密码重设成功！')
        document.getElementById('reset-password-message').innerText = '密码重设成功！';
    } 
    else if(verificationCode === ''){
        document.getElementById('reset-password-message').innerText = '请输入验证码！';
    }
    else {
        document.getElementById('reset-password-message').innerText = '验证码错误，请重新输入！';
    }
}
