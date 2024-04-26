const util = require("util");
const { createQueue } = require("./queue.js");
const isValidMove = (move) => {
  const [row, col] = move;
  return row >= 0 && row <= 7 && col >= 0 && col <= 7;
};

const createVertex = (parent, move) => {
  return { parent: parent.slice(), move: move.slice() };
};
const getMovesForCell = (row, col) => {
  const m1 = [row - 1, col - 2];
  const m2 = [row - 1, col + 2];
  const m3 = [row + 1, col - 2];
  const m4 = [row + 1, col + 2];
  const m5 = [row - 2, col - 1];
  const m6 = [row - 2, col + 1];
  const m7 = [row + 2, col - 1];
  const m8 = [row + 2, col + 1];
  const possibleMoves = [m1, m2, m3, m4, m5, m6, m7, m8];
  return possibleMoves.filter(isValidMove).map((value) => ({
    parent: [row, col],
    move: value,
  }));
};
const createAdjacencyMatrix = () => {
  const adjacencyMatrix = Array.from(new Array(8), () => new Array(8));
  for (let i = 0; i < 8; i += 1) {
    for (let j = 0; j < 8; j += 1) {
      adjacencyMatrix[i][j] = getMovesForCell(i, j);
    }
  }
  return adjacencyMatrix;
};
const hasSameParent = (a, b) => {
  return a.parent[0] === b.parent[0] && a.parent[1] === b.parent[1];
};
const isSameVertex = (a, b, compareParent = false) => {
  return (
    (!compareParent || hasSameParent(a, b)) &&
    a.move[0] === b.move[0] &&
    a.move[1] === b.move[1]
  );
};
const getParent = (vertex, arr) => {
  const [row, col] = vertex.parent;
  return arr.findLast((ele) => {
    return ele.move[0] === row && ele.move[1] === col;
  });
};

const getPath = (vertex, arr, start) => {
  const path = [];
  let currentVertex = vertex;
  while (!isSameVertex(currentVertex, start)) {
    path.push(currentVertex);
    currentVertex = getParent(currentVertex, arr);
  }
  path.push(start);
  return path.reverse().map((ele) => ele.move);
};
const knightMoves = (start, goal) => {
  const adjacencyMatrix = createAdjacencyMatrix();
  const queue = createQueue();
  const visited = [];
  let res = null;
  const startVertex = createVertex([-1, -1], start);
  const goalVertex = createVertex([], goal);

  queue.enqueue(startVertex);
  while (!queue.isEmpty()) {
    const vertex = queue.dequeue();
    if (isSameVertex(vertex, goalVertex)) {
      res = vertex;
      break;
    }
    if (visited.some((value) => isSameVertex(value, vertex))) continue;
    visited.push(vertex);
    const [row, col] = vertex.move;
    adjacencyMatrix[row][col].forEach((ele) => {
      queue.enqueue(ele);
    });
  }
  return getPath(res, visited, startVertex);
};

const test = () => {
  console.log(knightMoves([0, 0], [3, 3]));
  console.log(knightMoves([3, 3], [0, 0]));
  console.log(knightMoves([3, 3], [4, 3]));
  console.log(knightMoves([0, 0], [7, 7]));
};

test();
