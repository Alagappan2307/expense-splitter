class Member {
    String name;
    double balance;

    Member(String name, double balance) {
        this.name = name;
        this.balance = balance;
    }
}

public class MODULE5 {

    public static void main(String[] args) {

        Member alagappan =
            new Member("Alagappan", 500);

        Member arun =
            new Member("Arun", -300);

        Member karthik =
            new Member("Karthik", -200);

        System.out.println("SETTLEMENT REPORT");
        System.out.println("-------------------------");

        System.out.println(
            "Arun → Alagappan : ₹300"
        );

        System.out.println(
            "Karthik → Alagappan : ₹200"
        );

        arun.balance += 300;
        alagappan.balance -= 300;

        karthik.balance += 200;
        alagappan.balance -= 200;

        System.out.println();
        System.out.println("FINAL BALANCES");
        System.out.println("-------------------------");

        System.out.println(
            alagappan.name + " : Rs. " + alagappan.balance
        );

        System.out.println(
            arun.name + " : Rs. " + arun.balance
        );

        System.out.println(
            karthik.name + " : Rs. " + karthik.balance
        );

        System.out.println();
        System.out.println("Settlement Completed Successfully.");
    }
}