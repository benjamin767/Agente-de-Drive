const getData = document.querySelector("button");
const updateDAta = document.querySelector("#update");
const open_box = document.querySelector("#box");
const view_messages = document.querySelector("#messages");
const view_img = document.querySelector("#img");
const data = document.querySelector("#data");
let allMessages;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        data.addEventListener("click", async (e) => {
            e.preventDefault();
            let data = await fetch("http://localhost:3002/pdf/ultimate");
            data = await data.json();
            console.log(data);
        })
        view_img.addEventListener("click", async (e) => {
            e.preventDefault();
            let data_img = allMessages.all_messages.filter(data => {
                console.log(data.payload.parts);
                return data.payload.parts ? 
                data.payload.parts: false;
            });
            let messageId = data_img[0].messageId;
            img_id = data_img[0].payload.parts;
            let filename = img_id[1].filename;
            img_id = img_id[1].body.attachmentId;
            // let res = await fetch(`http://localhost:3002/get_attachment?attachmentId=${img_id}&messageId=${messageId}`);
            // const stream = res.data;
            // console.log(res)
            // const blob = new Blob([stream], { type: 'application/pdf' });
            // const url = URL.createObjectURL(blob);
            const a = document.createElement('a');  
            a.href = (`http://localhost:3002/get_attachment?attachmentId=${img_id}&messageId=${messageId}&filename=${filename}`)
            a.download = `${filename}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        })
        
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
            allMessages = res;
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
