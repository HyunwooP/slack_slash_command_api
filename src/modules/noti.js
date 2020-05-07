import _ from "lodash";
import { token, OAuthToken } from "../const";
import { post } from "../util/request";

///////////////////////////////////////////////////////
/*                 해당영역 설명                         */
///////////////////////////////////////////////////////

/**
 * 알림
 * @param {Object} body ?
 */
export const noti = (body) => {
    //작성폼 모달 생성
    const modal = getCreateFormModalInfoObj();
    const args = {
        trigger_id: body.trigger_id,
        view: JSON.stringify(modal),
    };

    //작성된 모달로 slack에 views.open 요청한다.
    return post(
        {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': `Bearer ${token}`
        },
        "https://slack.com/api/views.open",
        JSON.stringify(args),
        true
    )
}

/**
 * 모달에서 작성된 데이터를 담은 '버튼'을 메세지로 출력
 * @param {Object} body 작성된 모달뷰 데이터 (제목, 내용, 장소, 날짜)
 */
export const writeModalBtn = (body) => {
    const values = body.view.state.values;
    const keys = Object.keys(values);
    //작성된 데이터를 담을 배열 (제목,내용,장소,날짜)
    let columns = [];

    const dateColumn = body.view.state.values[Object.keys(body.view.state.values)[0]];
    const dateColumnKey = Object.keys(dateColumn);

    //작성된 날짜데이터
    const event_date = dateColumn[dateColumnKey[0]].selected_date;

    for (let i = 0; i < keys.length; i++) {
        let column = values[keys[i]];
        let columnKeys = Object.keys(column);
        let value = column[columnKeys[0]].value;
        columns.push(value);
    }

    columns[columns.length - 1] = event_date;

    let multi = values[keys[5]];
    let multiKey = Object.keys(multi);
    let selectedCHs = multi[multiKey[0]].selected_conversations;

    const data = { data: columns };
    const message = {
        "attachments": [
            {
                "text": columns[1],
                "fallback": "This is an attachment's fallback",
                "callback_id": "view_modal",
                "color": "#3AA3E3",
                "attachment_type": "default",
                "actions": [
                    {
                        "name": "noti",
                        "text": "보기",
                        "type": "button",
                        "value": JSON.stringify(data)
                    },
                ]
            }
        ]
    };

    let args = {};
    for (let chsIdx = 0, chsLen = selectedCHs.length; chsIdx < chsLen; chsIdx++) {
        args = {
            text: 'Notification',
            channel: selectedCHs[chsIdx],
            attachments: message.attachments,
            as_user: false,
            username: body.user.username
        };

        // 메세지 작성을 요청한다. 수신할 채널 또는 DM(user) 들에게 작성데이터를 담은 버튼을 메세지로 전송
        const result = post(
            {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${token}`
            },
            "https://slack.com/api/chat.postMessage?scope=chat:write:user",
            JSON.stringify(args),
            true
        );
    }
}

/**
 * 버튼 클릭시 버튼에 담겨있던 제목,날짜 등의 데이터를 이용해 모달창 open
 * @param {Object} view 모달 폼. (제목,내용,날짜,참고URL)
 * @param {String} triggerId create할때 triggerId ???
 */
export const openModal = (view, triggerId) => {
    // 제목,내용,장소,날짜,참고URL 데이터
    const columns = JSON.parse(view).data
    // column데이터를 이용해 DetailModal을 만듬
    const modal = getDetailModalInfoObj(columns);

    const args = {
        text: "알림!",
        trigger_id: triggerId,
        view: JSON.stringify(modal)
    }

    // 모달 생성을 요청한다.
    return post(
        {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': `Bearer ${token}`
        },
        "https://slack.com/api/views.open",
        JSON.stringify(args),
        true
    );
}

///////////////////////////////////////////////////////
/*       쓰기(create), 읽기(detail) 모달 데이터    */
///////////////////////////////////////////////////////

function getCreateFormModalInfoObj() {
    return {
        "type": "modal",
        "title": {
            "type": "plain_text",
            "text": "알림",
            "emoji": true
        },
        "submit": {
            "type": "plain_text",
            "text": "Submit",
            "emoji": true
        },
        "close": {
            "type": "plain_text",
            "text": "Cancel",
            "emoji": true
        },
        "blocks": [
            {
                "type": "input",
                "label": {
                    "type": "plain_text",
                    "text": "제목",
                    "emoji": true
                },
                "element": {
                    "type": "plain_text_input",
                    "multiline": false,
                    "placeholder": {
                        "type": "plain_text",
                        "text": "제목을 입력해주세요.",
                        "emoji": true
                    }
                },
            },
            {
                "type": "divider"
            },
            {
                "type": "input",
                "label": {
                    "type": "plain_text",
                    "text": "설명",
                    "emoji": true,
                },
                "element": {
                    "type": "plain_text_input",
                    "multiline": true,
                    "placeholder": {
                        "type": "plain_text",
                        "text": "내용을 입력해주세요.",
                        "emoji": true
                    }
                },
                "optional": true
            },
            {
                "type": "divider"
            },
            {
                "type": "input",
                "label": {
                    "type": "plain_text",
                    "text": "장소",
                    "emoji": true
                },
                "element": {
                    "type": "plain_text_input",
                    "multiline": false,
                    "placeholder": {
                        "type": "plain_text",
                        "text": "장소를 입력해주세요.",
                        "emoji": true
                    }
                },
            },
            {
                "type": "divider"
            },
            {
                "type": "input",
                "element": {
                    "type": "datepicker",
                    "initial_date": new Date().toISOString().substring(0, 10),
                    "placeholder": {
                        "type": "plain_text",
                        "text": "Select a date",
                        "emoji": true
                    }
                },
                "label": {
                    "type": "plain_text",
                    "text": "날짜",
                    "emoji": true
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "input",
                "label": {
                    "type": "plain_text",
                    "text": "참고 URL",
                    "emoji": false
                },
                "element": {
                    "type": "plain_text_input",
                    "multiline": false,
                    "placeholder": {
                        "type": "plain_text",
                        "text": "URL을 입력해주세요.",
                        "emoji": true
                    }
                },
                "optional": true
            },
            {
                "type": "input",
                "element": {
                    "type": "multi_conversations_select",
                    "placeholder": {
                        "type": "plain_text",
                        "text": "수신지 선택",
                        "emoji": true
                    }
                },
                "label": {
                    "type": "plain_text",
                    "text": "채널",
                    "emoji": false
                }
            }
        ]
    };
}

/**
 * 버튼클릭 시 버튼에 담겨있던 뷰를 여는 모달
 * @param {Array<String>} columns 제목,설명,장소,날짜,참고URL 를 담은 배열
 */
function getDetailModalInfoObj(columns) {
    return {
        "type": "modal",
        "title": {
            "type": "plain_text",
            "text": "알림",
            "emoji": true
        },
        "close": {
            "type": "plain_text",
            "text": "Cancel",
            "emoji": true
        },
        "blocks": [
            {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": `*제목*\n${columns[1]}`
                    }
                ]
            },
            {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": `*설명*\n${columns[2] === null ? '없음' : columns[2]}`
                    }
                ]
            },
            {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": `*장소*\n${columns[3]}`
                    }
                ]
            },
            {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": `*날짜*\n${columns[5]}`
                    }
                ]
            },
            {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": `*참고 URL*\n${columns[4] === null ? '없음' : columns[4]}`
                    }
                ]
            },
        ]
    };
}