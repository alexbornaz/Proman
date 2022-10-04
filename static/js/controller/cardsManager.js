import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";


export let cardsManager = {
    loadCards: async function (columnId) {
        const cards = await dataHandler.getCardsByColumnId(columnId);
        if (cards){
            for (let card of cards) {
                const cardBuilder = htmlFactory(htmlTemplates.card);
                const content = cardBuilder(card);
                domManager.addChild(`.board-column-content[data-column-id="${columnId}"]`, content);
                domManager.addEventListener(`.card-title[data-card-id="${card.id}"]`,"click",renameCard)
                domManager.addEventListener(`.card-remove[data-card-id="${card.id}"]`,"click",deleteButtonHandler)
                domManager.addEventListener(`.card-archive[data-card-id="${card.id}"]`,"click",archiveCard)
            }
        }
    },
};

export function dragElements(){
    const columnsContent = [...document.querySelectorAll(".board-column-content")]
    dragula(columnsContent).on("dragend",async (el) => {
        const cardId=el.dataset.cardId
        const newColumnId = el.parentNode.dataset.columnId
        const card = document.querySelector(`.card[data-card-id="${cardId}"]`)
        let neworder = 0;
        const column=card.parentElement
        while (card != column.children[neworder]) {
            neworder++
        }
        neworder +=1
        await dataHandler.editStat(cardId,newColumnId,neworder)
        console.log("test")
    })
}

function deleteButtonHandler(clickEvent) {
    const cardId = clickEvent.target.dataset.cardId
    const deletedCard = document.querySelector(`.card[data-card-id="${cardId}"`)
    dataHandler.removeCard(cardId)
    deletedCard.parentNode.removeChild(deletedCard)
}

function renameCard(clickEvent){
    const cardId=clickEvent.target.dataset.cardId
    domManager.customizeModal("Rename card", htmlFactory(htmlTemplates.simpleModal))
    document.querySelector(".modal-body button").addEventListener("click", async () =>{
        let modal = bootstrap.Modal.getInstance(document.getElementById('myModal'))
        const cardNewName = document.querySelector("#data_input").value;
        clickEvent.target.innerText = cardNewName
        modal.hide()
        await dataHandler.renameCard(cardId,cardNewName)
        document.querySelector(".modal-body").innerHTML=""
    })
}

function archiveCard(clickEvent){
    const card ={
        id: clickEvent.target.dataset.cardId,
        title : clickEvent.target.dataset.cardTitle 

    }
    const cardToBeArchived = document.querySelector(`.card[data-card-id="${card.id}"`)
    cardToBeArchived.parentNode.removeChild(cardToBeArchived)
    dataHandler.archiveCard(card.id)
    
}
