# Expense Splitter with Debt Simplification

> **Department of Information Technology — College Project Review**  
> *Anna University / K. Ramakrishnan College of Engineering (KRCE)*

A complete, production-grade full-stack web application transforming the original Java console program (`FULLCODE.java`) into a modern fintech platform with automated minimum-cash-flow debt simplification, zero-sum financial invariants, and responsive UI.

---

## 🚀 Key Features

1. **Groups & Member Management**: Create groups with arbitrary members, register new users, and maintain isolated ledgers.
2. **Flexible Expense Splitting**:
   - **Equal Split (=)**: Automatically allocates cents/pennies evenly.
   - **Percentage Split (%)**: Custom weighted splits validating exact 100% total.
   - **Custom Split (₹)**: Exact currency allocations validating exact total bill matching.
3. **Double-Entry Balance Engine**: Real-time per-member calculation of `Total Paid`, `Total Consumed`, and `Net Balance` with strict zero-sum verification ($\sum \text{Balances} = 0$).
4. **Greedy Debt Simplification Algorithm**:
   - Reduces complex multi-party debts from up to $\frac{N(N-1)}{2}$ transactions down to at most $(N-1)$ payments.
   - Non-mutating graph calculation matching maximum debtors against maximum creditors.
5. **Settlement Tracking & Audit Log**: Record cash/UPI settlements and generate clean executive summary reports.

---

## 📁 Project Architecture & Files Created

```
JAVA PROJECT REVIEW/
│
├── backend/                               # Spring Boot 3.2.5 (Java 17/21)
│   ├── pom.xml                            # Maven dependencies & build configuration
│   └── src/
│       ├── main/
│       │   ├── java/com/expensesplitter/
│       │   │   ├── ExpenseSplitterApplication.java
│       │   │   ├── config/                # CorsConfig, DataInitializer (sample seed)
│       │   │   ├── entity/                # User, Group, GroupMember, Expense, ExpenseShare, Settlement
│       │   │   ├── repository/            # Spring Data JPA Repositories
│       │   │   ├── dto/                   # 16 DTOs for requests & responses
│       │   │   ├── exception/             # GlobalExceptionHandler & custom exceptions
│       │   │   ├── service/               # UserService, GroupService, ExpenseService, BalanceService,
│       │   │   │                          # DebtSimplificationService, SettlementService
│       │   │   └── controller/            # REST Controllers with /api endpoints
│       │   └── resources/
│       │       └── application.properties # H2 in-memory MySQL mode (zero config)
│       └── test/                          # Unit & Integration tests (JUnit 5)
│
├── frontend/                              # React 18 + Vite + React Router
│   ├── package.json                       # Dependencies (lucide-react, react-router-dom)
│   ├── vite.config.js                     # Proxy configuration (/api -> http://localhost:8080)
│   ├── src/
│   │   ├── main.jsx                       # Entry point
│   │   ├── App.jsx                        # App router & group state
│   │   ├── index.css                      # Modern Fintech Slate & Emerald stylesheet
│   │   ├── api/apiService.js              # Complete Fetch API client
│   │   ├── components/                    # Sidebar, Navbar, StatCard, Modal
│   │   └── pages/
│   │       ├── DashboardPage.jsx          # KPI cards, quick actions, invariant status
│   │       ├── GroupsPage.jsx             # Group creation, member picker
│   │       ├── GroupDetailPage.jsx        # Group balances & add member
│   │       ├── AddExpensePage.jsx         # Equal, %, Custom split calculators
│   │       ├── ExpenseHistoryPage.jsx     # Filterable expense audit trail
│   │       ├── BalancesPage.jsx           # Zero-sum balance sheet
│   │       ├── DebtSimplificationPage.jsx # Greedy cash-flow minimizer visualization
│   │       └── SettlementsReportPage.jsx  # Final settlement report & print
│
├── database/
│   └── schema.sql                         # MySQL 8.0 schema and seed queries
│
├── start-all.bat                          # 1-Click launcher for both backend & frontend
├── run-backend.bat                        # Starts Spring Boot backend (Port 8080)
├── run-frontend.bat                       # Starts React Vite frontend (Port 5173)
└── share-public-link.bat                  # Generates public internet link for live demo
```

---

## ⚡ How to Run the Project (3 Easy Options)

### Option 1: 1-Click Launch (Recommended for Local Demo)
Double-click `start-all.bat` from your file explorer.
- It will automatically launch the backend on `http://localhost:8080`.
- It will launch the frontend on `http://localhost:5173`.
- The sample data with **Alagappan, Arun, Karthik, and Kevin** in group **"FRIENDS"** is loaded and ready immediately!

---

### Option 2: Live Public Website Link (To Show Teachers / Reviewers)
If you need a real public website link (e.g., `https://xxxx.loca.lt`) so evaluators can test the project from anywhere:
1. Double click **`start-all.bat`** (keep the terminal windows open).
2. Double click **`share-public-link.bat`**.
3. It will generate a live URL like:
   ```
   your url is: https://bright-puma-42.loca.lt
   ```
4. Copy and send that link to anyone! Because Vite proxies `/api` requests locally, the entire application works across the internet without touching firewall rules.

---

### Option 3: Free Cloud Hosting (24/7 Permanent Link)
If you want to host it permanently in the cloud for free:

#### Step A: Push Code to GitHub
1. Create a repository on GitHub (e.g. `expense-splitter`).
2. Run in terminal:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of full-stack expense splitter"
   git remote add origin https://github.com/<your-username>/expense-splitter.git
   git push -u origin main
   ```

#### Step B: Deploy Backend on Render (Free)
1. Go to [Render.com](https://render.com) and create a free account.
2. Click **New +** -> **Web Service** -> Connect your GitHub repo.
3. Configure:
   - **Root Directory**: `backend`
   - **Environment**: `Java` (Java 17 or 21)
   - **Build Command**: `mvn clean package -DskipTests`
   - **Start Command**: `java -jar target/expense-splitter-backend-1.0.0.jar`
4. Render will give you a public backend link: `https://your-backend.onrender.com`.

#### Step C: Deploy Frontend on Vercel (Free)
1. Go to [Vercel.com](https://vercel.com) and connect your GitHub repo.
2. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Environment Variable**: `VITE_API_BASE_URL` = `https://your-backend.onrender.com/api`
3. Click **Deploy**. Vercel will give you a live production URL: `https://your-project.vercel.app`.
