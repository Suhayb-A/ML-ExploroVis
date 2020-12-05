def Range(arg_id, title, default_value, min, max):
  return {
    '_id': arg_id,
    'title': title,
    'input': {
      'type': 'range',
      'value': default_value,
      'min': min,
      'max': max
    }
  }

def Select(arg_id, title, default_value, values=[]):
  return {
    '_id': arg_id,
    'title': title,
    'select': {
      'value': default_value,
      'values': values,
    }
  }