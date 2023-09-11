const { default: axios } = require("axios");
const {addUser} = require("../controllers/users");

const getAllProblems = async (req,res) => {
    res.send("get");
}

function getDivision(str){
    let div = "";
    
    str = str.replace(/\s+/g, '');
    for(let i=0;i<str.length - 3;i++){
        if(str.substring(i,i+3).toLowerCase() === "div"){
            div = div + "+" + str.substring(i+4,i+5);
        }
    }
    return div.substring(1);
}




/*

contest obj => 
  1. int id
  2. string division string
  3. obj[] problems //Sorted by difficulty




problem obj ->
   0. String id
   1. String problem number (A, B1, B2, C)   [index]
   2. Integer Difficulty
*/

















const userProblems = async (req,res) => {
  ////  console.log(req.body);
    let user = req.body.codeForces_id+"";
    user = user.toLowerCase();
    let raw_user_contests;
    try{
        raw_user_contests = await axios.get(`https://codeforces.com/api/user.rating?handle=${user}`);
    }
    catch(e){
        res.send({contests: undefined});
        return;
    }
// let user = "java_programmer";
 //   user = "java_programmer";
 //   console.log("user= " + user);
  // res.send("ok");
   let raw_contests;
    try {
        raw_contests = await axios.get("https://codeforces.com/api/contest.list");
    } catch (error) {
        res.send("error with codeforces API");
        return;
    }
    const contests_array = raw_contests.data.result;
    const required_contests = contests_array.filter((contest) =>contest.phase === "FINISHED" && getDivision(contest.name).length > 0)
                .map((contest) => {
                    return {
                    id: contest.id,
                    div: getDivision(contest.name)
                }});
    const constestMap = new Map();
    required_contests.forEach(contest => {
        constestMap.set(contest.id,contest.div);
    });
    let raw_problem_set;
    try {
        raw_problem_set  = await axios.get("https://codeforces.com/api/problemset.problems");
    } catch (error) {
        res.send("error with codeforces API");
        return;
    }
    const valid_problems = raw_problem_set.data.result.problems.filter((problem) => constestMap.has(problem.contestId));
    let contestToProblemsMap = new Map();
    const user_constests = new Set();
   // console.log(raw_user_contests.data.result[0].contestId);
    
    raw_user_contests.data.result.forEach((contest) => {
        user_constests.add(contest.contestId);
    });
    let raw_user_submissions
   try {
     raw_user_submissions = await axios.get(`https://codeforces.com/api/user.status?handle=${user}&from=1&count=1000000`);
   } catch (error) {
    res.send("error with codeforces API");
    return;
   }
    const user_submissions = raw_user_submissions.data.result;
    let upsolved_set = new Set();
    let practice_set = new Set();
    let tried_set = new Set();
    let contest_set = new Set();
  //  console.log(user_submissions[0]);
    /*
        Submission 
        problem.constestId + problem.index
        author.participantType


    */
   user_submissions.forEach((submission) => {
    let AC = (submission.verdict === "OK");
    if(user_constests.has(submission.contestId)){
        if(AC){
            if(submission.author.participantType === "CONTESTANT") contest_set.add(submission.problem.contestId + submission.problem.index);
            else upsolved_set.add(submission.problem.contestId + submission.problem.index);
        }
        else {
            tried_set.add(submission.problem.contestId + submission.problem.index);
        }
    }
    else{
        if(AC) practice_set.add(submission.problem.contestId + submission.problem.index);
        else tried_set.add(submission.problem.contestId + submission.problem.index);
    }
   });
  // upsolved_set.forEach(c => console.log(c));
  //  console.log(user_submissions[0]);
    valid_problems.forEach(prob => {
        let arr = new Array();
        if(contestToProblemsMap.has(prob.contestId)) arr = contestToProblemsMap.get(prob.contestId);
        let problem_id = prob.contestId + prob.index;
        let str = "TODO";
        if(contest_set.has(problem_id)) str = "CONTEST";
        else if(upsolved_set.has(problem_id)) str = "UPSOLVED";
        else if(practice_set.has(problem_id)) str = "PRACTICE";
        else if(tried_set.has(problem_id)) str = "TRIED";
        arr.push({"contestId": prob.contestId,"index":prob.index,"rating": prob.rating,"div": constestMap.get(prob.contestId),"status": str});
        contestToProblemsMap.set(prob.contestId,arr);
    });
    let A = new Array();
    for(let [contestId,problems] of contestToProblemsMap.entries()){
        problems = problems.reverse();
 //       console.log(problems[0])
        A.push({contestId, problems});
    }
 //   A.sort((a,b)=>b.contestId - a.contestId);
    let contest_solve_count = contest_set.size;
    let upsolve_solve_count = upsolved_set.size;
    let practice_solve_count = practice_set.size;
    console.log(contest_solve_count,upsolve_solve_count,practice_solve_count);
    const data = {
        "contests": A,
        "contest_solve_count": contest_solve_count,
        "upsolve_solve_count": upsolve_solve_count,
        "practice_solve_count": practice_solve_count
    }
    // try {
    //     await axios.post("/api/v1/users",);
    // } catch (error) {
    //     console.log("could not post on api/v1/users");
    //     console.log(error);
    // }
    await addUser({
        user_handle: user,
        contest_solve_count: contest_solve_count,
        upsolve_solve_count: upsolve_solve_count,
        practice_solve_count: practice_solve_count
    });
    res.send(data);
}



module.exports = {getAllProblems,userProblems};

