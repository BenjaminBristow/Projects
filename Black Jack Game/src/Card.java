public class Card {
    private final String value;
    private final String suit;
    private final String imageName;

    public Card(String value, String suit){
        this.value = value;
        this.suit = suit;
        this.imageName = this.value+"-"+this.suit+".png";
    }

    public int getValue() { 
        if ("JQKA".contains(value)){
            if ("A".equals(value)){
                return 11;
            }
            return 10;
        }
        int number = Integer.parseInt(value);
        return number;
    }

    public String getLetterValue() { return value; }
    public String getSuit() { return suit; }
    public String getImageName() { return imageName; }
    
}

