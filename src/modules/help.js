import { keywords } from "../const";

export const help = () => {
  let result = "";

  Object.keys(keywords).forEach(keyword => {
      result += `\`${keyword}\` *${keywords[keyword]}* \n`
  });

  return result;
}