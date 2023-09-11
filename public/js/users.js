const loadingDOM = document.getElementById("loading-message1");
console.log(loadingDOM);
async function userLoader(){
    let users_res;
    try {
        users_res = await axios.get("/api/v1/users");
    } catch (error) {
        alert("internal serve error  cannot get /api/v1/users");
        console.log(error);
        return;
    }
    loadingDOM.innerHTML = "";
    const tableDOM = document.getElementById("users-table");
    let users_array = users_res.data;
    users_array.sort((user1,user2) => {
        if(user1.upsolve_solve_count === user2.upsolve_solve_count) return user2.contest_solve_count - user1.contest_solve_count;
        return user2.upsolve_solve_count - user1.upsolve_solve_count;
    });
    let rank = 0;
    users_array.forEach(user => {
        rank++;
        let upsolve_solve_count = user.upsolve_solve_count;
        let contest_solve_count = user.contest_solve_count;
        let practice_solve_count = user.practice_solve_count;
        let user_handle = user.user_handle;
        let row = document.createElement("tr");
        row.innerHTML = `
        <td>${rank}</td>
        <td>${user_handle}</td>
        <td>${upsolve_solve_count}</td>
        <td>${contest_solve_count}</td>
        <td>${practice_solve_count}</td>
       ` 
       tableDOM.appendChild(row);
    });
}