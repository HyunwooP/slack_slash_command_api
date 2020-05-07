import _ from "lodash";
import {
    noti,
    eat,
    role,
    dice,
    vote,
    sound,
    help,
    updateVoteMessage,
    writeModalBtn,
    openModal
} from "./modules";

const roleMessage = () => role();
const diceMessage = () => dice();
const eatMessage = () => eat();
const voteMessage = (body) => vote(body);
const soundMessage = (body) => sound(body);
const helpMessage = () => help();
const notiMessage = (body) => noti(body);

module.exports = {
    method: {
        roleMessage,
        diceMessage,
        eatMessage,
        voteMessage,
        soundMessage,
        helpMessage,
        notiMessage,
    }
}