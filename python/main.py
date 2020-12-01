import sys
import os
from flask import Flask, jsonify, request
import methods
import copy
import pandas as pd;
from io import StringIO

app = Flask(__name__)

PORT = sys.argv[1]

@app.route('/methods')
def get_methods():
  return jsonify(methods.json_config)

@app.route('/compute/<category_id>/<method_id>', methods=['POST'])
def compute(category_id, method_id):
  body = request.json
  data = pd.read_csv(StringIO(body['data']))
  args = body['args']
  func = methods.config[category_id]['types'][method_id]['algorithm']
  return jsonify(func(data, args))


if __name__ == '__main__':
  app.run(host='127.0.0.1', port=PORT, debug=(os.environ.get('DEBUG') == 'true'))