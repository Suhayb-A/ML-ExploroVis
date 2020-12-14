# ML ExploroVis

A Machine Learning Exploration Application.

## Structure

```
.
├── python                - Python application
│   ├── data              - Default data sets
│   ├── main.py           - Python entry point
│   ├── methods           - Algorithm config files
│   ├── requirements.txt  - Python production dependencies
│   └── ...
├── requirements.txt      - Python development dependencies
│
├── public                - Electron config
├── src                   - React application
└── ...
```

## Default Data Sets

The default data sets are loaded from `python/data`. To add new data sets simply
add a new CSV file. The name of the file will be used as the label for the data
set.

#### CSV Format

```csv
x,y,g
0,0,0
1,1,1
```

**Note:** *Colors are assigned using the 'g' column. 'g' values should be
positive integers, **'g' values of '-1's are uncolored.***

## Help Panel

The help panel presents the contents of the markdown files located at the
following directories:

* Data Set: `python/data/{Selected Data Set File Name}.md`
* Method: `python/methods/{selected_method_category_id}/{selected_method_id}.md`

When markdown files are not available for the selected data set or method the
default markdown files will be used.

* `python/data/default.md`
* `python/methods/default.md`

## Run

1. Install [Node.js](https://nodejs.org/en/).
2. Install [Yarn](https://classic.yarnpkg.com/en/docs/install/).
3. Install pPthon dependencies located at ```./requirements.txt```.
4. Install JavaScript dependencies:  ```yarn install```.
5. Start the application by calling:

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
