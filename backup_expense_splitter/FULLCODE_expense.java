import java.util.*;

class User {
    int id;
    String name;
    double balance;

    User(int id, String name) {
        this.id = id;
        this.name = name;
        this.balance = 0;
    }
}

class Expense {
    String category;
    String date;
    String payer;
    double amount;
    String status;

    Expense(String category, String date,
            String payer, double amount) {

        this.category = category;
        this.date = date;
        this.payer = payer;
        this.amount = amount;
        this.status = "Pending";
    }
}

public class FULLCODE {

    static Scanner sc = new Scanner(System.in);

    static ArrayList<User> users = new ArrayList<>();
    static ArrayList<Expense> expenses = new ArrayList<>();


    // MODULE 1 - USER & GROUP MANAGEMENT

    static void createUsers() {

        System.out.print("Enter group name: ");
        String groupName = sc.nextLine();

        System.out.print("Enter number of members: ");
        int n = sc.nextInt();
        sc.nextLine();

        for (int i = 1; i <= n; i++) {

            System.out.print(
                "Enter name of member " + i + ": "
            );

            String name = sc.nextLine();

            users.add(new User(i, name));
        }

        System.out.println();
        System.out.println("Group Created: " + groupName);
        System.out.println("Members:");

        for (User user : users) {

            System.out.println(
                user.id + ". " + user.name
            );
        }
    }


    // MODULE 2 - EXPENSE ENTRY

    static void addExpense() {

        System.out.print("\nEnter expense category: ");
        String category = sc.nextLine();

        System.out.print("Enter date: ");
        String date = sc.nextLine();

        System.out.println("\nSelect Payer:");

        for (User user : users) {

            System.out.println(
                user.id + ". " + user.name
            );
        }

        System.out.print("Enter payer ID: ");
        int payerId = sc.nextInt();

        User payer = users.get(payerId - 1);

        System.out.print("Enter expense amount: ");
        double amount = sc.nextDouble();

        System.out.print("Enter number of participants: ");
        int count = sc.nextInt();

        ArrayList<User> participants =
            new ArrayList<>();

        System.out.println("\nSelect Participants:");

        for (int i = 0; i < count; i++) {

            System.out.print("Enter participant ID: ");
            int id = sc.nextInt();

            participants.add(users.get(id - 1));
        }

        Expense expense = new Expense(
            category,
            date,
            payer.name,
            amount
        );

        expenses.add(expense);

        splitExpense(
            payer,
            participants,
            amount
        );

        System.out.println(
            "\nExpense added successfully."
        );
    }


    // MODULE 3 - EXPENSE SPLITTING

    static void splitExpense(
            User payer,
            ArrayList<User> participants,
            double amount) {

        System.out.println("\nSelect Split Method:");
        System.out.println("1. Equal Split");
        System.out.println("2. Percentage Split");
        System.out.println("3. Custom Split");

        System.out.print("Enter choice: ");
        int choice = sc.nextInt();

        double[] shares =
            new double[participants.size()];


        // EQUAL SPLIT

        if (choice == 1) {

            double share =
                amount / participants.size();

            for (int i = 0;
                 i < participants.size();
                 i++) {

                shares[i] = share;
            }
        }


        // PERCENTAGE SPLIT

        else if (choice == 2) {

            double totalPercentage = 0;

            for (int i = 0;
                 i < participants.size();
                 i++) {

                System.out.print(
                    "Enter percentage for " +
                    participants.get(i).name +
                    ": "
                );

                double percentage =
                    sc.nextDouble();

                shares[i] =
                    amount * percentage / 100;

                totalPercentage += percentage;
            }

            if (Math.abs(
                    totalPercentage - 100) > 0.01) {

                System.out.println(
                    "Invalid percentage."
                );

                return;
            }
        }


        // CUSTOM SPLIT

        else if (choice == 3) {

            double total = 0;

            for (int i = 0;
                 i < participants.size();
                 i++) {

                System.out.print(
                    "Enter share for " +
                    participants.get(i).name +
                    ": ₹"
                );

                shares[i] = sc.nextDouble();

                total += shares[i];
            }

            if (Math.abs(
                    total - amount) > 0.01) {

                System.out.println(
                    "Invalid shares."
                );

                return;
            }
        }

        else {

            System.out.println(
                "Invalid choice."
            );

            return;
        }


        // UPDATE BALANCES

        payer.balance += amount;

        System.out.println(
            "\nExpense Split:"
        );

        for (int i = 0;
             i < participants.size();
             i++) {

            participants.get(i).balance
                -= shares[i];

            System.out.println(
                participants.get(i).name +
                " : ₹" +
                String.format(
                    "%.2f",
                    shares[i]
                )
            );
        }
    }


