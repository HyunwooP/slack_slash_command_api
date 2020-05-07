export const dice = () => {

    let dice = [];

    for (let i = 0; i < 4; i++) {
      dice.push(Math.floor(Math.random() * 6) + 1);
    }

    return `\`당신의 주사위는\` *${dice[0]}*, *${dice[1]}*, *${dice[2]}*, *${dice[3]}* ========> *${dice[0] + dice[1] + dice[2] + dice[3]}* !! :smile:`;
  }