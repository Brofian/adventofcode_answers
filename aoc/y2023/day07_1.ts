import AbstractRiddle from '../../src/JS/AbstractRiddle';

type Card = '2'|'3'|'4'|'5'|'6'|'7'|'8'|'9'|'T'|'J'|'Q'|'K'|'A';
const CARD_ORDER: Card[] = [ '2','3','4','5','6','7','8','9','T','J','Q','K','A'];

enum HandType {
    HIGH_CARD,
    ONE_PAIR,
    TWO_PAIRS,
    THREE_OF_A_KIND,
    FULL_HOUSE,
    FOUR_OF_A_KIND,
    FIVE_OF_A_KIND,
}

type Hand = {
    cards: Card[],
    bid: number
};

class Y2023_Day07_1 extends AbstractRiddle {

    riddle: string = "What is the sum of all bids multiplied by their ranks?";

    run(): number {

        let input: Hand[] = this.readInput().map(line => {
            const parts = line.trim().split(' ');

            return {
                cards: parts[0].split('') as Card[],
                bid: parseInt(parts[1])
            }
        });


        input.sort((a,b) => {
            const aHandType: HandType = this.getHandType(a);
            const bHandType: HandType = this.getHandType(b);
            if (aHandType !== bHandType) {
                return aHandType < bHandType ? -1 : 1;
            }
            return this.compareHighestCards(a,b) ? -1 : 1;
        })

        return input.reduce((carry, val, index) => {return val.bid * (index + 1) + carry}, 0);
    }

    compareHighestCards(a: Hand, b: Hand): boolean {
        for (let i = 0; i < a.cards.length; i++) {
            const aIndex = CARD_ORDER.indexOf(a.cards[i]);
            const bIndex = CARD_ORDER.indexOf(b.cards[i]);
            //this.dump(`Comparing ${a.cards[i]} to ${b.cards[i]}`);
            if (aIndex !== bIndex) {
                return aIndex < bIndex;
            }
        }
        return true;
    }

    getHandType(hand: Hand): HandType {
        const cardNumbers: number[] = Array(13).fill(0);

        for (const card of hand.cards) {
            const cardIndex = CARD_ORDER.indexOf(card);
            cardNumbers[cardIndex] = (cardNumbers[cardIndex] ?? 0)+1;
        }

        const filteredCardValues = cardNumbers.map((el, index) => {
            return {card: CARD_ORDER[index], count: el};
        }).filter(el => el.count > 0).sort((a,b) => a.count > b.count ? -1 : 1);

        switch (filteredCardValues.length) {
            case 1:
                return HandType.FIVE_OF_A_KIND;
            case 2:
                if (filteredCardValues.find(el => el.count === 1 || el.count === 4)) {
                    return HandType.FOUR_OF_A_KIND;
                }
                return HandType.FULL_HOUSE;
            case 3:
                if (filteredCardValues.find(el => el.count === 3)) {
                    return HandType.THREE_OF_A_KIND;
                }
                return HandType.TWO_PAIRS;
            case 4:
                return HandType.ONE_PAIR;
            default:
                return HandType.HIGH_CARD;
        }

    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2023_Day07_1());