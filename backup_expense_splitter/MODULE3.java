public class MODULE3 {
    public static void main(String[] args) {

        String[] members = {
            "Alagappan", "Arun", "Karthik"
        };

        double expense = 900;
        double share = expense / members.length;

        System.out.println("EXPENSE SPLITTING");
        System.out.println("-------------------------");
        System.out.println("Total Expense : Rs. " + expense);
        System.out.println("Members       : " + members.length);
        System.out.println("Each Share    : Rs. " + share);
        System.out.println();

        for (String member : members) {
            System.out.println(member + " owes Rs. " + share);
        }
    }
}