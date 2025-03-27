const getData = document.querySelector("button");
const updateDAta = document.querySelector("#update");
const open_box = document.querySelector("#box");
const view_messages = document.querySelector("#messages");
let allMessages;
document.addEventListener('DOMContentLoaded', async () => {
    try {
        open_box.addEventListener("click", async (e) => {
            e.preventDefault();
            let res = await fetch("http://localhost:3002/get_inbox");
            res = await res.json();
            console.log(res);
            console.log(res.messages_inbox);
            allMessages = res.messages_inbox
        });

        view_messages.addEventListener("click", async () => {
            let res = await fetch("http://localhost:3002/get_messages", {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ messages: allMessages })
            });
            res = await res.json();
            console.log(res)
            // console.log(`Remitente: ${messageData.payload.headers[0].value}`);
            // console.log(`Asunto: ${messageData.payload.headers[1].value}`);
            // console.log(`Cuerpo del mensaje: ${messageData.payload.body}`);
        });

        updateDAta.addEventListener("click", async (e) => {
            e.preventDefault();
            let res = await fetch("http://localhost:3002/update?cells=A1:B2&sheetName=Hoja%201&values=cambios", {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                }
            })
        })

        getData.addEventListener("click", async (e) => {
            e.preventDefault();
            let res = await fetch("http://localhost:3002/getData?cells=A1:B2&sheetName=Hoja%201");

            res = await res.json();
            const fragment = document.createDocumentFragment();
            const h2 = document.createElement("h2");
            console.log(res.data);
        });
    } catch(error) {
        console.error(error);
    }
});
