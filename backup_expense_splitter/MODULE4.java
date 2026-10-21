class Person {
    String name;
    double balance;

    Person(String name, double balance) {
        this.name = name;
        this.balance = balance;
    }
}

public class MODULE4 {

    public static void main(String[] args) {

        Person creditor =
            new Person("Alagappan", 500);

        Person debtor1 =
            new Person("Arun", -300);

        Person debtor2 =
            new Person("Karthik", -200);

        System.out.println("DEBT SIMPLIFICATION");
        System.out.println("-------------------------");

        double payment1 =
            Math.min(-debtor1.balance, creditor.balance);

        System.out.println(
            debtor1.name + " pays " +
            creditor.name + " : Rs. " + payment1
        );

        debtor1.balance += payment1;
        creditor.balance -= payment1;

        double payment2 =
            Math.min(-debtor2.balance, creditor.balance);

        System.out.println(
            debtor2.name + " pays " +
            creditor.name + " : Rs. " + payment2
        );

        debtor2.balance += payment2;
        creditor.balance -= payment2;

        System.out.println();
        System.out.println("All debts simplified.");
    }
}