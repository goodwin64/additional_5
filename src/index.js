module.exports = function check(str, bracketsConfig) {
    if (str.length % 2 === 1) return false;

    const openToCloseBracketsMap = {};
    const closeToOpenBracketsMap = {};
    const selfClosingBracketsMap = {};
    bracketsConfig.forEach(currBracketPair => {
        const openingBracket = currBracketPair[0];
        const closingBracket = currBracketPair[1];
        if (openingBracket === closingBracket) {
            selfClosingBracketsMap[openingBracket] = closingBracket;
            return;
        }
        openToCloseBracketsMap[openingBracket] = closingBracket;
        closeToOpenBracketsMap[closingBracket] = openingBracket;
    });

    let isCorrectOrder = true;
    const stackAfterParsing = str.split('').reduce((stack, currChar) => {
        const isSelfClosing = currChar in selfClosingBracketsMap;
        const isClosing = currChar in closeToOpenBracketsMap;
        const isOpening = currChar in openToCloseBracketsMap;
        const lastInStack = stack[stack.length - 1];
        const complementaryBracket = getComplementaryBracket(
            isClosing ? closeToOpenBracketsMap : openToCloseBracketsMap,
            currChar
        );

        if (isSelfClosing) {
            if (lastInStack === currChar) {
                stack.pop();
            } else {
                stack.push(currChar);
            }
        } else if (isOpening) {
            stack.push(currChar);
        } else if (isClosing) {
            stack.pop();
            if (lastInStack !== complementaryBracket
                || !lastInStack
                || !complementaryBracket) {
                isCorrectOrder = false;
            }
        }
        return stack;
    }, []);
    return isCorrectOrder && stackAfterParsing.length === 0;
};

function getComplementaryBracket(bracketsMap, bracket) {
    return bracketsMap[bracket];
}
