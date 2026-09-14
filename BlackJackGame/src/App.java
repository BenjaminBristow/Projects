public class App {
    public static void main(String[] args) throws Exception {
        //initialise deck and build it
        CardDeck deck = new CardDeck();
        deck.buildDeck(); 

        //initialise players
        Player player1 = new Player();
        Dealer dealer = new Dealer();

        player1.getCard(deck);
        player1.getCard(deck);
        dealer.getCard(deck);
        dealer.getCard(deck);

        int flag = 0;
        while (flag==0){
            player1.printHand();
            if (player1.haveTurn(deck)==1){
                flag = 1;
            }
        }

        flag = 0;
        while (flag==0){
            dealer.printHand();
            System.out.print("\u001B[35mDealer is thinking . \u001B[0m");
            Thread.sleep(2000);
            System.out.print("\u001B[35m . \u001B[0m");
            Thread.sleep(2000);
            System.out.println("\u001B[35m . \u001B[0m");
            Thread.sleep(2000);
            if (dealer.haveTurn(deck)==1){
                flag = 1;
            }
        }

        if (player1.cardTotal > dealer.cardTotal & player1.cardTotal < 22 & dealer.cardTotal < 22){
            System.out.println("\u001B[32m*****YOU WIN*****\u001B[0m");
        }
        else{
            System.out.println("\u001B[31m*****YOU LOSE*****\u001B[0m");
        }
    }
}