    // DISPLAY CURRENT BALANCES

    static void displayBalances() {

        System.out.println(
            "\nCURRENT BALANCES"
        );

        System.out.println(
            "-------------------------"
        );

        for (User user : users) {

            System.out.println(
                user.name +
                " : ₹" +
                String.format(
                    "%.2f",
                    user.balance
                )
            );
        }
    }


    // MODULE 4 - DEBT SIMPLIFICATION

    static void simplifyDebts() {

        ArrayList<User> debtors =
            new ArrayList<>();

        ArrayList<User> creditors =
            new ArrayList<>();


        for (User user : users) {

            if (user.balance < -0.01) {

                debtors.add(user);
            }

            else if (user.balance > 0.01) {

                creditors.add(user);
            }
        }


        System.out.println(
            "\nSIMPLIFIED SETTLEMENT"
        );

        System.out.println(
            "-------------------------"
        );


        int i = 0;
        int j = 0;


        while (i < debtors.size() &&
               j < creditors.size()) {

            User debtor =
                debtors.get(i);

            User creditor =
                creditors.get(j);


            double amount =
                Math.min(
                    -debtor.balance,
                    creditor.balance
                );


            System.out.println(
                debtor.name +
                " pays " +
                creditor.name +
                " : ₹" +
                String.format(
                    "%.2f",
                    amount
                )
            );


            debtor.balance += amount;

            creditor.balance -= amount;


            if (Math.abs(
                    debtor.balance) < 0.01) {

                debtor.balance = 0;

                i++;
            }


            if (Math.abs(
                    creditor.balance) < 0.01) {

                creditor.balance = 0;

                j++;
            }
        }
    }


    // MODULE 5 - SETTLEMENT & REPORTING

    static void settlementReport() {

        System.out.println(
            "\n================================="
        );

        System.out.println(
            "       SETTLEMENT STATUS"
        );

        System.out.println(
            "================================="
        );


        for (int i = 0;
             i < expenses.size();
             i++) {

            Expense expense =
                expenses.get(i);


            System.out.println(
                "\nExpense " + (i + 1)
            );

            System.out.println(
                "Category : " +
                expense.category
            );

            System.out.println(
                "Amount   : ₹" +
                String.format(
                    "%.2f",
                    expense.amount
                )
            );

            System.out.println(
                "Payer    : " +
                expense.payer
            );


            System.out.print(
                "\nHave you settled the amount for " +
                "Expense " + (i + 1) +
                "? (1 = Yes, 2 = No): "
            );

            int choice = sc.nextInt();


            if (choice == 1) {

                expense.status = "Settled";
            }

            else {

                expense.status = "Pending";
            }
        }


        // FINAL REPORT

        System.out.println(
            "\n================================="
        );

        System.out.println(
            "        FINAL EXPENSE REPORT"
        );

        System.out.println(
            "================================="
        );


        for (int i = 0;
             i < expenses.size();
             i++) {

            Expense expense =
                expenses.get(i);


            System.out.println(
                "\nExpense " + (i + 1) +
                " : " +
                expense.category
            );

            System.out.println(
                "Amount : ₹" +
                String.format(
                    "%.2f",
                    expense.amount
                )
            );

            System.out.println(
                "Status : " +
                expense.status
            );
        }


        System.out.println(
            "\n---------------------------------"
        );

        System.out.println(
            "Settlement Report Generated."
        );
    }


    // MAIN PROGRAM

    public static void main(String[] args) {

        System.out.println(
            "================================="
        );

        System.out.println(
            "        EXPENSE SPLITTER"
        );

        System.out.println(
            "================================="
        );


        // MODULE 1

        createUsers();


        // MODULE 2 & 3

        System.out.print(
            "\nEnter number of expenses: "
        );

        int numberOfExpenses =
            sc.nextInt();

        sc.nextLine();


        for (int i = 1;
             i <= numberOfExpenses;
             i++) {

            System.out.println(
                "\n========== EXPENSE " +
                i +
                " =========="
            );

            addExpense();
        }


        // DISPLAY BALANCES

        displayBalances();


        // MODULE 4

        simplifyDebts();


        // MODULE 5

        settlementReport();


        sc.close();
    }
}