const { pdfToPng } = require('pdf-to-png-converter');
const { createWorker } = require('tesseract.js');
const { 
    get_inbox,
    get_messages,
    get_attachment
} = require("./auth");

module.exports = {
    get_text_pdf: async () => {
        console.log("estoy dentro de la funcion")
        const msg_data = await get_inbox();
        let all_messages = await get_messages(msg_data);
        all_messages = all_messages.map(data => {
            return { payload: data.data.payload, id: data.data.id };
        });

        let attachments = all_messages.filter((data) => data.payload.parts ? data : false);
        attachments = attachments.map(data => { return { id: data.id, data: data.payload.parts } })
                        .filter(data => data.data.length >= 2)
                        .filter(data => data.data[1].mimeType === "application/pdf")
                        .map(data => Object({ messageId: data.id, attachmentId: data.data[1].body.attachmentId }));
        
        const { attachmentId, messageId } = attachments[0];
        const pdfBuffer = await get_attachment(attachmentId, messageId);

        const data = await pdfToPng(pdfBuffer, {
            disableFontFace: false, // When `false`, fonts will be rendered using a built-in font renderer that constructs the glyphs with primitive path commands. Default value is true.
            useSystemFonts: false, // When `true`, fonts that aren't embedded in the PDF document will fallback to a system font. Default value is false.
            enableXfa: false, // Render Xfa forms if any. Default value is false.
            viewportScale: 2.0, // The desired scale of PNG viewport. Default value is 1.0 which means to display page on the existing canvas with 100% scale.
            outputFileMaskFunc: (pageNumber) => `page_${pageNumber}.png`, // Output filename mask function. Example: (pageNumber) => `page_${pageNumber}.png`
            strictPagesToProcess: false, // When `true`, will throw an error if specified page number in pagesToProcess is invalid, otherwise will skip invalid page. Default value is false.
            verbosityLevel: 0, // Verbosity level. ERRORS: 0, WARNINGS: 1, INFOS: 5. Default value is 0.
        });
        const worker = await createWorker('spa',1);
        const texts = Promise.all(data.map(pag => worker.recognize(pag.content))).then(res => res)
        
        return texts
    },
}