const tableDOM = document.getElementById("problems-table");
const loadingDOM = document.getElementById("loading-message");
const starterMessageDOM = document.getElementById("starter-message");
const user_name_form = document.getElementById("user_name_form");
user_name_form.addEventListener('submit',async (e) => {
    e.preventDefault();
    loadingDOM.innerHTML = `<div class="spinner-border" style="width: 3rem; height: 3rem;" role="status">
    <span class="sr-only">Loading...</span>
  </div>
  <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
    <span class="sr-only">Loading...</span>
  </div>`;
    const formData = new FormData(user_name_form);
    var object = {};
    formData.forEach(function(value, key){
        object[key] = value;
    });
    const data = {
        codeForces_id: object.codeForces_id + "",
        key2: "world"
    }
   // data.codeForces_id = data.codeForces_id.toLowerCase();
    const RES = await axios.post('/api/v1/problems',data);
    if(RES.data.contests === undefined){
        alert("enter a valid username");
        loadingDOM.innerHTML = "";
        return;
    }
    let upsolve_solve_count = RES.data.upsolve_solve_count;
    let contest_solve_count = RES.data.contest_solve_count;
    let practice_solve_count = RES.data.practice_solve_count;
    starterMessageDOM.innerHTML = "";
    loadingDOM.innerHTML = "";
    tableDOM.innerHTML = `
        <thead>
          <tr>
            <th scope="col">Contest</th>
            <th scope="col">Problem</th>
          </tr>
        </thead>
        <tbody>
    `
    RES.data.contests.forEach(contest => {
        const row = document.createElement("tr");
        const col1 = document.createElement("td");
        col1.innerHTML = `<p>${contest.contestId}   div ${contest.problems[0].div}</p>`;
        const col2 = document.createElement("td");
        col2.className = "d-flex";
        const horizontal_line = document.createElement("hr");
        horizontal_line.style.backgroundColor = "black";
        contest.problems.forEach((prob) => {
            const cur_div = document.createElement("div");
            cur_div.className = "p-2";
            const link = document.createElement("a");
            link.href = `https://codeforces.com/problemset/problem/${prob.contestId}/${prob.index}`;
            link.text = `${prob.contestId}${prob.index} `;
            cur_div.appendChild(link);
            if(prob.rating){
                const rating_div = document.createElement("div");
                rating_div.style.bottom = "0";
                rating_div.style.right = "0";
                rating_div.innerHTML = `${prob.rating}`;
                rating_div.style.fontSize = "0.8em";
                cur_div.appendChild(rating_div);
            }
            if(prob.status === "CONTEST"){
                cur_div.style.backgroundColor = "#9fff80";
            }
            else if(prob.status === "UPSOLVED") {
                cur_div.style.backgroundColor = "#00cc00";
            }
            else if(prob.status === "PRACTICE"){
                cur_div.style.backgroundColor = "#80e5ff";
            }
            else if(prob.status === "TRIED"){
                cur_div.style.backgroundColor = "#ffa366";
            }
            col2.appendChild(cur_div);
        })
        row.appendChild(col1);
        row.appendChild(col2);
   //     row.appendChild(horizontal_line);
        tableDOM.appendChild(row);
    });
    tableDOM.innerHTML = tableDOM.innerHTML + `</tbody>`;
     let US = document.getElementById("user-stats");
//     //console.log("user_stats= " + user_stats);
     US.innerHTML="";
    let user_stats = document.createElement("div");
    const contest_solve_div = document.createElement("div");
    contest_solve_div.innerHTML = `Contest Problem Count = ${contest_solve_count}`;
    contest_solve_div.style.backgroundColor = "#9fff80";
    const upsolve_solve_div = document.createElement("div");
    upsolve_solve_div.innerHTML = `UpSolve Problem Count = ${upsolve_solve_count}`;
    upsolve_solve_div.style.backgroundColor = "#00cc00";
    const practice_solve_div = document.createElement("div");
    practice_solve_div.innerHTML = `Practice Problem Count = ${practice_solve_count}`;
    practice_solve_div.style.backgroundColor = "#80e5ff";
    user_stats.appendChild(contest_solve_div);
  //  user_stats.append(document.createElement("br"));
    user_stats.appendChild(upsolve_solve_div);
 //   user_stats.append(document.createElement("br"));
    user_stats.appendChild(practice_solve_div);
    US.appendChild(user_stats);
    // document.getElementById("main-menu").appendChild(user_stats);
    // console.log(document.getElementById("main-menu"));
    console.log("hello on submit end");
})