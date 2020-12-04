def Range(arg_id, title, default_value, min, max):
  return {
    '_id': arg_id,
    'title': title,
    'range': {
      'value': default_value,
      'min': min,
      'max': max
    }
  }