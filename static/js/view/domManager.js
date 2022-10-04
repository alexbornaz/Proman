import {boardsManager} from "/static/js/controller/boardsManager.js";

export let domManager = {
    addChild(parentIdentifier, childContent) {
        const parent = document.querySelector(parentIdentifier);
        if (parent) {
            parent.insertAdjacentHTML("beforeend", childContent);
        } else {
            console.error("could not find such html element: " + parentIdentifier);
        }
    },
    addEventListener(parentIdentifier, eventType, eventHandler) {
        const parent = document.querySelector(parentIdentifier);
        if (parent) {
            parent.addEventListener(eventType, eventHandler);
        } else {
            console.error("could not find such html element: " + parentIdentifier);
        }
    },

    customizeModal(phrase, htmlbuilder){
        const myModal = new bootstrap.Modal(document.getElementById('myModal'))
        document.querySelector('#myModalTitle').innerHTML=phrase
        const modalhtml= htmlbuilder
        document.querySelector("#bood").innerHTML=modalhtml()
        myModal.show()
        closeModal(myModal)
    },
    }

function closeModal(modal){
        const closebtns=[...document.getElementsByClassName('close')]
        closebtns.forEach(element => {
            element.onclick = function() {
                modal.hide()
            }
            
        });

    }



