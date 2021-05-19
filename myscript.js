const teams = {"ARI": "Diamondbacks", "ATL": "Braves", "BAL": "Orioles", "BOS": "Red Sox", "CHC": "Cubs", "CHW": "White Sox", "CIN": "Reds", "CLE": "Indians", "COL": "Rockies", "DET": "Tigers", "FLA": "Marlins", "HOU": "Astros", "KAN": "Royals", "LAA": "Angels", "LAD": "Dodgers", "MIL": "Brewers", "MIN": "Twins", "NYM": "Mets", "NYY": "Yankees", "OAK": "Athletics", "PHI": "Philles", "PIT": "Pirates", "SDP": "Padres", "SF": "Giants", "SEA": "Mariners", "STL": "Cardinals", "TBR": "Rays", "TEX": "Rangers", "TOR": "Blue Jays", "WAS": "Nationals"}  
const teams_rev = {"Diamondbacks": "ARI", "Braves": "ATL", "Orioles": "BAL", "Red Sox":"BOS", "Cubs":"CHC", "White Sox":"CHW", "Reds":"CIN", "Indians":"CLE", "Rockies":"COL", "Tigers":"DET", "Marlins":"FLA", "Astros":"HOU", "Royals":"KAN", "Angels":"LAA", "Dodgers":"LAD", "Brewers":"MIL", "Twins":"MIN", "Mets":"NYM", "Yankees":"NYY", "Athletics":"OAK", "Philles":"PHI", "Pirates":"PIT", "Padres":"SDP", "Giants":"SF", "Mariners":"SEA", "Cardinals":"STL", "Rays":"TBR", "Rangers":"TEX", "Blue Jays":"TOR", "Nationals":"WAS"}  
var user = "";

function register(){
    const username = document.getElementById("register_username").value; 
    const password = document.getElementById("register_password").value;
    console.log(username);
    console.log(password);

    var data = { 'username': username, 'password': password };

    fetch("http://127.0.0.1:5000/register", {   //calls @app.route("/register")
        method: "POST",
        body: JSON.stringify(data),
        headers:{
        "content-type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            console.log("You've been registered!")
            user=username;
            user_info = document.createElement("button")
            user_info.appendChild(document.createTextNode("User Info"));
            user_info.setAttribute("id", "user_info");
            document.getElementById("user").appendChild(user_info);
            var team = prompt("What is your favorite MLB team? (just name not city)", "Cardinals");
            var name = prompt("What is your name?", "Sarah");
            var city = prompt("Where are you from?", "St. Louis");
            document.getElementById("user_info").addEventListener("click", getUser, false);
            setUserInfo(username, team, name, city);
        }
        else{
            console.log(`You were not registered ${data.message}`);
            if(data.message == "user already exists"){
                alert("User already exists!")
            }
            else if(data.message == "Could not add user"){
                alert("There was an error with the database. Please try again.")
            }
        }
    })
    .catch(err => console.error(err));
}

function setUserInfo(username, team, name, city){
    var data = {"username": username, "team" : team, "name": name, "city": city};

    fetch("http://127.0.0.1:5000/setInfo", {
        method: "POST",
        body: JSON.stringify(data),
        headers:{
        "content-type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            console.log("Team has been added!");
            fill_Dashboard(team);       //set up their dashboard with info on their team
        }
        else{
            console.log(`Could not add team: ${data.message}`);
        }
    })
    .catch(err => console.error(err));
}

function login(){
    const username = document.getElementById("username").value; 
    const password = document.getElementById("password").value;

    const data = { 'username': username, 'password': password };

    fetch("http://127.0.0.1:5000/login", {  
        method: "POST",
        body: JSON.stringify(data),
        headers:{
        "content-type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            console.log("You've been logged in!");
            user=username;
            user_info = document.createElement("button")
            user_info.appendChild(document.createTextNode("User Info"));
            user_info.setAttribute("id", "user_info");
            document.getElementById("user").appendChild(user_info);
            document.getElementById("user_info").addEventListener("click", getUser, false);
            console.log(data.team)
            fill_Dashboard(data.team);
        }
        else{
            console.log(`You were not logged in ${data.message}`);
            alert("Error logging you in. If you do not have an account, please register.");
        }
    })
    .catch(err => console.error(err));
}

