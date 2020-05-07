import { method } from "./method";
import { keywords } from "./const";
import { writeModalBtn, openModal, updateVoteMessage } from "./modules";

function generateKeyword(body) {
    
    let result = "";

    // body.text === input command
    if (body.text) {
        const getKeyword = body.text.split(" ");

        Object.keys(keywords).forEach(keyword => {
            if (keyword === getKeyword[0]) {
                result = method[`${keyword}Message`](body);
            }
        });
    }

    return result;
};

function generateActionResponse(message) {
    const body = JSON.parse(message);
    
    if (body.callback_id === "vote") {
        updateVoteMessage(body);
    }

    if (body.callback_id === 'view_modal') {
        const view = body.original_message.attachments[0].actions[0].value;
        openModal(view, body.trigger_id);
    }

    if (body.type === 'view_submission') {
        writeModalBtn(body);
    }
}

module.exports = {
    generateKeyword,
    generateActionResponse
};