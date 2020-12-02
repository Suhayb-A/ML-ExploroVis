# ML ExporoVis

A Machine Learning Exploration Application.

## Structure

```
.
├── public                - React public
├── python                - Python application
│   ├── data              - Default data sets
│   ├── main.py           - Python entry point
│   ├── methods           - Algorithm Config files
│   └── requirements.txt  - Python production dependencies
├── requirements.txt      - Python development dependencies
└── src                   - React application
```

## Default data sets

The default data sets are loaded from `python/data`. To add new data sets simply
add a new CSV file. The name of the file will be used as the label for the data set.

#### CSV Format

```csv
x,y,g
0,0,0
1,1,1
```

**Note:** Colors are assigned using the 'g' column. 'g' should contain positive
integers, '-1's are always uncolored.

## Run

1. Install [Node.js](https://nodejs.org/en/).
2. Install [Yarn](https://classic.yarnpkg.com/en/docs/install/).
3. Install python dependencies located at ```./requirements.txt```.
4. Start the application by calling:

```sh
yarn start
```

## Build

```sh
yarn build
```

**Note:** *Before building the application, make sure that the python dependencies are installed. The python dependencies
are located in: ```./requirements.txt```.*

*Built using python v.3.7.6*
