import sqlite3
from flask import Flask, request, jsonify, current_app, g
from flask_cors import CORS 
from werkzeug.security import generate_password_hash, check_password_hash
from pybaseball import team_batting, team_pitching
import pandas as pd

app = Flask(__name__)  
CORS(app, resources={r"/*": {"origins": "*"}})


#https://flask.palletsprojects.com/en/1.1.x/patterns/sqlite3/
DATABASE = '/Users/ssult/CSE330/creativeproject-creativeproject-464413/330_proj.db'   
#end citation

@app.route("/register", methods=('GET', 'POST'))
def register():
    if request.method == "POST":
        #https://stackoverflow.com/questions/48218065/programmingerror-sqlite-objects-created-in-a-thread-can-only-be-used-in-that-sa
        with sqlite3.connect(DATABASE) as con:
            cur = con.cursor()
            #end citation
            username = request.json["username"]
            password = request.json["password"]
            pwd_hash = generate_password_hash(password)
            cur.execute('SELECT * FROM users WHERE username=?', (username,))
            user = cur.fetchone()
            if user is not None:
                return jsonify({"success": False, "message": "user already exists"})
            #only gets here if user is None
            cur.execute('INSERT INTO users (username, pwd_hash) VALUES (?,?)', (username, pwd_hash))
            con.commit()
            return jsonify({"success": True})

@app.route("/setInfo", methods=["GET","POST"])
def setTeam():
    if request.method == "POST":
        with sqlite3.connect(DATABASE) as con:
            cur = con.cursor()
            username = request.json["username"]
            team = request.json["team"]
            name = request.json["name"]
            city = request.json["city"]
            cur.execute("UPDATE users SET team=? where username=?", (team, username)) 
            cur.execute("UPDATE users SET name=? where username=?", (name, username))
            cur.execute("UPDATE users SET city=? where username=?", (city, username))
            return jsonify({"success": True})

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        #https://stackoverflow.com/questions/48218065/programmingerror-sqlite-objects-created-in-a-thread-can-only-be-used-in-that-sa
        with sqlite3.connect(DATABASE) as con:
            cur = con.cursor()
            #end citation
            username = request.json["username"]
            password = request.json["password"]
            cur.execute('SELECT * FROM users WHERE username=?', (username,))
            user = cur.fetchone()
            if user is None:
                return jsonify({"success": False, "message": "No such user"})
            else:
                if(check_password_hash(user[1],password)):      #user[1] = user["pwd_hash"] if it was json
                    return jsonify({"success": True, "team" : user[2]})        #send the client success AND user's team (should already be created when they registered the first time)
                else:
                    return jsonify({"success": False, "message": "Incorrect password"})

@app.route("/getUser", methods=("GET", "POST"))
def getUser():
    if request.method == "POST":
        with sqlite3.connect(DATABASE) as con:
            cur = con.cursor()
            username = request.json["username"]
            print(username)
            cur.execute("SELECT * FROM users WHERE username=?", (username,))  #not working??
            user = cur.fetchone()
            return jsonify({"success": True, "name": user[3], "team": user[2], "city": user[4]})

@app.route("/get_stat", methods=("GET", "POST"))
def get_stat():
    if request.method == "POST":
        stat = request.json["stat"]
        year = request.json["year"]
        if stat == "avg":     
            data=team_batting(year)
            best_team = pd.DataFrame(data[data.AVG == data.AVG.max()])
            best_team_name = best_team.values[0][2]
            return jsonify({"success": True, "best_team": best_team_name})
        elif stat=="obp":
            data=team_batting(year)
            best_team = pd.DataFrame(data[data.OBP == data.OBP.max()])
            best_team_name = best_team.values[0][2]
            return jsonify({"success": True, "best_team": best_team_name})
        elif stat == "slg":
            data=team_batting(year)
            best_team = pd.DataFrame(data[data.SLG == data.SLG.max()])
            best_team_name = best_team.values[0][2]
            return jsonify({"success": True, "best_team": best_team_name})
        elif stat == "ops":
            data=team_batting(year)
            best_team = pd.DataFrame(data[data.OPS == data.OPS.max()])
            best_team_name = best_team.values[0][2]
            return jsonify({"success": True, "best_team": best_team_name})
        elif stat == "era":
            data=team_pitching(year)
            best_team = pd.DataFrame(data[data.ERA == data.ERA.min()])
            best_team_name = best_team.values[0][2]
            return jsonify({"success": True, "best_team": best_team_name})
        elif stat == "fip":
            data=team_pitching(year)
            best_team = pd.DataFrame(data[data.FIP == data.FIP.min()])
            best_team_name = best_team.values[0][2]
            return jsonify({"success": True, "best_team": best_team_name})
        elif stat == "whip":       
            data=team_pitching(year)
            best_team = pd.DataFrame(data[data.WHIP == data.WHIP.min()])
            best_team_name = best_team.values[0][2]
            return jsonify({"success": True, "best_team": best_team_name})

@app.route("/team_info", methods=("GET", "POST"))
def team_info():                            #need to finish!!
    if request.method == "POST":
        team = request.json["team"]
        batting = team_batting(2021)
        batting_team = pd.DataFrame(batting[batting.Team == team])
        pitching = team_pitching(2021)
        pitching_team = pd.DataFrame(pitching[pitching.Team == team])
        wins = int(pitching_team.values[0][4])
        losses = int(pitching_team.values[0][5])
        home_runs = int(batting_team.iloc[0]['HR'])
        winp = wins/(wins+losses)
        ba = batting_team.iloc[0]["AVG"]
        era = pitching_team.iloc[0]["ERA"]

        return jsonify({"success": True, "wins": wins, "losses": losses, "winp": round(winp,3), "home_runs": home_runs, "ba": ba, "era": era})