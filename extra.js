let contestToProblemsMap = new Map();
const prob = {};
let arr = new Array();
if(contestToProblemsMap.has(prob.contestId)) arr = contestToProblemsMap.get(prob.contestId);
arr.push({"contestId": prob.contestId,"index":prob.index,"rating": prob.rating});
contestToProblemsMap.set(prob.contestId,arr);