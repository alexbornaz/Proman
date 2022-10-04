export let dataHandler = {
    getBoards: async function () {
        return await apiGet("/api/boards");
    },
    getBoard: async function (boardId) {
        // the board is retrieved and then the callback function is called with the board
    },
    getStatusesByBoardId: async function (boardId) {
        // the statuses are retrieved and then the callback function is called with the statuses
        return await apiGet(`/api/get-statusesByBoardId/${boardId}`)
    },
    getStatus: async function (statusId) {
        // the status is retrieved and then the callback function is called with the status
    },
    getCardsByColumnId: async function (columnId) {
        return await apiGet(`/api/get-cardsCI/${columnId}`)
    },
    getCardsByBoardId: async function (boardId) {
        return await apiGet(`/api/boards/${boardId}/cards/`);
    },
    getCard: async function (cardId) {
        // the card is retrieved and then the callback function is called with the card
    },
    createNewBoard: async function (boardTitle) {
        // creates new board, saves it and calls the callback function with its data
        return await apiPost(`/api/createBoard/` ,{element:boardTitle});
    },
    createNewCard: async function (cardTitle, boardId) {
        // creates new card, saves it and calls the callback function with its data
        return await apiPost("/api/create-card/",{cardTitle:cardTitle, boardId:boardId})
    },
    renameBoard: async function (boardId, boardTitle) {
        return await apiGet(`/api/renameBoard/${boardId}/${boardTitle}/`);
    },
    addColumn: async function (boardId,columnTitle){
        return await apiPost(`/api/new-status`, {columnTitle:columnTitle,boardId:boardId})
    },
    editStat: async function (cardId, columnId,order) {
        return await apiPut("/api/edit-card-status",{cardId: cardId, columnId: columnId, order:order})
    },
    renameCard: async function (cardId,cardTitle){
        return await apiPost("/api/renameCard", {cardId: cardId, cardTitle: cardTitle})
    },
    renameColumn: function (columnId,columnTitle) {
        return  apiPost("/api/rename-column", {columnId: columnId, columnTitle: columnTitle})
    },
    createUser: async function(email,username,password){
        return await apiPost("/api/registration", {email:email, username:username, password:password})
    },
    loginAttempt: async function(email,password){
        return await apiPost("/api/login-attempt", {email:email, password:password})
    },
    getSession: async function(){
        return await apiGet("/api/session")
    },
    getPrivateBoards: async function() {
        return await apiGet("/api/private-boards")
    },
    createNewPrivateBoard: async function(boardTitle) {
        return await apiPost(`/api/createPrivateBoard/`, {boardTitle: boardTitle})
    },
    deleteBoard: async function(boardID){
        return await apiDelete(`/api/delete-board/`, {boardID: boardID})
    },
    removeCard: async function(cardId){
        return await apiDelete(`/api/delete-card/`, {cardId: cardId})
    },
    removeColumn: async function(columnId){
        return await apiDelete("/api/delete-column/", {columnId: columnId})
    },
    getArchived: async function(boardId){
        return await apiGet(`/api/archived-for-board/${boardId}/`)
    },
    archiveCard: async function(cardId){
        return await apiPost("/api/archive-card", {cardId: cardId})
    },
    unarchiveCard: async function(cardId){
        return await apiPost("/api/unarchive-card", {cardId: cardId})
    }
}

async function apiGet(url) {
    let response = await fetch(url, {
        method: "GET",
    });
    if (response.ok) {
        return await response.json();
    }
}

async function apiPost(url, payload) {
    const req = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    if (req.ok) {
        return await req.json();
    }
}

async function apiDelete(url, payload) {
    const req = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (req.ok) {
        return await req.json();
    }
}


async function apiPut(url, payload) {
    const req = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (req.ok) {
        return await req.json();
    }
}

async function apiPatch(url) {
}
