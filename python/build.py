import methods;
import json;

with open("./src/congfig.json", "w") as outfile:
  json.dump(methods.json_config, outfile)