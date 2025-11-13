from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# In-memory database
items = []

@app.route('/items', methods=['GET'])
def get_items():
    return jsonify(items)

@app.route('/items', methods=['POST'])
def add_item():
    data = request.get_json()
    items.append(data)
    return jsonify({"message": "Item added successfully"}), 201

@app.route('/items/<int:index>', methods=['PUT'])
def update_item(index):
    data = request.get_json()
    if index < 0 or index >= len(items):
        return jsonify({"error": "Invalid index"}), 400
    items[index] = data
    return jsonify({"message": "Item updated successfully"})

@app.route('/items/<int:index>', methods=['DELETE'])
def delete_item(index):
    if index < 0 or index >= len(items):
        return jsonify({"error": "Invalid index"}), 400
    del items[index]
    return jsonify({"message": "Item deleted successfully"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
