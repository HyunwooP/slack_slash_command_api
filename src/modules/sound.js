import { post } from "../util/request";
import { token, ChannelId } from "../const";

export const sound = (body) => {
    let text = body.text.split(" ");

    text.shift();

    const args = {
        ts: +new Date(),
        text: `\`${text.toString().replace(/,/g, " ")}\`` + " 라고 아뢰오!",
        channel: ChannelId,
    };

    return post(
        {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': `Bearer ${token}`
        },
        "https://slack.com/api/chat.postMessage",
        JSON.stringify(args),
        true
    );
}