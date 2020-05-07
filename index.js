import { generateKeyword, generateActionResponse } from "./src/message";
import http from "http";
import express from "express";
import bodyParser from "body-parser";

const port = 3000, app = express();

app.use(bodyParser.urlencoded({ extended: false }));

http.createServer(app).listen(
    process.env.PORT || port,
    () => console.log(`Http server listening on port ${port}`)
);

app.post("/", (req, res) => {

    res.writeHead(200, { 'Content-Type': 'application/json' });

    let sendObj = { response_type: "in_channel" };

    if (req.body) {
        if (req.body.payload) {
            generateActionResponse(req.body.payload);
        } else {
            const result = generateKeyword(req.body);
            if (!result) {
                sendObj["text"] = "\`없는 명령어에용 껄껄껄...\`:terioawkward:";
            } else {
                if (typeof result === "string") {
                    sendObj["text"] = result;
                }

                if (typeof result === "object") {
                    sendObj = Object.assign({}, sendObj, result);
                }
            }

            res.write(JSON.stringify(sendObj));
        }
    }

    return res.send();
});