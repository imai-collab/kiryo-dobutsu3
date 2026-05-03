const MOVES = {
  P: [{ dc: 0, dr: -1 }],
  S: [
    { dc: 0, dr: -1 },
    { dc: -1, dr: -1 },
    { dc: 1, dr: -1 },
    { dc: -1, dr: 1 },
    { dc: 1, dr: 1 },
  ],
  PS: [
    { dc: 0, dr: -1 },
    { dc: -1, dr: -1 },
    { dc: 1, dr: -1 },
    { dc: -1, dr: 0 },
    { dc: 1, dr: 0 },
    { dc: 0, dr: 1 },
  ],
  K: [
    { dc: 0, dr: -1 },
    { dc: -1, dr: -1 },
    { dc: 1, dr: -1 },
    { dc: -1, dr: 0 },
    { dc: 1, dr: 0 },
    { dc: 0, dr: 1 },
    { dc: -1, dr: 1 },
    { dc: 1, dr: 1 },
  ],
  N: [
    { dc: -1, dr: -2 },
    { dc: 1, dr: -2 },
  ],
};
function getValidMoves(c, r, board) {
  const p = board[`${c},${r}`];
  if (!p) return [];
  let res = [];
  let moves = MOVES[p.type];
  const mul = p.enemy ? -1 : 1;
  for (let m of moves) {
    if (m.slide) {
      // not needed
    } else {
      let nc = c + m.dc * mul;
      let nr = r + m.dr * mul;
      if (nc >= 0 && nc <= 4 && nr >= 0 && nr <= 4) {
        let target = board[`${nc},${nr}`];
        if (!target || target.enemy !== p.enemy) {
          res.push(`${nc},${nr}`);
        }
      }
    }
  }
  return res;
}
function isKingInCheck(board, enemyKing) {
  let kx = -1, ky = -1;
  for (const [pos, p] of Object.entries(board)) {
    if (p.type === "K" && p.enemy === enemyKing) {
      const parts = pos.split(",");
      kx = parseInt(parts[0]);
      ky = parseInt(parts[1]);
      break;
    }
  }
  if (kx === -1) return false;
  for (const [pos, p] of Object.entries(board)) {
    if (p.enemy !== enemyKing) {
      const parts = pos.split(",");
      const moves = getValidMoves(parseInt(parts[0]), parseInt(parts[1]), board);
      if (moves.includes(`${kx},${ky}`)) return true;
    }
  }
  return false;
}
function getLegalMoves(board, isEnemy) {
  const legalMoves = [];
  for (const [pos, p] of Object.entries(board)) {
    if (p.enemy === isEnemy) {
      const parts = pos.split(",");
      const c = parseInt(parts[0]);
      const r = parseInt(parts[1]);
      const candidates = getValidMoves(c, r, board);
      for (const to of candidates) {
        const newBoard = { ...board };
        delete newBoard[pos];
        newBoard[to] = p;
        if (!isKingInCheck(newBoard, isEnemy)) {
          legalMoves.push({ from: pos, to });
        }
      }
    }
  }
  return legalMoves;
}
const board = {
  "2,4": { "type": "N", "enemy": false },
  "2,1": { "type": "S", "enemy": false },
  "0,2": { "type": "K", "enemy": true },
  "0,1": { "type": "PS", "enemy": false },
  "1,0": { "type": "S", "enemy": false },
  "1,4": { "type": "P", "enemy": false }
};
const isCheck = isKingInCheck(board, true);
const replies = getLegalMoves(board, true);
console.log(JSON.stringify({ isCheck, replies }));
