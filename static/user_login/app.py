from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # 启用CORS
socketio = SocketIO(app)

# 模拟用户数据库
users = {
    'user1': {'password': 'password1', 'email': 'user1@example.com'},
    'user2': {'password': 'password2', 'email': 'user2@example.com'}
}

@app.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return jsonify({}), 200

    data = request.get_json()
    username = data.get('user_id')
    password = data.get('pwd')
    print(f"{username}---{password}")

    if username in users and users[username]['password'] == password:
        return jsonify({'success': True, 'message': '登录成功'})
    else:
        return jsonify({'success': False, 'message': '用户名或密码无效'})

@app.route('/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        return jsonify({}), 200

    data = request.get_json()
    username = data.get('user_id')
    access_key = data.get('access_key')
    password = data.get('pwd')
    email = data.get('email')

    if username in users:
        return jsonify({'success': False, 'message': '用户名已存在'})
    else:
        users[username] = {'password': password, 'email': email}
        print(users)
        return jsonify({'success': True, 'message': '注册成功'})

@socketio.on('connect')
def handle_connect(data):
    userId = data.get('userId')
    print(userId)
    
if __name__ == '__main__':
    socketio.run(app, debug=False, port=8090)