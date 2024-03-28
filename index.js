import fs from "fs";
import { createInterface } from "readline/promises";
import { aStar } from "./lib/a_star.js";

const STEP_DELAY = 200; //in ms
const PATH_TO_MAP = "maps/house.txt"; //path to map fil
// const START_POS = ""; //"x,y" coordinates to start at, (column,row)

async function readMap(pathToMapFile) {
  const map_matrix = [];

  const reader = createInterface({
    input: fs.createReadStream(pathToMapFile, "utf-8"),
  });
  //read in line by line to construct matrix
  for await (const line of reader) {
    map_matrix.push(
      line
        .split("")
        .filter((char) => !isNaN(char))
        .map(Number),
    );
  }

  const mapGraph = {};
  for (let i = 0; i < map_matrix.length; i++) {
    for (let j = 0; j < map_matrix[i].length; j++) {
      if (map_matrix[i][j] === 1) continue; //do not mark walls
      //determine neighbor cells
      const neighbors = [];
      //cell 'above'
      if (i > 0 && map_matrix[i - 1][j] === 0) {
        neighbors.push(`${j},${i - 1}`);
      }
      //cell 'below'
      if (i < map_matrix.length - 1 && map_matrix[i + 1][j] === 0) {
        neighbors.push(`${j},${i + 1}`);
      }

      //cell left
      if (j > 0 && map_matrix[i][j - 1] === 0) {
        neighbors.push(`${j - 1},${i}`);
      }

      //cell right
      if (j < map_matrix[i].length - 1 && map_matrix[i][j + 1] === 0) {
        neighbors.push(`${j + 1},${i}`);
      }
      mapGraph[`${j},${i}`] = neighbors;
    }
  }
  return { map: mapGraph, map_matrix };
}

function printMatrix(matrix, iAt, jAt) {
  let str = "";
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (i == iAt && j == jAt) {
        str += "*";
      } else if (matrix[i][j] == 1) str += "#";
      else if (matrix[i][j] == 0) str += "•";
      else str += " ";
    }
    str += "\n";
  }
  if (iAt !== undefined && jAt !== undefined) {
    console.clear();
    console.log("CURRENTLY AT: ", [jAt, iAt]);
  }
  console.log(str);
}

function resetMatrix(matrix) {
  console.time("reset map matrix");
  if (matrix) {
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        //reset non walls
        if (matrix[r][c] != 1) matrix[r][c] = 0;
      }
    }
    console.timeEnd("reset map matrix");
    printMatrix(matrix);
  }
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 *
 * @param {{[key:string]:string[]}} graph
 * @param {string} node the current node
 * @param {string[]} visited list of visited nodes
 */

async function dfs(graph, node, visited = [], matrix = undefined) {
  if (graph[node] === undefined)
    throw new Error("Encountered invalid node: " + node);
  await wait(STEP_DELAY);
  visited.push(node);
  if (matrix !== undefined) {
    const [j, i] = node.split(",").map(Number);
    matrix[i][j] = "V";
    printMatrix(matrix, i, j);
  }

  for (const neighbor of graph[node]) {
    if (!visited.includes(neighbor)) {
      //navigate from last visit to neighbor
      const distToNext = aStar(graph, visited.at(-1), neighbor);
      console.log("'best' path: ", distToNext[1].join(" -> "));
      console.log("Est. Dist =  ", distToNext[0]);
      console.log("Actual Moves = ", distToNext[1].length - 1);
      if (distToNext[0] > 1) {
        console.log("Waiting for move to target...");
        await wait(5000);
      }

      await dfs(graph, neighbor, visited, matrix);
    }
  }

  return visited;
}

async function exploreMap(mapGraph, mapMatrix, pos) {
  const p = pos || [...mapGraph.keys()][0];

  const visits = await dfs(mapGraph, p, [], mapMatrix);
  console.log("# Cells Discovered: ", visits.length);
  resetMatrix(mapMatrix);
}

async function main() {
  const { map, map_matrix } = await readMap(PATH_TO_MAP);
  exploreMap(map, map_matrix, "1,1");

  // const visits = await dfs(map, START_POS, [], map_matrix);
  // console.log(`Visited ${visits.length} cells to traverse entire map!`);
}
main();
