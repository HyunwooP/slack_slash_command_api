function generateSplitKey(text) {
    const split = text.split(" ");
    let count = Number(split[1]);
    return `${split[0]} ${++count}`;
}

module.exports = {
    generateSplitKey
};