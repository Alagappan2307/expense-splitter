import java.util.*;

class User {
    int id;
    String name;
    double balance;

    User(int id, String name) {
        this.id = id;
        this.name = name;
        balance = 0;
    }
}

public class MODULE1 {
    public static void main(String[] args) {

        ArrayList<User> users = new ArrayList<>();

        users.add(new User(1, "Alagappan"));
        users.add(new User(2, "Arun"));
        users.add(new User(3, "Karthik"));

        System.out.println("GROUP: FRIENDS");
        System.out.println("-------------------------");

        for (User user : users) {
            System.out.println(
                user.id + ". " + user.name +
                " | Balance: Rs. " + user.balance
            );
        }
    }
}