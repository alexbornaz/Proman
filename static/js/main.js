import {boardsManager} from "./controller/boardsManager.js";
import {dataHandler} from "./data/dataHandler.js";
import {domManager} from "./view/domManager.js";
import { htmlFactory, htmlTemplates } from "./view/htmlFactory.js";

function init() {
    boardsManager.loadBoards();
    accHandle()
    const refreshButton = document.querySelector("#refresh")
    refreshButton.addEventListener("click", () =>{
        window.location.reload()
    })
}
init();


async function accHandle(){
    let session = await dataHandler.getSession()
    if (session.status == "null"){
        const registerbtn = document.querySelector("#registerButton");
        const loginbtn = document.querySelector("#loginButton");

        registerbtn.addEventListener("click", async (event) =>{
            event.preventDefault();
            domManager.customizeModal("Create Account",htmlFactory(htmlTemplates.regModal))
            document.querySelector(".modal-body button").addEventListener('click', async () =>{
                let modal = bootstrap.Modal.getInstance(document.getElementById('myModal'))
                const email = document.querySelector("#email").value
                const username = document.querySelector("#username").value
                const password = document.querySelector("#psw").value
                if (email==""){
                    alert("Enter email!")
                } else if(username==""){
                    alert("Enter username!")
                } else if(password==""){
                    alert("Enter password!")
                } else{
                    modal.hide()
                    await dataHandler.createUser(email,username,password)
                    document.querySelector(".modal-body").innerHTML=""
                    alert("Succesful registration!")
                }
            } )
        })

        loginbtn.addEventListener("click",async (event) =>{
            event.preventDefault()
            domManager.customizeModal("Log in",htmlFactory(htmlTemplates.loginModal))
            document.querySelector(".modal-body button").addEventListener("click",async ()=>{
                let modal = bootstrap.Modal.getInstance(document.getElementById('myModal'))
                const email = document.querySelector("#email").value
                const password = document.querySelector("#psw").value
                if (email==""){
                    alert("Email required!")
                }else if(password==""){
                    alert("Password required!")
                }else{
                    let response = await dataHandler.loginAttempt(email, password)
                    if (response.msg != "matched"){
                        alert(response.msg)
                    }else{
                        modal.hide()
                        document.querySelector(".modal-body").innerHTML=""
                        window.location.reload()
                    }
                }

            })
        } )

            } 
        }
