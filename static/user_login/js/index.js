document.addEventListener("DOMContentLoaded",function(){





     document.getElementById("smile_join_a").addEventListener("click", function() {

         var iframe = document.createElement('iframe');
         
         iframe.src = '../html/login.html'; // 设置 iframe 的 src 属性为要加载的 HTML 文件的 URL
         // 设置 iframe 样式
         iframe.id = 'userLoginhtml'
         iframe.style.width = '500px';
         iframe.style.height = '500px'; // 设置 iframe 高度，根据需要调整
         iframe.style.border = 'none'; // 去掉 iframe 边框
         iframe.style.position = 'absolute'
         iframe.style.left = '35%'
         iframe.style.top = '10%'
         iframe.style.zIndex = "9999"
         document.getElementById('top').appendChild(iframe);
     });


 
})