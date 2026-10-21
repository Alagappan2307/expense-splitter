package com.expensesplitter.config;

import com.expensesplitter.dto.CreateExpenseRequest;
import com.expensesplitter.dto.ExpenseParticipantShareInput;
import com.expensesplitter.entity.Group;
import com.expensesplitter.entity.GroupMember;
import com.expensesplitter.entity.SplitMethod;
import com.expensesplitter.entity.User;
import com.expensesplitter.repository.GroupMemberRepository;
import com.expensesplitter.repository.GroupRepository;
import com.expensesplitter.repository.UserRepository;
import com.expensesplitter.service.ExpenseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final ExpenseService expenseService;

    public DataInitializer(UserRepository userRepository,
                           GroupRepository groupRepository,
                           GroupMemberRepository groupMemberRepository,
                           ExpenseService expenseService) {
        this.userRepository = userRepository;
        this.groupRepository = groupRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.expenseService = expenseService;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded. Skipping initial data load.");
            return;
        }

        log.info("Seeding demonstration data for Expense Splitter...");

        User alagappan = userRepository.save(new User("Alagappan", "alagappan@krce.ac.in"));
        User arun = userRepository.save(new User("Arun", "arun@krce.ac.in"));
        User karthik = userRepository.save(new User("Karthik", "karthik@krce.ac.in"));
        User kevin = userRepository.save(new User("Kevin", "kevin@krce.ac.in"));

        Group friendsGroup = groupRepository.save(new Group("FRIENDS", "College roommates and project group"));

        groupMemberRepository.save(new GroupMember(friendsGroup, alagappan));
        groupMemberRepository.save(new GroupMember(friendsGroup, arun));
        groupMemberRepository.save(new GroupMember(friendsGroup, karthik));
        groupMemberRepository.save(new GroupMember(friendsGroup, kevin));

        // Sample Expense: ₹900 Food paid by Alagappan (Equal split among Alagappan, Arun, Karthik)
        CreateExpenseRequest foodExp = new CreateExpenseRequest();
        foodExp.setGroupId(friendsGroup.getId());
        foodExp.setPayerId(alagappan.getId());
        foodExp.setDescription("Group Dinner at Restaurant");
        foodExp.setCategory("Food");
        foodExp.setAmount(new BigDecimal("900.00"));
        foodExp.setExpenseDate(LocalDate.now().minusDays(2));
        foodExp.setSplitMethod(SplitMethod.EQUAL);
        foodExp.setParticipants(Arrays.asList(
                new ExpenseParticipantShareInput(alagappan.getId()),
                new ExpenseParticipantShareInput(arun.getId()),
                new ExpenseParticipantShareInput(karthik.getId())
        ));
        expenseService.createExpense(foodExp);

        // Sample Expense: ₹500 Cab Booking paid by Arun (Custom split: Arun ₹200, Karthik ₹300)
        CreateExpenseRequest cabExp = new CreateExpenseRequest();
        cabExp.setGroupId(friendsGroup.getId());
        cabExp.setPayerId(arun.getId());
        cabExp.setDescription("Cab Ride to Campus");
        cabExp.setCategory("Travel");
        cabExp.setAmount(new BigDecimal("500.00"));
        cabExp.setExpenseDate(LocalDate.now().minusDays(1));
        cabExp.setSplitMethod(SplitMethod.CUSTOM);
        cabExp.setParticipants(Arrays.asList(
                new ExpenseParticipantShareInput(arun.getId(), null, new BigDecimal("200.00")),
                new ExpenseParticipantShareInput(karthik.getId(), null, new BigDecimal("300.00"))
        ));
        expenseService.createExpense(cabExp);

        log.info("Demonstration data seeded successfully!");
    }
}
