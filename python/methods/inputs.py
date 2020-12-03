def Range(title, default_value, min, max):
  return {
    'title': title,
    'range': {
      'value': default_value,
      'min': min,
      'max': max
    }
  }