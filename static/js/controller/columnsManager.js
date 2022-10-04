import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager, dragElements} from "./cardsManager.js";


export let columnsManager = {
    loadColumns: async function(boardId) {
        const columns = await dataHandler.getStatusesByBoardId(boardId);
        for(let column of columns) {
            const columnBuilder = htmlFactory(htmlTemplates.column);
            const content = columnBuilder(column);
            domManager.addChild(`.board-columns[data-board-id="${boardId}"]`, content);
            domManager.addEventListener(`.delete-column[data-column-id="${column.id}"]`,"click",deleteColumn)
            let columnId = column.id;
            cardsManager.loadCards(columnId);
        }
        addEventOnCol()
        await dragElements()
    },
    unloadColumns: function(boardId) {
        document.querySelector(`.board-columns[data-board-id="${boardId}"]`).innerText = "";
    },

}
function addEventOnCol(){
let statuses =  document.querySelectorAll(".board-column-title span")
    statuses.forEach(col => col.addEventListener("focusout", (e) => renamestatus(e.target.dataset.columnId)));
}
function renamestatus(colId){
    let columnTitle = document.querySelector(`.board-column-title span[data-column-id="${colId}"]`).innerText
    dataHandler.renameColumn(colId,columnTitle)
    
}

function deleteColumn(clickEvent){
    const columnId=clickEvent.target.dataset.columnId
    console.log(columnId)
    const deletedColumn = document.querySelector(`.board-column[data-column-id="${columnId}"]`)
    console.log(deletedColumn)
    dataHandler.removeColumn(columnId)
    deletedColumn.parentNode.removeChild(deletedColumn)
    

}