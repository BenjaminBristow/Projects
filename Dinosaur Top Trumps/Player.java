public class Player {
    private String name; // name of player
    private int totalCards; // total number of cards in the whole deck
    private int location = 0; // cards[location] of where the current cad being used can be found
    private Card[] cards; // cards is an array containing Card data types

    //constructor
    public Player(String name, int totalCards){
        this.name = name;
        this.totalCards = totalCards;

        cards = new Card[10];
    }

    //add a card to next available spot
    public void addCard(Card card){
        for (int i=0; i<cards.length; i++){
            if (cards[i] == null){
                cards[i] = card;
                break;
            }
        }
    }

    public void removeCard(Card card){
        for (int i=0; i<cards.length; i++){
            if (cards[i] != null && cards[i].equals(card)){
                cards[i] = null;
                break;
            }
        }
    }

    //accessor
    public int getCardCount(){
        int cardCount = 0;
        for (int i=0; i<cards.length; i++){
            if (cards[i] != null){
                cardCount++;
            }
        }
        return cardCount;
    }

    public String getPlayerName(){ return name; }
    
    public void nextCard(){
        do{
            location = (location + 1) % cards.length;
        } while(cards[location] == null);
    }

    public Card getCurrentCard(){
       return cards[location];
    }

    public boolean hasWon(){
        if (getCardCount()==totalCards){
            return true;
        }
        return false;
    }
    
    
}
