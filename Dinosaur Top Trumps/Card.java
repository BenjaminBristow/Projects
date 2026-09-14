public class Card {

    //attributes
    private String name;
    private Category[] categories;

    //constructor
    public Card(String name, int speed, int weight, int era, int legs, int wings){
        this.name = name;

        categories = new Category[5]; //initialise Category array for this card
        this.categories[0] = new Category("Speed", speed);
        this.categories[1] = new Category("Weight", weight);
        this.categories[2] = new Category("Era", era);
        this.categories[3] = new Category("Legs", legs);
        this.categories[4] = new Category("Wings", wings);
    }

    //accesors
    public String getName(){ return name; }

    //gets the category of the with the same name as the string input
    public Category getCategory(String input){
        for (int i=0; i<categories.length; i++){
            if (categories[i].getName().equals(input)){
                return categories[i];
            }
        }
        return null;
    }

    public boolean isBetterThan(Card opponent, String category){
        if (getCategory(category).getValue() > opponent.getCategory(category).getValue()){
            return true;
        }
        else{
            return false;
        }
    }
}
