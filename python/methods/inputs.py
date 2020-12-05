def Range(arg_id, title, default_value, min, max):
  return {
    '_id': arg_id,
    'title': title,
    'tag': 'input',
    'value': {
      'type': 'range',
      'value': default_value,
      'default': default_value,
      'min': min,
      'max': max,
      'step': 0.01
    }
  }

# options are an array of strings and/or dictionaries {'value':'title'}
def Select(arg_id, title, default_value, options=[]):
  return {
    '_id': arg_id,
    'title': title,
    'tag': 'select',
    'value': {
      'value': default_value,
      'default': default_value,
      'options': options,
    }
  }

def Number(arg_id, title, default_value):
  return {
    '_id': arg_id,
    'title': title,
    'tag': 'input',
    'value': {
      'type': 'number',
      'step': 1,
      'value': default_value,
      'default': default_value,
    }
  }