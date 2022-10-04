import data_manager


@data_manager.connection_handler
def get_card_status(cursor, status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    cursor.execute(
        """
        SELECT * FROM statuses s
        WHERE s.id = %(status_id)s
        ;
        """,
        {"status_id": status_id},
    )

    return cursor.fetchone()


@data_manager.connection_handler
def get_boards(cursor):
    """
    Gather all boards
    :return:
    """
    # remove this code once you implement the database

    cursor.execute(
        """
        SELECT * FROM boards WHERE owner = 'public'
        ORDER BY id
        ;
        """
    )
    return cursor.fetchall()


@data_manager.connection_handler
def get_archived_cards(cursor, boardId):
    cursor.execute(
        """
        SELECT * FROM archive WHERE board_id= %(boardId)s
        ORDER BY id
        ;
        """,
        {"boardId": boardId},
    )
    return cursor.fetchall()


@data_manager.connection_handler
def get_private_boards(cursor, owner):
    cursor.execute(
        """
        SELECT * FROM boards WHERE owner=%(owner)s
        ORDER BY id
        ;
        """,
        {"owner": owner},
    )
    return cursor.fetchall()


@data_manager.connection_handler
def get_cards_for_board(cursor, board_id):
    # remove this code once you implement the database

    cursor.execute(
        """
        SELECT * FROM cards
        WHERE cards.board_id = %(board_id)s
        ;
        """,
        {"board_id": board_id},
    )

    return cursor.fetchall()


@data_manager.connection_handler
def get_cards_by_column(cursor, column_id):
    cursor.execute(
        """
        SELECT * FROM cards
        WHERE cards.status_id = %(column_id)s
        ORDER BY card_order
        ;
        """,
        {"column_id": column_id},
    )

    return cursor.fetchall()


@data_manager.connection_handler
def getstatsBbI(cursor, board_id):
    cursor.execute(
        """
            SELECT * FROM statuses
            WHERE statuses.board_id = %(board_id)s
            ORDER BY id
            ;
            """,
        {"board_id": board_id},
    )

    return cursor.fetchall()


@data_manager.connection_handler
def get_status_of_new_from_board(cursor, board_id):
    cursor.execute(
        """
        SELECT id
        FROM statuses
        WHERE title='new' AND board_id = %(board_id)s
        """,
        {"board_id": board_id}
    )
    return cursor.fetchone()


@data_manager.connection_handler
def create_user(
    cursor,
    email,
    username,
    psw,
):
    cursor.execute(
        """INSERT INTO users (email,username,password)
        VALUES (%(email)s, %(username)s, %(psw)s);""",
        {"email": email, "username": username, "psw": psw},
    )


@data_manager.connection_handler
def login_try(cursor, email):
    cursor.execute(
        """SELECT * from users
        WHERE email =%(email)s""",
        {"email": email},
    )
    return cursor.fetchone()


@data_manager.connection_handler
def add_status(cursor, status_title, board_id):
    cursor.execute(
        """
        INSERT INTO statuses(title, board_id)
        VALUES (%(status_title)s, %(board_id)s)
        ;
        """,
        {"status_title": status_title, "board_id": board_id},
    )


@data_manager.connection_handler
def create_board(cursor, title, owner):
    cursor.execute(
        "INSERT INTO boards(title,owner) VALUES(%(title)s, %(owner)s) RETURNING id;",
        {"title": title, "owner": owner},
    )
    return cursor.fetchone()


@data_manager.connection_handler
def create_private_board(cursor, title, owner):
    cursor.execute(
        "INSERT INTO boards(title,owner) VALUES(%(title)s, %(owner)s) RETURNING id;",
        {"title": title, "owner": owner},
    )
    return cursor.fetchone()


@data_manager.connection_handler
def add_column(cursor, b_id, title):
    cursor.execute(
        "INSERT INTO statuses (title,board_id) VALUES(%(title)s,%(b_id)s);",
        {"title": title, "b_id": b_id},
    )


@data_manager.connection_handler
def add_card(cursor, cardName, board_id, status_id, order):
    cursor.execute(
        """
        INSERT INTO cards (board_id,status_id,title,card_order)
        VALUES (%(board_id)s, %(status_id)s, %(cardName)s, %(order)s);
        """,
        {
            "cardName": cardName,
            "board_id": board_id,
            "status_id": status_id,
            "order": order,
        },
    )


@data_manager.connection_handler
def edit_card_status(cursor, cardId, statusId, order):
    cursor.execute(
        """ UPDATE cards SET status_id=%(statusId)s, card_order=%(order)s
        WHERE cards.id = %(cardId)s;""",
        {"cardId": cardId, "statusId": statusId, "order": order},
    )


@data_manager.connection_handler
def rename_board(cursor, id, title):
    cursor.execute(
        "UPDATE boards SET title=%(title)s WHERE id=%(id)s;",
        {"id": id, "title": title},
    )


@data_manager.connection_handler
def rename_card(cursor, card_id, title):
    cursor.execute(
        """UPDATE cards SET title=%(title)s WHERE id=%(card_id)s;""",
        {"card_id": card_id, "title": title},
    )


@data_manager.connection_handler
def rename_column(cursor, col_id, col_title):
    cursor.execute(
        """UPDATE statuses SET title=%(col_title)s WHERE id=%(col_id)s;""",
        {"col_id": col_id, "col_title": col_title},
    )


@data_manager.connection_handler
def delete_board(cursor, board_id):
    cursor.execute(
        """DELETE FROM cards WHERE board_id=%(board_id)s;
           DELETE FROM statuses WHERE board_id=%(board_id)s;
           DELETE FROM boards WHERE id=%(board_id)s;
        """,
        {"board_id": board_id},
    )


@data_manager.connection_handler
def delete_card(cursor, card_id):
    cursor.execute("DELETE FROM cards WHERE id=%(card_id)s;", {"card_id": card_id})


@data_manager.connection_handler
def delete_column(cursor, column_id):
    cursor.execute(
        """
        DELETE FROM cards WHERE status_id=%(column_id)s;
        DELETE FROM statuses WHERE id=%(column_id)s;
        """,
        {"column_id": column_id},
    )


@data_manager.connection_handler
def archive_card(cursor, card_id):
    cursor.execute(
        """ WITH moved_row AS (
            DELETE FROM cards where id = %(card_id)s
            RETURNING * )
            INSERT INTO  archive SELECT * FROM moved_row;
        """,
        {"card_id": card_id},
    )


@data_manager.connection_handler
def unarchive_card(cursor, card_id):
    cursor.execute(
        """ WITH moved_row AS (
            DELETE FROM archive where id = %(card_id)s
            RETURNING * )
            INSERT INTO  cards SELECT * FROM moved_row;
        """,
        {"card_id": card_id},
    )