function get_stat(stat){
    console.log("drop down worked! Stat is: " + stat);
    var year = document.getElementById("year").value;
    var data = {"stat": stat, "year": year};

    fetch("http://127.0.0.1:5000/get_stat", {  
        method: "POST",
        body: JSON.stringify(data),
        headers:{
        "content-type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            console.log("Got the team!" + data.best_team);
            var best_team = data.best_team
            console.log(teams[best_team]);
            document.getElementById("result").innerHTML = "Result: the " + teams[best_team] + "!";
        }
    })
    .catch(err => console.error(err));
}

function fill_Dashboard(team){
    console.log("in fill dash")
    document.getElementById("team_name").innerHTML = team;

    var data = {'team': teams_rev[team]};    //sends the abbrev because that is how it appears in the data

    fetch("http://127.0.0.1:5000/team_info", {  
        method: "POST",
        body: JSON.stringify(data),
        headers:{
        "content-type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            console.log("Got the team info!");
            wins = document.createElement("div");
            wins.innerHTML = "Wins: " + data.wins;
            document.getElementById("stats").appendChild(wins);
            losses = document.createElement("div");
            losses.innerHTML = "Losses: " + data.losses;
            document.getElementById("stats").appendChild(losses);
            winp = document.createElement("div");
            winp.innerHTML = "Win Percentage: " + data.winp;
            document.getElementById("stats").appendChild(winp);
            hr = document.createElement("div");
            hr.innerHTML = "Home Runs: " + data.home_runs;
            document.getElementById("stats").appendChild(hr);
            ba = document.createElement("div");
            ba.innerHTML = "Batting Average: " + data.ba;
            document.getElementById("stats").appendChild(ba);
            era = document.createElement("div");
            era.innerHTML = "Earned Run Average: " + data.era;
            document.getElementById("stats").appendChild(era);

            //https://www.geeksforgeeks.org/how-to-create-an-image-element-dynamically-using-javascript/
            if(team == "Cardinals"){
                var img = document.createElement('img');
                img.src = "https://upload.wikimedia.org/wikipedia/en/thumb/9/9d/St._Louis_Cardinals_logo.svg/1200px-St._Louis_Cardinals_logo.svg.png";
                img.width = 400;
                img.height = 400;
                document.getElementById('team_img').appendChild(img);
            }
            else if(team=="Astros"){
                var img = document.createElement('img');
                img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAABVlBMVEUHKFT////qWxj0hBLKycnsbhzwcxUAIlYAAETHxsb5hg6qZDP29vYAJlXb29vIzc/taRbgiWvpVQAAJVbf4ubxmn4AH0/sUgDSubHQzs3hgGBncYYWMVro6Oj71bnzewAAE0q4vcewsrgADkj64Nnero3859j62tAAIFfpWBj1XhDO0tjnoWn86eLpmV//iQjxfBb4zrvbn40+Mk32chYjLVHWVyHgWhz8YAi/UCvNVSW+USxtPES2Ty9WN0kAHFjlfhiLk6SQRTtLM0umSTU3L0+GQz2sWjD/eQJ3T0LDcCpsSUR4PkK4aS5jRUZhOUdXQUimYTVFOkyaXDjbeR6OVzyGSCU+GzjboXnWr6ONTTryjTLgaiDwkkPeln/QwLvbtZzpbj2dUznEYSy+Xy6hVTfuf1dQXnr1uaYvQ2bzq5REVHOdpLK4RBefOh4AAEiEe4C4gnVrBH7KAAAJDklEQVR4nO2d63vTNhTGU8eN4hAnJYaY0GUphA5XUFJoc+l9tAl0UOhgZWNc1rJxG+Oy/f9fZsWXWL4kcmJbjR69D20/FDXnF72R7OMjKZXi4uLi4uLi4uLi4uLi4uLi4uLi4uLiilzgvkI7hLh10JNphxCrlJ8O9tjuRO3BWgvQDiJWgVwGNlm2qfKwkYF7LBNqD3IZYYNlmyq5dGYJNmmHEZ90kyLCe+zaVHuE+lBYZ9emIJ1GhJB2HLEJmbRPeMiqTYFuUkQobLJqUy1tuFSAjPah8rhhEW6xidg3aZ9Q2Gbz6rtvUoNQYLIPlZ8bNiE8YhERnMsN+pBJmxomNQkFBglNk5qEcIc9m5omtfqwy14n7qYxl7Y12gFFLcukFiHcZ82mlkktQvZsqv2Iu1RoM3b1LT9tuAjhKls2BU9ybkLGMsO2SW1Cga3M8MCkA0K2MsMDkzoImbLprm3SASFTmWGHSR2E8DvacUUn8EvOj5ChzLDDpA5ChmzqNKmTkJ3MsNOkGCEzmWHtOO1LyExmWF5tBBAKtEOLSJhJMUJWMsO7TpPifchGyk1uNgIJ2Ui5gWe5QEI2MsO7x8GETNjUZVIXIQs2dZnURchCZlg7HkbIQMrNbVI34VlPuWVH6tuvNUsYoWrpt9F/I0sPcOHCaC3/YGj5es1BqN5eNlUl+Bv0COsz5KpKGOF18pb5Cr1kQAjCqiSOSZiXpoJQBxyTMC+JU0GoA45JqDdknLDCCTkhJ+SEnJATTgFhtVIdGWVVD9NLqLfMj2xZoD7jVyRRkgrDIq0WJNSDHsICajn07cmbLWMhVACJstViP3ZREgMgrSBFsegitFpKBX/IfEG0WhZkjSicMOkC5eGjc0R6flIsmpF6IR1BFi/dxCuG1Mu/FweQnpbVivnOFIsnz8lCOffoRRhE8OKgliNR7aUDsoJFKTqCTNfc1SYlVTh/yW4pORnzDrzFl2Rx5DKdbrikFlh9tZZZSRMoV3u9KKJQpQrWFVXJCFJEQfrmaUpq+4/+2yOJWMu8ySeevq7lgl/YoczcknAUNuMjg/trs7NEkLla7dapKBVwpyFCHc8dJJ6JKqlv7khFV8s+YfH0Vo2MLyMsLcH11BhpSe3hLBIp5PczHsLiqTdIV64NQX5yfwp1whPdeASvu4LwUEnAeCk7pflqzYAkeC1fwsWa9x13Ewqliz6El+Acgfp4Amyvjpt1lbU/DcTZ0f3oT+jtB1JC1f3fAgW3lQkS59rOrKmzS7g1WVJZSf1F1o2UCOFGc+LnAto9E3H4p5EOIdzTIni0g6bG0U6lQQjb+9E89jCmxhFOpUAIt+XIns1pj0cOOBQIJxxicCnNUQNO0oSwNfkQg2kwNQYMOAkTwj0Q+dNj8HQ2M8SpCRNGNMTgUlJvhzg1SUK4Oc51NonsqdGnGxMkhIfxPRoHvVdB3ZgYYeRDDK7B1OgecJIihN1JrrNJFDQ1JkW4E3/xRsC1eCKE493Kh5f2wmfACbgD9mhN9YiYcNxb+fAaTI0rQwklq9TEqWseLZMRwnYvuQIqWXnrHnB8CKWRSXt/+RPCbvRXMcOkHVpOXQkkHBMwgDB0tnBSuadGL+G4gH6EcCOZIQaTrL1zDjgewvHlJdSvsxPnQ9KOZgdOjZFwgmzhpBpMjZkYCaO8lQ+vwdQYH2Gkt/LhBZ6aA87c7VgIo8gWTihraoyHMI5b+fDSDjNxEUaVLZxU/Sc4MRDSHWIwoakxesI4b+XDS9uJnDDeW/nwUson0RJ+PQtDDKb6lUgJr9ZpA3nkIawWwijvJlygDeSRl9CspSGRhFUNMUiIA04XYZFEoqvua5oIT29ZujxEd/xGmgXaQB75ERYXrZKt0hD55tqmhtDMl855kqQO+eZLp4xwZRggE4TD+JggnGOd0PukgjHC4R9CFghH8E0/4dCJggXCUR/CqSesjQaccsLSaMDpJrzDCTnhWRInnH7CrC8hSS2z/x0wxQ1N/FSu1++6F9lVJUm8dlFVh3djSVUvu9eT6oTShbtKtkwby1K5np13d2CfsL+c6fblIZCq+t7nYUDeWCN2Y75ePwOQ8kL2wxXfqouq3akf36t+bi2pbz76tszbK72uzGcpQ2rZvz+TFJUsf2xbHQktPOGTuxbKl/bqP9kFioB3LxAEaUJeNBC32oixdP4accvqZ3oPobLEUaKFoWq/tlCRt3VElRxwZqZAby13lrzsqSBJqllbCLZgmD2GqjT3GCInREueVavwR2m2yAkLVPcYIidEq0K/2E/lZfB1SvZUCEUofXO0/HaDRULnU90sJ+SEnJATckIHYZ6omET0IyRtSZkQbUwyUqIfYYWkpUSdMETNjIuwQlyNQpWwUqkEFpFUcIlOwvqNAv7b4FqUSoXivUV5fn7+35uWzrv07zwu5816+YPrl+7Gtv7Tf0kNUA+0vPukYe02hJWQwFYTlHG5WuKSv3T8a1GE3TLlPIZ9wAqWgwm/SEm7B32TVbQP2RscsII/CR1jHaTSa/syUt7x2z67Aju2YrxFSrKy7YdonAUpI6Efxldysk8BcgLujXs+JdgKsinodGCnk1rvbACgf0twHaJlUud7PsEKAqW54e1G06ad/ZSy2YKpFGytJ0domXTwIYSbE5lIBl0PYn9jelnu7MvKelc4PBS6CRKaJh2UzEy+ggDseGxqnAVpEHY3NroJElomtWNpRbBSV06tu7rRsKlBuA9hL0FC06RW3VpUmwEA19RonAWJCDe2NX1s3U5upDGOqrInishW6iqr2NRo2HQfnRzVk3v6v8SOMDWOqjI/hJEuo5Nl59RonAUpG1/mj2RkmNSKIto1LuDQgUjtyNL+UVXmRBH5dhVKs2Uzwh6da1O51zA/hLFsVyEr9tRI68jSvkn7gDFtVwGOKNsUmVSIdS25nDIv4ujYFJlU92i8Cz3BHqRnU92k+kQR90JPsN9GiFSOLNWn+7j3bEKS5U1I5wBoudmYi3/PJiQ0NdI4WRc8O0hqQxWU36BgU+04uQ1V9Kmx00zotQZafZfkuwq2KNg02fH7rC3s5uLi4uLi4uLi4uLi4uLi4uLi4uLi4uKKRf8DYeenYAmEvkYAAAAASUVORK5CYII=";
                img.width = 400;
                img.height = 400;
                document.getElementById('team_img').appendChild(img);
            }
            else if(team=="Dodgers"){
                var img = document.createElement('img');
                img.src = "https://upload.wikimedia.org/wikipedia/en/thumb/a/a0/Los_Angeles_Dodgers_logo_%28low_res%29.svg/1200px-Los_Angeles_Dodgers_logo_%28low_res%29.svg.png";
                img.width = 400;
                img.height = 400;
                document.getElementById('team_img').appendChild(img);
            }
            //could continue for all teams but since it wasn't in the rubric I stopped here cause I kinda just did it for fun
        }
    })
    .catch(err => console.error(err));
}

