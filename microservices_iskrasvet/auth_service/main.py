from flask import Flask, request, jsonify
from flask_cors import CORS
from functools import wraps
import jwt
import datetime
import os
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-here')

ADMIN_ACCOUNTS = {
    'admin': {
        'password': generate_password_hash('admin123'),
        'role': 'admin'
    }
}

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            token = token.split(' ')[1]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = data['username']
        except:
            return jsonify({'message': 'Token is invalid'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

@app.route('/api/auth/login', methods=['POST'])
def login():
    auth = request.get_json()
    
    if not auth or not auth.get('username') or not auth.get('password'):
        return jsonify({'message': 'Could not verify'}), 401
    
    user = ADMIN_ACCOUNTS.get(auth.get('username'))
    
    if not user or not check_password_hash(user['password'], auth.get('password')):
        return jsonify({'message': 'Invalid credentials'}), 401
    
    token = jwt.encode({
        'username': auth.get('username'),
        'role': user['role'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, app.config['SECRET_KEY'])
    
    return jsonify({
        'token': token,
        'username': auth.get('username'),
        'role': user['role']
    })

@app.route('/api/auth/verify', methods=['GET'])
@token_required
def verify_token(current_user):
    return jsonify({
        'username': current_user,
        'message': 'Token is valid'
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002) 