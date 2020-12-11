from methods import cluster, classify;
import copy;

"""
**Data configuration File**
Default data structure:
{
  'title': the title of the data
  'types': algorithm configs
}
"""
config = {
  'cluster': {
    'title': 'Cluster',
    'types': cluster.methods,
    'colors': [
      {
        '_id': 'cluster',
        'title': 'Cluster',
        # colors are assigned on the client side.
      }
    ]
  },
  'classify': {
    'title': 'Classify',
    'types': classify.methods,
    'colors': [
      {
        '_id': 'prediction',
        'title': 'Prediction',
        # colors are assigned on the client side.
      },
      {
        '_id': 'correctness',
        'title': 'Correctness',
        'values': [{
            'title': 'Correct',
            'value': 1,
            'color': 'green'
          },{
            'title': 'Incorrect',
            'value': 0,
            'color': 'red'
          }]
      }
    ]
  }
}

# Json
def jsonify_category(c, keys=['title', 'types', 'colors']):
  return {key: (jsonify_types(c[key]) if key == 'types' else c[key]) for key in keys}

def jsonify_types(types, keys=['title', 'parameters']):
  return [{**{key: types[type_key].get(key) for key in keys}, '_id': type_key} for type_key in types]

json_config = [{**jsonify_category(config[c]), '_id': c} for c in config];