function getUser(){                         
    console.log("getting user info");

    var data = {"username": user};
    
    fetch("http://127.0.0.1:5000/getUser", {  
        method: "POST",
        body: JSON.stringify(data),
        headers:{
        "content-type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            console.log("Got the user info!");
            user_name = data.name;
            city = data.city;
            team = data.team;
            alert("Hi " + user_name + "! Nice to have a " + team + " fan join us from " + city + "!");
        }
    })
    .catch(err => console.error(err));
}

function logout(){
    //remove the contents of dashboard
    while(document.getElementById("team_name").firstChild){    
        document.getElementById("team_name").removeChild(document.getElementById("team_name").firstChild);
    }
    while(document.getElementById("stats").firstChild){    
        document.getElementById("stats").removeChild(document.getElementById("stats").firstChild);
    }
    while(document.getElementById("team_img").firstChild){  
        document.getElementById("team_img").removeChild(document.getElementById("team_img").firstChild);
    }

    document.getElementById("user").removeChild(document.getElementById("user").lastChild); //remove the user info button

    while(document.getElementById("result").firstChild){
        document.getElementById("result").removeChild(document.getElementById("result").firstChild); //go ahead and clear the search
    }
}

document.getElementById("register_btn").addEventListener("click", register, false);

document.getElementById("login_btn").addEventListener("click", login, false);

document.getElementById("logout_btn").addEventListener("click", logout, false);

