# ML ExporoVis - A Machine Learning Visualization for Novice Users


# Default data sets

The default data sets are loaded from `python/data`. To add new data sets simply
add a new CSV file. The name of the file is used as a label for the data set.

### CSV Format

```{csv}
x,y,g
0,0,0
1,1,1
```

**Note:** Colors are assigned using the 'g' column. 'g' should contain positive
integers, '-1's are always uncolored.