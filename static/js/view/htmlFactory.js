export const htmlTemplates = {
    board: 1,
    card: 2,
    column: 3,
    simpleModal: 4,
    regModal: 5,
    loginModal:6,
    archivedCard:7

}



export const builderFunctions = {
    [htmlTemplates.board]: boardBuilder,
    [htmlTemplates.card]: cardBuilder,
    [htmlTemplates.column]: columnBuilder,
    [htmlTemplates.simpleModal]: simpleModalBuilder,
    [htmlTemplates.regModal]: regModalBuilder,
    [htmlTemplates.loginModal]: loginModalBuilder,
    [htmlTemplates.archivedCard]: archivedCardBuilder,

};

export function htmlFactory(template) {
    if (builderFunctions.hasOwnProperty(template)) {
        return builderFunctions[template];
    }

    console.error("Undefined template: " + template);

    return () => {
        return "";
    };
}

function boardBuilder(board) {
    return `<div class="board-container" data-board-id="${board.id}">
                <div class=board data-board-id="${board.id}">
                    <div class="board-title" data-board-id="${board.id}">
                        <span class="board-title" data-board-id="${board.id}">${board.title}</span>
                    </div>
                    <button class="toggle-board-button" data-board-id="${board.id}" data-show=false>🔽</button>
                    <button class="add-column" data-board-id="${board.id}" type="button" data-function="create-column">+ Add Column</button>
                    <button class="add-card" data-board-id="${board.id}">+ Add Card</button>
                    <button class="delete-board" data-board-id="${board.id}" type="button" data-function="delete-board">🗑️</button>
                    <div class="dropdown" data-board-id="${board.id}">
                    <button class="btn btn-dark dropdown-toggle" type="button" data-board-id="${board.id}" data-bs-auto-close=false data-bs-toggle="dropdown" aria-expanded="false">
                      Archive
                    </button>
                    <ul class="dropdown-menu" data-board-id="${board.id}">
                    </ul>
                  </div>
                </div>
                    <div class="board-columns" data-board-id=${board.id}></div>
            </div>`;
}

function cardBuilder(card) {
    return `<div class="card" data-card-id="${card.id}">
                <div class="card-title bg-dark" data-card-id="${card.id}" data-card-title="${card.title}">${card.title}</div>
                <div class="card-remove" data-card-id="${card.id}"><font size="+1" class="card-remove" data-card-id="${card.id}">🗑️</font></div>
                <div class="card-archive" data-card-id="${card.id}"><i class="card-archive" data-card-id="${card.id}" data-card-title="${card.title}">📁</i></div>
            </div>`;
}

function columnBuilder(column){
    return `<div class="board-column flex-row " data-column-id=${column.id}>
                <div class="board-column-title" data-column-id=${column.id} ><span class="board-column-title" data-column-id=${column.id} onfocusout="" contenteditable=true>${column.title}</span>
                    <button class="delete-column btn-danger" data-column-id="${column.id}" type="button" data-function="delete-column">🗑️</button>
                </div>
                <div class="board-column-content" data-column-id=${column.id}></div>
            </div> `
}

function simpleModalBuilder(){
    return `<input id="data_input" type="text">
            <button>Save</button>`
}

function regModalBuilder(){
    return `<div class=text-center>
                <label for="email"><b>Email</b></label><br>
                <input type="text" placeholder="Enter Email" name="email" id="email" required><br>
                <label for="username"><b>Username</b></label><br>
                <input type="text" placeholder="Enter Username" name="username" id="username" required><br>
                <label for="psw"><b>Password</b></label><br>
                <input type="password" placeholder="Enter Password" name="psw" id="psw" required><br><br>
                <button type="submit" class="registerbtn btn btn-primary">Register</button>
            </div>`

}

function loginModalBuilder(){
    return `<div class=text-center>
                <label for="email"><b>Email</b></label><br>
                <input type="text" placeholder="Enter Email" name="email" id="email" required><br>
                <label for="psw"><b>Password</b></label><br>
                <input type="password" placeholder="Enter Password" name="psw" id="psw" required><br><br>
                <button type="submit" class="loginbtn btn btn-primary">Login</button>
                </div>`
}

function archivedCardBuilder(card){
    return  `<div class="dropdown-item data-c-id=${card.id}><li class="btn-dark" data-c-id=${card.id}>${card.title}
                <button type="button" class="unarchive-button btn-success" data-c-id=${card.id}>🈺</button></li><br>
            
            </div>`
}