import { generateSplitKey } from "../util";
import { post } from "../util/request";
import { token } from "../const";

export const vote = (body) => {
    
  const options = body.text.split(" ");
  // 명령어 제거
  options.shift();

  const title = options[0];

  // title 제거
  options.shift();

  let result = {
      "text": "투표 시작! 뇸뇸",
      "attachments": [
          {
              "text": title,
              "fallback": title,
              "callback_id": "vote",
              "join_user": [],
              "color": "#3AA3E3",
              "attachment_type": "default",
              "actions": []
          }
      ]
  };

  if (options.length > 1) {

      options.forEach((option) => {

          result.attachments[0].actions.push({
              "name": option,
              "text": `${option} 0`,
              "type": "button",
          });

      })
  }

  // db를 안쓰기 위해서 value에 집어넣고 풀자.
  result.attachments[0].actions.forEach(
      (button) => {
          button.value = JSON.stringify(result)
      }
  );

  return result;
}

export const updateVoteMessage = (body) => {
  const jsonBody = JSON.parse(body.actions[0].value);

  let isClicked = false;

  jsonBody.attachments[0].join_user.forEach(
      (user) => {
          if (user === body.user.id) isClicked = true;
      }
  );

  if (isClicked) return false;

  //click count up 가공
  jsonBody.attachments[0].actions.forEach((action) => {
      if (body.actions[0].name === action.name) {
          action.text = generateSplitKey(action.text);
          jsonBody.attachments[0].join_user.push(body.user.id);
      }
  });

  // 가공한 데이터를 다시 stringify (forEach에 stringify를 넣으면 3번 포멧되서 그냥 밖으로 빼내고 한번 더 태움.)
  const buttonValue = JSON.stringify(jsonBody);

  // 다시 집어 넣어준다.
  jsonBody.attachments[0].actions.forEach((action) => {
      action.value = buttonValue;
  });

  const args = {
      replace_original: true,
      ts: +new Date(),
      attachments: jsonBody.attachments,
      channel: body.channel.id,
  };

  return post(
    {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${token}`
    },
    body.response_url,
    JSON.stringify(args),
    true
  )
}