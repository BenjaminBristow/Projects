public class Dealer {
    private Card[] hand = new Card[5];
    int cardTotal = 0;
    int noOfCards = 0;

    public int haveTurn(CardDeck deck){
        if (cardTotal<17){ // if < 17 hit
            getCard(deck);

            if (cardTotal > 21){
                System.out.println("\u001B[31mDealer busted!\u001B[0m");
                printHand();
                return 1;
            }

            else if (noOfCards==5){
                return 1;
            }

            return 0;
        }
        else{ // else stick
            System.out.println("\u001B[35mDealer stuck!\u001B[0m");
            return 1;
        }
    }

    // prints card in players hand to the screen
    public void printHand(){
        System.out.print("Dealer's hand: ");
        for (Card card : hand) {
            if (card != null){
                System.out.print(card.getLetterValue() + card.getSuit() + " ");
            }
        }
        System.out.println("(total: " + cardTotal + ")");
    }

    public void getCard(CardDeck deck){
        Card newCard = deck.getCard();
        hand[nextFreeLocation()] = newCard;
        noOfCards++;
        cardTotal += newCard.getValue();
    }

    // returns location on the next free space in their hand
    public int nextFreeLocation(){ 
        for (int i=0; i<5; i++){
            if (hand[i]==null){
                return i;
            }
        }
        return 0;
    }
}
