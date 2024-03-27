const fs = require("fs")
const {createInterface } = require("readline/promises")

const STEP_DELAY = 100 //in ms
const PATH_TO_MAP = "maps/bigroom.txt" //path to map file
const START_POS = "6,19"; //"x,y" coordinates to start at, (column,row)


async function readMap(pathToMapFile){
    const map_matrix = [] 

    const reader = createInterface({
        input: fs.createReadStream(pathToMapFile,"utf-8")
    })

    for await ( const line of reader){
        map_matrix.push(
            line.split("")
                .filter((char)=>!isNaN(char))
                .map(Number)
        );
    }


    const xMax = map_matrix[0].length-1;
    const yMax = map_matrix.length-1;
    console.log(`MAP DIMENSIONS: ${xMax} x ${yMax}`)

    const mapGraph = new Map()
    for(let i = 0; i < map_matrix.length; i++) {
        for(let j = 0; j < map_matrix[i].length; j++) {
            if(map_matrix[i][j] === 1) continue; //do not mark walls
            const neighbors = []
            //i is y, j is x
            
            //cell 'above' 
            if(i > 0 && map_matrix[i-1][j] === 0){
                neighbors.push(`${j},${i-1}`);
            }
            //cell 'below'
            if( i < map_matrix.length-1 && map_matrix[i+1][j] === 0){
                neighbors.push(`${j},${i+1}`);
            }

            //cell left
            if( j > 0 && map_matrix[i][j-1] === 0){
                neighbors.push(`${j-1},${i}`);
            }

            //cell right
            if( j < map_matrix[i].length-1 && map_matrix[i][j+1] === 0){
                neighbors.push(`${j+1},${i}`)
            }
            mapGraph.set(`${j},${i}`,neighbors)

        }
    }
    return {map: mapGraph, map_matrix}
}

function printMatrix(matrix,iAt,jAt){
    let str =""
    for(let i = 0; i < matrix.length; i++){
        for(let j = 0; j < matrix[i].length; j++){
            if(i == iAt && j == jAt){
                str += "*"
            }
            else if(matrix[i][j] == 1) str += "#"
            else if(matrix[i][j] == 0) str += "•"
            else str += " "
        }
        str += "\n"

    }
    console.clear()
    console.log("CURRENTLY AT: ", [iAt,jAt])
    console.log(str)
}

const wait = ms => new Promise((resolve)=>setTimeout(resolve,ms))

/**
 * 
 * @param {Map<string,string[]>} graph 
 * @param {string} node the current node
 * @param {string[]} visited list of visited nodes
 */
async function dfs(graph,node,visited=[],matrix=undefined){
    if(!graph.has(node)) throw new Error("Encountered invalid node: " + node)
    await wait(STEP_DELAY)
    visited.push(node)
    if(matrix !== undefined){
        const [j,i] = node.split(",").map(Number)
        matrix[i][j] = "V"
        printMatrix(matrix,i,j)

    }


    for(const neighbor of graph.get(node)){
        if(!visited.includes(neighbor)) 
        await dfs(graph,neighbor,visited,matrix)
    }
    return visited
}


async function main(){
    const {map,map_matrix} = await readMap(PATH_TO_MAP)
    const visits = await dfs(map,START_POS,[],map_matrix)
    console.log(`Visited ${visits.length} cells to traverse entire map!`)
}
main()








