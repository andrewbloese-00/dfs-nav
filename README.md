# Navigator Experiment
Currently constructs a graph using an input text "map" file, and then simulates a DFS traversal of the map, drawing each stage of the traversal in text art. 

## Map Format
`1` denotes a wall or obstruction
`0` denotes a free space

**Example**
```
###### -> 111111
#    # -> 100001
# #  # -> 101001
###### -> 111111
```


## Usage
To test you can create your own map file or use one in the `maps/` folder and update the top of `index.js` to match your desired map and starting point. 

```javascript
//in index.js
const STEP_DELAY = 100 //in ms
const PATH_TO_MAP = "path/to/map.txt"
const START_POS = "x,y"; //"col,row"
```

Save then run `node index.js` to watch a terminal animation of the map being 'explored.'

![Terminal Output](https://firebasestorage.googleapis.com/v0/b/storeshit.appspot.com/o/navigator-experiment%2Fnav.png?alt=media&token=e71b9948-f087-44dc-b3c2-920c9b9eade8)


**Output Key** 
- ` ` (space) -> an explored cell
- `#` -> a wall / obstacle
- `•` -> an explorable cell
- `*` -> the current position




