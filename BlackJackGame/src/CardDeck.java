import java.util.Random;

public class CardDeck {
    public Card[] cards = new Card[52];
    private int totalCards;

    public void buildDeck(){
        String[] values = {"A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"};
        String[] suits = {"H", "C", "D", "S"};
        int iteration = 0;

        for (String suit : suits) {
            for (String value : values) {
                Card card = new Card(value, suit);
                cards[iteration] = card;
                iteration++;
            }
        }
        totalCards = cards.length;
        System.out.println("***** DECK BUILT *****");
    }

    public void printDeck(){
        for (int i = 0; i < totalCards; i++) {
            Card card = cards[i];
            System.out.println(card.getValue() + " - " + card.getSuit() + " - " + card.getImageName());
        }
    }

    //only returns a number within the boundaries of the number of cards left in the cards
    public int randomNum(int totalCards){ 
        Random rand = new Random();
        int randomNum = rand.nextInt(totalCards);
        return randomNum;
    }

    // returns a card from the cards
    public Card getCard(){ 
        int location = randomNum(totalCards); // pick a random location
        Card card = cards[location]; // get the card from that location in the cards
        cards[location] = cards[totalCards-1]; // replace card at end with card chosen
        cards[totalCards-1] = null; // replace origanl moved card with null
        totalCards --; // decrease total cards by 1
        return card;
    }
}
