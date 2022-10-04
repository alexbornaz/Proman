import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {columnsManager} from "./columnsManager.js";

export let boardsManager = {
    loadBoards: async function () {
        domManager.addEventListener("#addboardbtn","click",addBoard)
        const boards = await dataHandler.getBoards();
        let session=await dataHandler.getSession()
        console.log(session)
        if (session.status != "null"){
            domManager.addEventListener("#addPboardbtn","click",addPrivateBoard)
            
            const privateBoards = await dataHandler.getPrivateBoards()
            boards.push(...privateBoards)
        }
        
        for (let board of boards) {
            const boardBuilder = htmlFactory(htmlTemplates.board);
            const content = boardBuilder(board);
            domManager.addChild("#root", content);
            domManager.addEventListener(
                `.toggle-board-button[data-board-id="${board.id}"]`,    
                "click",
                showHideButtonHandler);
            domManager.addEventListener(`.board-title[data-board-id="${board.id}"]`,"click",renameBoard)
            domManager.addEventListener(`.add-column[data-board-id="${board.id}"]`,"click",addColumn)
            domManager.addEventListener(`.add-card[data-board-id="${board.id}"]`,"click",addCard)
            domManager.addEventListener(`.delete-board[data-board-id="${board.id}"]`, "click", deleteBoard)
            domManager.addEventListener(`.dropdown[data-board-id="${board.id}"] button`,"click", showHideArchive)
            
    }

    },
};



function addBoard(){
    domManager.customizeModal("Board Name", htmlFactory(htmlTemplates.simpleModal))
    document.querySelector(".modal-body button").addEventListener("click", async ()=>{
        let modal=bootstrap.Modal.getInstance(document.getElementById('myModal'))
        const boardTitle= document.querySelector("#data_input").value;
        modal.hide()
        await dataHandler.createNewBoard(boardTitle)
        document.querySelector("#root").innerHTML=""
        boardsManager.loadBoards()
        document.querySelector(".modal-body").innerHTML=""

    })
}

async function showHideArchive(clickEvent){
    const boardId = clickEvent.target.dataset.boardId
    const archived = [...await dataHandler.getArchived(boardId)]
    console.log(archived)

    if (document.querySelector(`.dropdown[data-board-id="${boardId}"] button`).classList.contains("show")) {
        console.log("open")
        if (archived.length >= 1){
            for (let element of archived){
                const archbuilder = htmlFactory(htmlTemplates.archivedCard)
                const cardContent = archbuilder(element)
                domManager.addChild(`.dropdown-menu[data-board-id="${boardId}"]`,cardContent)
            }
            const btns =document.querySelectorAll(`.dropdown-menu[data-board-id="${boardId}"] button`)
            btns.forEach(btn =>{
                btn.addEventListener("click",async ()=>{
                    console.log("unarchive"+btn.dataset.cId)
                    const removed = document.querySelector(`.dropdown-item[data-c-id="${btn.dataset.cId}"]`)
                    removed.parentNode.removeChild(removed)
                    await dataHandler.unarchiveCard(btn.dataset.cId)


                })
            })
        }else{
            document.querySelector(`.dropdown-menu[data-board-id="${boardId}"]`).innerHTML="<li>Empty Archive</li>"
        }
       
    }else if(!document.querySelector(`.dropdown[data-board-id="${boardId}"] button`).classList.contains("show")){
        console.log("close")
        document.querySelector(`.dropdown-menu[data-board-id="${boardId}"]`).innerHTML=""
    }
}



function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    const boardTitle = clickEvent.target.dataset.title;
    if (clickEvent.target.dataset.show === 'false') {
        clickEvent.target.dataset.show = "true";
        clickEvent.target.innerText = "🔼"
        columnsManager.loadColumns(boardId);
    }
    else {
        columnsManager.unloadColumns(boardId, boardTitle);
        clickEvent.target.dataset.show = 'false';
        clickEvent.target.innerText = "🔽"
    }

}

function renameBoard(clickEvent){
    const boardId = clickEvent.target.dataset.boardId;
    domManager.customizeModal("Rename Board",htmlFactory(htmlTemplates.simpleModal));
    document.querySelector(".modal-body button").addEventListener("click",async () =>{
        let modal= bootstrap.Modal.getInstance(document.getElementById('myModal'))
        const newName = document.querySelector("#data_input").value;
        clickEvent.target.innerText = newName
        modal.hide()
        await dataHandler.renameBoard(boardId,newName);
        document.querySelector(".modal-body").innerHTML=""

    })


}
function addColumn(clickEvent){
    const boardId = clickEvent.target.dataset.boardId;
    domManager.customizeModal("Add Column",htmlFactory(htmlTemplates.simpleModal))
    document.querySelector(".modal-body button").addEventListener("click",async () =>{
        let modal= bootstrap.Modal.getInstance(document.getElementById('myModal'))
        const newName = document.querySelector("#data_input").value;
        modal.hide()
        await dataHandler.addColumn(boardId,newName)
        document.querySelector(`.board-columns[data-board-id="${boardId}"`).innerHTML=""
        columnsManager.loadColumns(boardId)
        document.querySelector(".modal-body").innerHTML=""
    })
}

function addCard(clickEvent){
    const boardId = clickEvent.target.dataset.boardId;
    domManager.customizeModal("Add Card",htmlFactory(htmlTemplates.simpleModal))
    document.querySelector(".modal-body button").addEventListener("click",async () =>{
        let modal=bootstrap.Modal.getInstance(document.getElementById('myModal'))
        const cardTitle= document.querySelector("#data_input").value;
        modal.hide()
        await dataHandler.createNewCard(cardTitle,boardId)
        document.querySelector(`.board-columns[data-board-id="${boardId}"`).innerHTML=""
        columnsManager.loadColumns(boardId)
        document.querySelector(".modal-body").innerHTML=""
    })

}

function addPrivateBoard(){
    domManager.customizeModal("Board Name", htmlFactory(htmlTemplates.simpleModal))
    document.querySelector(".modal-body button").addEventListener("click", async ()=>{
        let modal=bootstrap.Modal.getInstance(document.getElementById('myModal'))
        const boardTitle= document.querySelector("#data_input").value;
        modal.hide()
        await dataHandler.createNewPrivateBoard(boardTitle)
        document.querySelector("#root").innerHTML=""
        boardsManager.loadBoards()
        document.querySelector(".modal-body").innerHTML=""


    })
}

function deleteBoard(clickEvent){
    const boardId = clickEvent.target.dataset.boardId;
    dataHandler.deleteBoard(boardId)
    const deletedBoard = document.querySelector(`.board-container[data-board-id="${boardId}"]`)
    deletedBoard.parentNode.removeChild(deletedBoard)
}