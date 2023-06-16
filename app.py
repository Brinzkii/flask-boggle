from boggle import Boggle
from flask import (
    Flask,
    render_template,
    session,
    jsonify,
    request,
    make_response,
)

app = Flask(__name__)
app.config["SECRET_KEY"] = "boggle"
boggle_game = Boggle()


@app.route("/")
def show_board():
    """Create and render initial board"""

    board = boggle_game.make_board()
    session["board"] = board
    return render_template("game.html")


@app.route("/check_guess", methods=["POST"])
def check_guess():
    """Check if guess is a valid word, and if it exists on the board"""

    word = request.json["word"]
    board = session["board"]

    response = boggle_game.check_valid_word(board, word)
    return jsonify(f"result: {response}")


@app.route("/end_game", methods=["GET", "POST"])
def end_game():
    """Update top score and # of attempts cookies"""

    score = request.json["score"]
    top_score = int(request.cookies.get("top_score", 0))
    times_played = int(request.cookies.get("times_played", 0))
    times_played += 1

    resp = make_response(render_template("game.html"))
    resp.set_cookie("times_played", str(times_played))
    if score > top_score:
        resp.set_cookie("top_score", str(score))
    return resp
