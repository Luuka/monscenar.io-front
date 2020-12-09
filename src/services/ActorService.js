export default class ActorService {
    constructor() {
    }

    parseTokens(tokens) {
        let actors = [];
        tokens.forEach((token) => {
            if (token.type === 'character') {
                actors.push(token.text);
            }
        });

        return [...new Set(actors)];
    }
}