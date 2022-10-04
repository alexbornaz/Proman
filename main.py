from flask import Flask, render_template, url_for, redirect, request, session
from dotenv import load_dotenv
from util import json_response
import util
import mimetypes
import queries

mimetypes.add_type("application/javascript", ".js")
app = Flask(__name__)


app.secret_key = "shhh"


load_dotenv()


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template("index.html")


@app.route("/api/session", methods=["GET"])
@json_response
def session_status():
    return {"status": "active"} if session else {"status": "null"}


@app.route("/api/registration", methods=["POST"])
@json_response
def registration():
    if request.is_json:
        email = request.json.get("email")
        username = request.json.get("username")
        password = request.json.get("password")
        hashed_password = util.hash_password(password)
        queries.create_user(email, username, hashed_password)
        return ""


@app.route("/api/login-attempt", methods=["POST"])
@json_response
def login():
    if request.is_json:
        session.clear()
        email = request.json.get("email")
        password = request.json.get("password")
        user = queries.login_try(email)
        if user:
            if util.verify_password(password, user["password"]):
                session["id"] = user["id"]
                session["email"] = user["email"]
                session["username"] = user["username"]
                return {"msg": "matched"}
            else:
                return {"msg": "Wrong password!"}
        else:
            return {"msg": "Wrong email!"}


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("index"))


@app.route("/api/boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return queries.get_boards()


@app.route("/api/private-boards")
@json_response
def get_private_boards():
    print(session)
    if session:
        return queries.get_private_boards(session["username"])


@app.route("/api/boards/<int:board_id>/cards/")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return queries.get_cards_for_board(board_id)


@app.route("/api/createBoard/", methods=["POST"])
@json_response
def create_board():
    if request.is_json:
        boardTitle = request.json.get("element")
        id = queries.create_board(boardTitle, "public")
        queries.add_status("new", id["id"])
        queries.add_status("in progress", id["id"])
        queries.add_status("testing", id["id"])
        queries.add_status("done", id["id"])
        return id["id"]


@app.route("/api/createPrivateBoard/", methods=["POST"])
@json_response
def create_private_board():
    if request.is_json:
        board_title = request.json.get("boardTitle")
        owner = session["username"]
        id = queries.create_private_board(board_title, owner)
        queries.add_status("new", id["id"])
        queries.add_status("in progress", id["id"])
        queries.add_status("testing", id["id"])
        queries.add_status("done", id["id"])
        return ""


@app.route("/api/new-status", methods=["POST"])
@json_response
def create_column():
    if request.is_json:
        boardId = request.json.get("boardId")
        columnTitle = request.json.get("columnTitle")
        queries.add_column(boardId, columnTitle)
        return ""


@app.route("/api/create-card/", methods=["POST"])
@json_response
def create_card():
    if request.is_json:
        cardTitle = request.json.get("cardTitle")
        boardId = request.json.get("boardId")
        status_id = queries.get_status_of_new_from_board(boardId)["id"]
        order = len(queries.get_cards_by_column(status_id)) + 1
        queries.add_card(cardTitle, boardId, status_id, order)
        return ""


@app.route("/api/renameBoard/<boardId>/<boardTitle>/")
@json_response
def rename_board(boardId, boardTitle):
    return queries.rename_board(boardId, boardTitle)


@app.route("/api/edit-card-status", methods=["PUT"])
@json_response
def edit_status_of_card():
    if request.is_json:
        card_id = request.json.get("cardId")
        status_id = request.json.get("columnId")
        order = request.json.get("order")
        queries.edit_card_status(card_id, status_id, order)
        return ""


@app.route("/api/renameCard", methods=["POST"])
@json_response
def rename_card():
    if request.is_json:
        card_id = request.json.get("cardId")
        card_title = request.json.get("cardTitle")
        queries.rename_card(card_id, card_title)
        return ""


@app.route("/api/get-statusesByBoardId/<boardId>/")
@json_response
def getSBbI(boardId):
    return queries.getstatsBbI(boardId)


@app.route("/api/get-cardsCI/<columnId>")
@json_response
def get_card_by_column(columnId):
    return queries.get_cards_by_column(columnId)


@app.route("/api/rename-column", methods=["POST"])
@json_response
def rename_column():
    if request.is_json:
        col_id = request.json.get("columnId")
        col_title = request.json.get("columnTitle")
        queries.rename_column(col_id, col_title)
        return ""


@app.route("/api/delete-board/", methods=["DELETE"])
@json_response
def delete_board():
    if request.is_json:
        board_id = request.json.get("boardID")
        queries.delete_board(board_id)
        return ""


@app.route("/api/delete-card/", methods=["DELETE"])
@json_response
def delete_card():
    if request.is_json:
        card_id = request.json.get("cardId")
        queries.delete_card(card_id)
        return ""


@app.route("/api/delete-column/", methods=["DELETE"])
@json_response
def delete_column():
    if request.is_json:
        column_id = request.json.get("columnId")
        queries.delete_column(column_id)
        return ""


@app.route("/api/archived-for-board/<boardId>/")
@json_response
def get_archived_for_board(boardId):
    return queries.get_archived_cards(boardId)


@app.route("/api/archive-card", methods=["POST"])
@json_response
def archive_card():
    if request.is_json:
        card_id = request.json.get("cardId")
        queries.archive_card(card_id)
        return ""


@app.route("/api/unarchive-card", methods=["POST"])
@json_response
def unarchive_card():
    if request.is_json:
        card_id = request.json.get("cardId")
        queries.unarchive_card(card_id)
        return ""


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule(
            "/favicon.ico",
            redirect_to=url_for("static", filename="favicon/favicon.ico"),
        )


if __name__ == "__main__":
    main()
