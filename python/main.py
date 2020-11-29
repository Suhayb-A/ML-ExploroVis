import sys
import os
from flask import Flask, jsonify, request
import methods

app = Flask(__name__)

PORT = sys.argv[1]

@app.route('/methods')
def get_methods():
  return jsonify(methods.config)

@app.route('/compute/<category_id>/<method_id>')
def compute(category_id, method_id):
  options = request.json;

  # options.config TODO: Hyper-parameters options
  # options.data TODO: raw csv
  print(options.data, category_id, method_id)
  # TODO: Return all frames & Stats
  return ""


if __name__ == '__main__':
  app.run(host='127.0.0.1', port=PORT, debug=(os.environ.get('DEBUG') == 'true'))