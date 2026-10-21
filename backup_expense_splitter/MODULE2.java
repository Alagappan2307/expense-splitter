class Expense {
    String category;
    String payer;
    double amount;

    Expense(String category, String payer, double amount) {
        this.category = category;
        this.payer = payer;
        this.amount = amount;
    }
}

public class MODULE2 {
    public static void main(String[] args) {

        Expense expense =
            new Expense("Food", "Alagappan", 900);

        System.out.println("EXPENSE DETAILS");
        System.out.println("-------------------------");
        System.out.println("Category : " + expense.category);
        System.out.println("Payer    : " + expense.payer);
        System.out.println("Amount   : Rs. " + expense.amount);
        System.out.println("Expense recorded successfully.");
    }
}