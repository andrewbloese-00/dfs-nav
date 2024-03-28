import { MinHeap } from "./minheap.js";

//used to maintain heap position in the A* priority queue
const QueueComparator = (a, b) => a[0] - b[0];

//distance estimators for A*
const DistanceHeuristics = {
  /**
   * @about best suited for grid environments where only up, down, left, right, movement is permitted
   * @param {string} startNode
   * @param {string} endNode
   * @returns {Number} the manhattan distance estimation between startNode and endNode based on position
   */
  manhattan: (startNode, endNode) => {
    const [x1, y1] = startNode.split(",").map(Number);
    const [x2, y2] = endNode.split(",").map(Number);

    const xDistance = Math.abs(x1 - x2);
    const yDistance = Math.abs(y1 - y2);
    return xDistance + yDistance;
  },

  /**
   * @about best suited environments where direct / diagonal movement is permitted
   * @param {string} startNode
   * @param {string} endNode
   * @returns {Number} the euclidean distance estimation between startNode and endNode based on position
   */
  euclidean: (startNode, endNode) => {
    const [x1, y1] = startNode.split(",").map(Number);
    const [x2, y2] = endNode.split(",").map(Number);
    const xDistance = Math.abs(x1 - x2);
    const yDistance = Math.abs(y1 - y2);
    return Math.sqrt(xDistance * xDistance + yDistance * yDistance);
  },
};
/**
 * @param {{[vertexName:string]:string[]}} graph
 * @param {string} start 'x,y' key
 * @param {string} target 'x,y' key
 * @param {"manhattan"|"euclidean"} heuristic
 * @returns {[Number,string[]]} the cost of the shortest path along with the path itself
 */
export function aStar(graph, start, target, heuristic = "manhattan") {
  //sanity checks
  if (!(start in graph) || !(target in graph))
    throw new Error(
      "One or more of the provided vertices do not exist on the provided graph",
    );
  if ((!heuristic) in DistanceHeuristics)
    throw new Error(
      `Invalid heuristic: '${heuristic}}... Use "manhattan" or "euclidean"`,
    );
  //end sanity checks

  const dp = {}; //the distance and path
  for (const vertex in graph) dp[vertex] = [Infinity, [vertex]];
  dp[start][0] = 0;

  //create a 'Priority Queue' for path search
  const explorable = new MinHeap(QueueComparator);
  explorable.insert([0, start]);

  //until we find a path to the target node and have explorable nodes...
  while (explorable.size > 0 && dp[target][0] == Infinity) {
    const [currentDistance, currentVertex] = explorable.extract();
    for (const neighbor of graph[currentVertex]) {
      const newDistance =
        currentDistance + 1 + DistanceHeuristics[heuristic](neighbor, target);
      if (newDistance < dp[neighbor][0]) {
        const newPath = [...dp[currentVertex][1], neighbor];
        dp[neighbor][0] = newDistance;
        dp[neighbor][1] = newPath;
        explorable.insert([newDistance, neighbor]);
      }
    }
  }
  return dp[target];
}
