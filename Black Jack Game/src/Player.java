import java.util.Scanner;

public class Player {
    Scanner input = new Scanner(System.in);

    private Card[] hand = new Card[5];
    int cardTotal = 0;
    int noOfCards = 0;

    // returns location on the next free space in their hand
    public int nextFreeLocation(){ 
        for (int i=0; i<5; i++){
            if (hand[i]==null){
                return i;
            }
        }
        return 0;
    }

    // prints card in players hand to the screen
    public void printHand(){
        System.out.print("Your hand: ");
        for (Card card : hand) {
            if (card != null){
                System.out.print(card.getLetterValue() + card.getSuit() + ", ");
            }
        }
        System.out.println("(\u001B[36mtotal: " + cardTotal + "\u001B[0m)");
    }

    public void getCard(CardDeck deck){
        Card newCard = deck.getCard();
        hand[nextFreeLocation()] = newCard;
        noOfCards++;
        cardTotal += newCard.getValue();
    }

    public int haveTurn(CardDeck deck){
        System.out.print("'hit' or 'stick'? ");        
        String turnChoice = input.next(); 

        if (turnChoice.equals("hit")){
            getCard(deck);

            if (cardTotal > 21){
                System.out.println("\u001B[31mBust!\u001B[0m");
                printHand();
                input.close();
                return 1;
            }

            else if (noOfCards==5){
                input.close();
                return 1;
            }

            return 0;
        }
        else if (turnChoice.equals("stick")){
            input.close();
            return 1;
        }
        else{
            return 0;
        }

    }

}
