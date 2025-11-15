# FlousWise - AI-Powered Financial Intelligence Platform
## Complete Product Specification (Lean & Production-Ready)

---

## 1. THE PROBLEM

### 1.1 Financial Crisis in Morocco (Real Data)

Income Reality:
- Minimum wage: 3,045 MAD/month ($316 USD)
- Average salary: 5,000 MAD/month
- 50%+ of Moroccans live paycheck-to-paycheck
- Basic living costs: 5,000-7,000 MAD/month
- Critical gap: Most people earn LESS than their expenses

Financial Stress:
- 80%+ of young adults cite money as #1 anxiety source
- 48% feel financially insecure (Deloitte 2025)
- Only 30% have emergency savings
- 79% of 18-24 year-olds report loneliness partly due to financial stress

Knowledge Gap:
- Extremely low financial literacy
- No accessible education in local languages
- Unaware of government programs (RAMED, Tayssir, INDH)
- Poor financial decisions due to lack of guidance

Existing Solutions FAIL:
- Mint/YNAB: Require bank connections (impossible in Morocco)
- Generic apps: Western-focused, ignore Moroccan context
- Financial advisors: Cost 1,000+ MAD/session (unaffordable)
- YouTube/Books: Generic advice, not personalized, not actionable

### 1.2 The Gap

NO solution exists that:
- Works without bank connections
- Understands Moroccan economic reality
- Gives personalized advice based on YOUR situation
- Has deep financial knowledge from proven sources
- Is 100% FREE

---

## 2. THE SOLUTION: FlousWise

### 2.1 What It Does

FlousWise is an intelligent financial advisor powered by AI that:

1. Knows YOU completely - Exhaustive onboarding captures your entire financial picture
2. Tracks YOUR data - Editable dashboard with real-time financial health monitoring
3. Advises YOU specifically - AI chatbot with context from top finance books + YOUR data + Moroccan reality
4. Analyzes YOUR progress - Advanced analytics with health score and visual insights
5. Adapts to YOU - Flexible for any income level, any situation, any goals

### 2.2 Why It's Unique & Perfect

| Feature | Competition | FlousWise |
|---------|-------------|-----------|
| Bank connection required | ✅ | ❌ No bank needed |
| Moroccan context | ❌ | ✅ Built for Morocco |
| AI personalization | ❌ | ✅ RAG + LLM |
| Financial knowledge depth | ❌ | ✅ 10+ bestselling books |
| Editable profile | Basic | ✅ Fully dynamic |
| Advanced analytics | Basic | ✅ Enterprise-grade |
| Intelligent chat | ❌ | ✅ Context-aware AI |
| Government programs | ❌ | ✅ Integrated |
| All income levels | ❌ | ✅ 2,000-50,000 MAD |

Core Differentiators:
1. RAG-Powered AI: Retrieves relevant wisdom from finance books, combined with YOUR data
2. Moroccan-First: Built specifically for Moroccan salaries, expenses, culture, programs
3. Enterprise Architecture: Microservices, event-driven, full observability (production-grade)
4. Complete Editability: Every data point can be updated anytime - advice stays relevant
5. Comprehensive Analytics: Financial health score + dashboards + PDF export

---

## 3. USER WORKFLOW

### 3.1 Complete User Journey


Registration → Onboarding (13 sections) → Dashboard → Analytics/Chat/Export
     ↓              ↓                          ↓           ↓
  JWT Auth    Capture Complete Profile    View/Edit    Get AI Advice


### 3.2 Detailed Step-by-Step Flow

#### Step 1: Registration (2 minutes)

User visits app → Sees landing page → Clicks "Get Started"
↓
Registration form:
  - Email
  - Password (validated: 8+ chars, uppercase, number, special)
  - Name
  - Agree to terms
↓
Submit → Email verification sent → User verifies → Login


#### Step 2: Onboarding (10-15 minutes) - 13 Sections
#### Section 1: Basic Information

Personal Details:
├─ Full Name: [Required]
├─ Age: [Required] (dropdown: 18-100)
├─ Gender: [Optional] (Male/Female/Other/Prefer not to say)
├─ City: [Required] (Dropdown: All Moroccan cities)
└─ Email: [Required]

Living Situation:
├─ Status: [Required]
│  ○ Living alone
│  ○ With family (parents/siblings)
│  ○ With spouse only
│  ○ With spouse and children
│  ○ With roommates
│  ○ Other: [text field]
│
├─ Housing: [Required]
│  ○ Own home (no mortgage)
│  ○ Own home (paying mortgage)
│  ○ Renting
│  ○ Living with family (no rent)
│  ○ Other: [text field]
│
└─ If renting/mortgage:
   ├─ Monthly payment: [] MAD
   └─ Contract end date: [] (optional)


#### Section 2: Income (Comprehensive)

Primary Income:
├─ Employment Status: [Required]
│  ○ Employed full-time
│  ○ Employed part-time
│  ○ Self-employed/Freelancer
│  ○ Business owner
│  ○ Unemployed (actively looking)
│  ○ Unemployed (not looking)
│  ○ Student
│  ○ Retired
│  ○ Homemaker
│  ○ Other: [text field]
│
├─ If employed:
│  ├─ Occupation: [text field]
│  ├─ Monthly net salary: [Required] [] MAD
│  ├─ Salary payment day: [] (1-31)
│  ├─ Income stability:
│  │  ○ Very stable (same amount monthly)
│  │  ○ Mostly stable (varies ±10%)
│  │  ○ Variable (seasonal/commission)
│  │  ○ Highly variable (freelance/irregular)
│  │
│  └─ Work hours per week: [] hours
│
└─ If self-employed/business owner:
   ├─ Business type: [text field]
   ├─ Average monthly income: [] MAD
   ├─ Income variability: [High/Medium/Low]
   └─ Business expenses: [] MAD/month

Additional Income Sources: [Can add multiple]
For each source:
├─ Source name: [text field] (e.g., "Freelance web design", "Rental property", "Side business")
├─ Monthly amount: [] MAD
├─ Frequency: [Dropdown: Regular monthly / Weekly / Irregular / One-time]
└─ Stability: [Stable / Variable]

[+ Add Another Income Source]

Total Monthly Income: [Auto-calculated]


#### Section 3: Dependents & Financial Responsibilities

Family You Support:
├─ Number of people financially dependent on you: []
│
├─ If > 0, specify for each person:
│  ├─ Relationship: [Dropdown: Spouse / Child / Parent / Sibling / Extended family / Other]
│  ├─ Age: [] (optional)
│  ├─ Monthly support amount: [] MAD
│  └─ Notes: [text field] (optional - e.g., "School fees", "Medical expenses")
│
└─ [+ Add Another Dependent]

Children Details: (If applicable)
├─ Number of children: []
├─ For each child:
│  ├─ Age: []
│  ├─ School type:
│  │  ○ Public school
│  │  ○ Private school
│  │  ○ University
│  │  ○ Not in school
│  │
│  └─ Monthly education costs: [] MAD (optional)

Other Financial Obligations:
├─ Do you regularly send money to family members? [Yes/No]
│  └─ If yes:
│     ├─ To whom: [text field]
│     ├─ Amount: [] MAD
│     └─ Frequency: [Monthly/Quarterly/Yearly/Irregular]
│
└─ Any other dependents or financial responsibilities?
   └─ [Large text field for explanation]


#### Section 4: Fixed Monthly Expenses

Housing Costs:
├─ Rent/Mortgage: [] MAD (or "0" if none)
├─ Property tax: [] MAD (optional)
└─ Home insurance: [] MAD (optional)

Utilities (Monthly averages):
├─ Electricity: [] MAD
├─ Water: [] MAD
├─ Gas (butane/natural): [] MAD
├─ Internet: [] MAD
├─ Fixed phone line: [] MAD (optional)

Communication:
├─ Mobile phone plan: [] MAD
├─ Additional phones (family): [] MAD (optional)

Transportation:
├─ Car loan payment: [] MAD (or "0" if none)
├─ Car insurance: [] MAD/month
├─ Monthly fuel: [] MAD (estimate)
├─ Public transport pass: [] MAD
├─ Parking: [] MAD (optional)
├─ Maintenance reserve: [] MAD (optional)

Insurance:
├─ Health insurance: [] MAD/month
├─ Life insurance: [] MAD/month
├─ Other insurance: [] MAD/month

Other Fixed Expenses:
├─ Subscriptions (Netflix, Spotify, gym, etc.):
│  └─ [Can add multiple]
│     ├─ Service name: [text field]
│     └─ Monthly cost: [] MAD
│
└─ Any other regular monthly expenses:
   └─ [Text field with amount]

Total Fixed Expenses: [Auto-calculated]


#### Section 5: Variable Monthly Expenses (Estimates)

Food & Groceries:
├─ Grocery shopping: [] MAD/month
├─ Eating out / Restaurants: [] MAD/month
├─ Coffee/Café: [] MAD/month
└─ Food delivery: [] MAD/month (optional)

Healthcare:
├─ Medications: [] MAD/month (average)
├─ Doctor visits: [] MAD/month (average)
├─ Pharmacy items: [] MAD/month
└─ Do you have RAMED or health insurance? [Yes/No]

Personal Care:
├─ Hygiene products: [] MAD/month
├─ Haircuts/Salon: [] MAD/month
└─ Other personal care: [] MAD/month (optional)

Clothing:
└─ Average monthly spending: [] MAD

Education:
├─ School fees: [] MAD/month
├─ School supplies: [] MAD/month (optional)
├─ Tutoring: [] MAD/month (optional)
├─ Online courses: [] MAD/month (optional)

Entertainment:
├─ Movies/Events: [] MAD/month
├─ Hobbies: [] MAD/month
├─ Sports/Gym: [] MAD/month
└─ Other entertainment: [] MAD/month

Social Obligations:
├─ Gifts (birthdays, weddings): [] MAD/month (average)
├─ Charity/Donations: [] MAD/month
└─ Family gatherings: [] MAD/month

Total Variable Expenses: [Auto-calculated]


#### Section 6: Debts & Liabilities

Current Debts: [Can add multiple]

For each debt:
├─ Debt type:
│  ○ Bank personal loan
│  ○ Car loan
│  ○ Mortgage
│  ○ Credit card
│  ○ Microfinance loan
│  ○ Family loan (informal)
│  ○ Friend loan
│  ○ Store credit / Buy now pay later
│  ○ Other: [text field]
│
├─ Creditor name: [text field] (e.g., "Attijariwafa Bank", "Mother", "Brother")
├─ Total amount owed: [] MAD
├─ Monthly payment: [] MAD
├─ Interest rate: []% (or "0%" for family loans)
├─ Remaining payments: [] months (or "Don't know")
├─ Original purpose: [text field] (optional - e.g., "Car purchase", "Emergency medical")
└─ Notes: [text field] (optional)

[+ Add Another Debt]

Total Debt: [Auto-calculated]
Total Monthly Debt Payments: [Auto-calculated]


#### Section 7: Assets & Savings

Current Savings:
├─ Bank account balance: [] MAD
├─ Cash at home: [] MAD (optional)
├─ Emergency fund specifically: [] MAD
└─ Other liquid savings: [] MAD (optional)

Assets You Own:
Vehicle:
├─ Own a car? [Yes/No]
│  └─ If yes:
│     ├─ Estimated value: [] MAD
│     └─ Still paying loan? [Yes/No]
│
├─ Own a motorcycle? [Yes/No]
│  └─ If yes, estimated value: [] MAD

Property:
├─ Own property? [Yes/No]
│  └─ If yes:
│     ├─ Property type: [Primary residence / Rental property / Land / Other]
│     ├─ Estimated value: [] MAD
│     └─ Still paying mortgage? [Yes/No]

Electronics & Valuables:
├─ Laptop/Computer: [] MAD (optional)
├─ Phone: [] MAD (optional)
├─ Gold/Jewelry: [] MAD (optional)
└─ Other valuable items: [text field + amount] (optional)

Investments: (Optional)
├─ Stocks/Shares: [] MAD
├─ Mutual funds: [] MAD
├─ Business investment: [] MAD
├─ Cryptocurrency: [] MAD
└─ Other investments: [text field + amount]

Total Assets Value: [Auto-calculated]
Net Worth: [Assets - Debts] [Auto-calculated]


#### Section 8: Skills & Income Potential

Your Skills: (For income optimization recommendations)

Employment Skills:
├─ Current job skills: [Multi-select checkboxes + custom]
│  ☐ Technology (programming, design, IT)
│  ☐ Languages (English, French, Spanish, etc.)
│  ☐ Teaching/Training
│  ☐ Sales/Marketing
│  ☐ Accounting/Finance
│  ☐ Healthcare
│  ☐ Engineering
│  ☐ Manual/Technical trades
│  ☐ Creative (art, music, writing)
│  ☐ Other: [text field]
│
├─ Highest education level:
│  ○ Primary school
│  ○ Secondary school
│  ○ Baccalaureate
│  ○ University diploma/license
│  ○ Master's degree
│  ○ PhD
│  ○ Professional certification
│  ○ Self-taught
│
└─ Years of work experience: [] years

Additional Monetizable Skills:
├─ Can drive? [Yes/No]
│  └─ Own a car? [Yes/No]
│
├─ Languages spoken: [Multi-select]
│  ☐ Arabic
│  ☐ French
│  ☐ English
│  ☐ Spanish
│  ☐ Other: [text field]
│
├─ Other skills that could generate income:
│  └─ [Large text field]
│
└─ Time available for side work:
   ├─ Weekday evenings: [] hours/week
   ├─ Weekends: [] hours
   └─ Willingness to pursue side income:
      ○ Very interested
      ○ Somewhat interested
      ○ Only if necessary
      ○ Not interested

Constraints:
├─ Work schedule: [Dropdown: Fixed 9-5 / Flexible / Shift work / Weekend work / Irregular]
├─ Commute time: [] hours/day
└─ Other time constraints: [text field] (optional)


#### Section 9: Financial Goals

What are your financial goals? [Can add multiple, prioritize order]

For each goal:
├─ Goal name: [text field]
│  Examples: "Emergency fund", "Buy apartment", "Retirement", 
│           "Pay off debt", "Start business", "Kids education"
│
├─ Goal type: [Dropdown]
│  ○ Emergency fund
│  ○ Debt elimination
│  ○ Major purchase (home, car)
│  ○ Education fund
│  ○ Business startup
│  ○ Retirement
│  ○ Travel
│  ○ Wedding
│  ○ Other: [text field]
│
├─ Target amount: [] MAD
├─ Target date: [Date picker or "Flexible"]
├─ Current progress: [] MAD (if any)
├─ Priority level:
│  ○ Critical (within 6 months)
│  ○ High (6-12 months)
│  ○ Medium (1-3 years)
│  ○ Low (3+ years)
│
└─ Why is this important to you: [Text field] (optional but recommended)

[+ Add Another Goal]

Primary Goal: [User selects which goal is #1 priority]


#### Section 10: Moroccan-Specific Information

Government Assistance Programs:
├─ Do you currently receive RAMED (free healthcare)? [Yes/No/Don't know]
├─ Do your children receive Tayssir (education support)? [Yes/No/Don't know/No children]
├─ Have you applied for INDH programs? [Yes/No/Don't know what it is]
├─ Are you aware of government housing subsidies? [Yes/No]
└─ Do you receive any other government assistance? [Text field]

Social/Religious Obligations: (Optional)
├─ Regular charity (Sadaqah): [] MAD/month (optional)
├─ Zakat (if you calculate it): [] MAD/year (optional)
├─ Other religious obligations: [text field] (optional)
│
└─ Note: These will be considered in your budget if you want

Seasonal Considerations: (Optional)
├─ Do you want budget adjustments for Ramadan? [Yes/No]
├─ Do you want to plan for Eid expenses? [Yes/No]
└─ Any other seasonal expenses to plan for? [Text field]


#### Section 11: Risk Profile & Preferences

Financial Personality:
├─ How do you feel about risk?
│  ○ Very conservative (safety first, no risks)
│  ○ Somewhat conservative (calculated risks only)
│  ○ Moderate (balanced approach)
│  ○ Somewhat aggressive (willing to take risks for growth)
│  ○ Very aggressive (maximize returns, accept high risk)
│
├─ Financial stress level:
│  ○ Extremely stressed about money daily
│  ○ Often worried about finances
│  ○ Sometimes concerned
│  ○ Rarely worried
│  ○ Financially comfortable
│
├─ Biggest financial fear:
│  [Large text field]
│  Examples: "Not being able to provide for family", "Never buying a home",
│            "Ending up poor in retirement", "Losing my job"
│
└─ Financial habits:
   ├─ Do you track your expenses currently? [Yes/Sometimes/No]
   ├─ Do you have a budget? [Yes/Informal/No]
   ├─ Do you save regularly? [Yes/Sometimes/No]
   └─ Biggest money challenge: [Text field]

Preferences:
├─ How aggressive do you want your savings plan?
│  ○ Very aggressive (save maximum possible)
│  ○ Moderate (balance saving and lifestyle)
│  ○ Conservative (small savings, maintain current lifestyle)
│
├─ Debt payoff philosophy:
│  ○ Pay off all debt ASAP (sacrifice to be debt-free)
│  ○ Balanced approach (debt + some lifestyle)
│  ○ Minimum payments (prioritize lifestyle now)
│
└─ Investment interest:
   ○ Very interested in learning about investing
   ○ Somewhat interested
   ○ Not interested for now (focus on basics)


#### Section 12: Additional Context (Optional but Powerful)

Is there anything specific about your financial situation 
that wasn't covered above?

[Large text area - 500 characters]

Examples of what to share:
• Special medical conditions requiring ongoing expenses
• Legal obligations (alimony, child support)
• Upcoming major life changes (marriage, moving, career change)
• Irregular income patterns or seasonal work
• Cultural/religious practices affecting finances
• Family dynamics impacting money decisions
• Previous financial mistakes you want to avoid
• Specific fears or concerns
• Anything else you think is relevant

This information will be analyzed by AI and incorporated 
into your personalized financial advice.

[Text area]


#### Section 13: Data Privacy & Preferences

Privacy Settings:
├─ Data storage: [Required]
│  ○ I agree to store my financial data encrypted on FlousWise servers
│  ○ I understand I can delete my data anytime
│
├─ AI Analysis: [Required]
   ○ I consent to AI analyzing my data to provide personalized advice


Submit → Profile saved to MongoDB → Redirect to Dashboard


---

#### *Step 3: Dashboard (Core Experience)*

*Layout:*

┌─────────────────────────────────────────────────────────┐
│  FlousWise              [Dashboard][Analytics][Chat]     │
│                         [Export PDF]            [Profile]│
├─────────────────────────────────────────────────────────┤
│                                                          │
│  👋 Welcome, Ahmed                                       │
│                                                          │
│  📊 QUICK SUMMARY                                        │
│  ═══════════════════════════════════════════════════    │
│  Monthly Income:      9,000 MAD                         │
│  Monthly Expenses:    8,200 MAD                         │
│  Net Surplus/Deficit: +800 MAD                          │
│  Financial Health:    62/100 ⚠                         │
│                                                          │
│  [View Detailed Analytics →]                            │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  💰 FINANCIAL PROFILE                                    │
│  ═══════════════════════════════════════════════════    │
│                                                          │
│  Personal Information                    [Edit]         │
│  ├─ Name: Ahmed Bennani                                 │
│  ├─ Age: 28 | City: Casablanca                          │
│  └─ Living: With family (no rent)                       │
│                                                          │
│  Income Sources                          [Edit]         │
│  ├─ Primary: 9,000 MAD/mo (Software Dev)                │
│  └─ Additional: None                                     │
│                                                          │
│  Fixed Expenses (4,500 MAD/mo)          [Edit]         │
│  ├─ Housing: 0 MAD                                      │
│  ├─ Utilities: 500 MAD                                  │
│  ├─ Transportation: 800 MAD                             │
│  └─ Other: 3,200 MAD                                    │
│                                                          │
│  Variable Expenses (3,700 MAD/mo)       [Edit]         │
│  ├─ Food: 2,000 MAD                                     │
│  ├─ Healthcare: 300 MAD                                 │
│  ├─ Entertainment: 500 MAD                              │
│  └─ Other: 900 MAD                                      │
│                                                          │
│  Debts (20,000 MAD total)               [Edit]         │
│  ├─ Credit Card: 3,000 MAD (18% APR)                   │
│  │  └─ Payment: 500 MAD/mo                             │
│  └─ Car Loan: 17,000 MAD (6% APR)                      │
│     └─ Payment: 2,300 MAD/mo                           │
│                                                          │
│  Savings & Assets                        [Edit]         │
│  ├─ Bank Account: 5,000 MAD                            │
│  ├─ Emergency Fund: 5,000 MAD                          │
│  ├─ Car: 80,000 MAD                                    │
│  └─ Net Worth: 75,000 MAD                              │
│                                                          │
│  Financial Goals                         [Edit]         │
│  1. Emergency Fund: 15,000 MAD                          │
│     [██████░░░░░░░░░░] 33% (5,000/15,000)              │
│  2. Pay Off Credit Card: 3,000 MAD                     │
│     [██████░░░░░░░░░░] 33% (1,000/3,000)              │
│  3. Apartment Down Payment: 200,000 MAD                │
│     [░░░░░░░░░░░░░░░░] 0%                             │
│                                                          │
│  Skills & Opportunities                  [Edit]         │
│  ├─ Tech: Programming, Web Design                      │
│  ├─ Languages: Arabic, French, English                 │
│  └─ Available: 10 hrs/week for side work               │
│                                                          │
└─────────────────────────────────────────────────────────┘


*Edit Functionality:*
- Click any [Edit] button → Modal opens with form
- Pre-filled with current data
- User modifies values
- Click Save → Updates MongoDB → Publishes Kafka event → Invalidates Redis cache
- Dashboard instantly reflects changes

---

#### *Step 4: Analytics Dashboard*

*4 Main Visualizations:*

*1. Financial Health Score*

┌──────────────────────────────────────────┐
│  🎯 FINANCIAL HEALTH SCORE               │
│  ════════════════════════════════════    │
│                                          │
│        Your Score: 62/100                │
│      Status: ⚠ Needs Improvement        │
│                                          │
│  [███████████████████░░░░░░░░░░] 62%    │
│                                          │
│  Score Breakdown:                        │
│  ✅ Income Stability: 85/100             │
│  ⚠  Expense Management: 55/100          │
│  ⚠  Debt Health: 50/100                 │
│  ❌ Emergency Fund: 40/100               │
│  ⚠  Savings Rate: 45/100                │
│                                          │
│  💡 Top Recommendations:                 │
│  1. Build emergency fund to 3 months    │
│  2. Pay off high-interest credit card   │
│  3. Reduce expenses by 10%              │
│  4. Start side income (+2,000 MAD/mo)   │
└──────────────────────────────────────────┘


*2. Income vs Expenses Trend*
- Line chart: 6-month history
- Blue line: Income (stable at 9,000)
- Red line: Expenses (8,000-8,500 range)
- Green area: Net surplus
- Insights: "Expenses trending up +5% over 6 months"

*3. Spending by Category*
- Pie chart of expenses
- Debt: 34% (2,800 MAD) 🔴
- Food: 24% (2,000 MAD) 🟠
- Transport: 10% (800 MAD) 🟡
- Other categories
- Insight: "Debt payments consuming 1/3 of income - priority to eliminate"

*4. Net Worth Over Time*
- Line chart showing growth
- Current: 75,000 MAD
- Projection: +10,000 MAD per year at current rate
- 5-year projection: 125,000 MAD

*5. Key Financial Ratios*

Debt-to-Income Ratio: 222%        [████████████████████████░░] ⚠
Target: <200%

Savings Rate: 8.9%                [████████░░░░░░░░░░] ⚠
Target: 15-20%

Emergency Fund: 0.6 months        [████░░░░░░░░░░░░] ❌
Target: 3-6 months

Expense-to-Income: 91%            [██████████████████████░░] ⚠
Target: 70-80%


---

#### *Step 5: AI Chat (The Magic)*

*Chat Interface:*

┌─────────────────────────────────────────────────────────┐
│  💬 AI Financial Advisor                   [Clear Chat] │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  🤖 FlousWise AI                                         │
│  ════════════════════════════════════════════════════   │
│                                                          │
│  Hi Ahmed! I'm your AI financial advisor.               │
│  I have complete access to:                             │
│  • Your financial profile (income, expenses, goals)     │
│  • Knowledge from bestselling finance books         │
│  • Moroccan economic data & government programs         │
│                                                          │
│  Ask me anything about your finances!                   │
│                                                          │
│  💭 Suggested Questions:                                 │
│  [How can I save 3,000 MAD per month?]                 │
│  [Should I pay debt or build emergency fund first?]     │
│  [Create a complete financial plan for me]             │
│  [How can I increase my income with my skills?]        │
│  [Am I eligible for government programs?]              │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [Conversation history appears here]                    │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  Type your question...                            [Send]│
└─────────────────────────────────────────────────────────┘


*Example Conversation:*

*User:* "I want to save 3,000 MAD per month but don't know how. Help me create a plan?"

*AI Response:*

Absolutely, Ahmed! I've analyzed your complete financial profile. 
Here's your personalized 3,000 MAD/month savings plan:

## Current Situation Analysis

Right now you're saving 800 MAD/month (9% of income). To reach 
3,000 MAD/month, you need +2,200 MAD more.

Here's how we get there:

## Strategy 1: Expense Optimization (+600 MAD/month)

Looking at your spending:

1. Food & Eating Out (-300 MAD)
   - Current: 2,000 MAD/month
   - Try meal prepping on weekends
   - Reduce restaurant visits from 8x to 4x per month
   - Savings: ~300 MAD/month

2. Entertainment (-200 MAD)
   - Current: 500 MAD/month  
   - Find free alternatives (parks, home movie nights)
   - Savings: ~200 MAD/month

3. Subscriptions (-100 MAD)
   - Review your 400 MAD/month subscriptions
   - Cancel unused services
   - Savings: ~100 MAD/month

Subtotal: +600 MAD/month from expenses

## Strategy 2: Income Increase (+2,000 MAD/month)

This is your BIGGEST opportunity! You have:
- Tech skills (programming, web design)
- 10 hours/week available
- Languages: Arabic, French, English

Freelance opportunities in Morocco:

1. Web Development Projects
   - Small business websites: 3,000-5,000 MAD each
   - Do 1 project per month = +3,000-5,000 MAD
   - Platforms: Ureed.com, Freelance.ma

2. Online Tutoring  
   - Teach programming: 150-200 MAD/hour
   - 2 students × 2 hours/week = 1,600 MAD/month

3. Part-time Remote Work
   - Many startups need part-time devs
   - 10 hrs/week × 200 MAD/hr = 2,000 MAD/month

Pick ONE: Target +2,000 MAD/month

## Your Complete Plan

Month 1-3:
- Expense cuts: +600 MAD
- Side income: +2,000 MAD  
- Credit card extra payment: -500 MAD
= 2,900 MAD/month saved ✅

Month 4+ (after credit card paid):
- All above: +2,600 MAD
- Freed from credit card: +500 MAD
= 3,100 MAD/month saved 🎉

You'll EXCEED your 3,000 MAD goal!

## Financial Wisdom Applied

This follows principles from Rich Dad Poor Dad and 
I Will Teach You to Be Rich:
1. Increase income first (biggest impact)
2. Cut ruthlessly on things you don't value
3. Eliminate high-interest debt fast
4. Automate your savings

Ready to start? What would you like to explore first?


*How It Works Behind the Scenes:*
1. User sends question
2. AI Service generates embedding of question
3. Queries ChromaDB → Retrieves top 5 relevant book sections
4. Calls Finance Service → Gets complete user profile
5. Loads Moroccan context (salaries, programs, opportunities)
6. Constructs prompt with:
   - System instructions
   - User's complete profile
   - Relevant book excerpts  
   - Moroccan context
   - User question
7. Sends to Ollama (Mistral 7B LLM)
8. Streams response back
9. Saves conversation to MongoDB
10. Publishes event to Kafka (chat.message.sent)

---

#### *Step 6: Export Data*

*Export Options:*

┌──────────────────────────────────────────┐
│  📄 Export Your Financial Profile        │
│  ════════════════════════════════════    │
│                                          │
│  What to include:                        │
│  ☑ Personal information                  │
│  ☑ Income sources                        │
│  ☑ All expenses                          │
│  ☑ Debts & liabilities                   │
│  ☑ Assets & savings                      │
│  ☑ Financial goals                       │
│  ☑ Financial health score                │
│  ☐ Chat conversation history             │
│                                          │
│  Format:                                 │
│  ○ PDF (professional report)             │
│  ○ JSON (machine-readable)               │
│  ○ CSV (spreadsheet)                     │
│                                          │
│  [Generate PDF] [JSON] [CSV]             │
└──────────────────────────────────────────┘


*PDF Output:*
- Professional 10-15 page report
- All financial data formatted nicely
- Charts and visualizations included
- Financial health score breakdown
- Key recommendations
- Suitable for: Loan applications, financial advisors, personal records

---

## 4. TECHNOLOGY STACK

### 4.1 Complete Technology Overview


┌─────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                        │
│  React 18 + Vite + Tailwind CSS + Chart.js             │
│  React Query + React Router + Axios                     │
└───────────────────┬─────────────────────────────────────┘
                    │ HTTP/REST
                    ▼
┌─────────────────────────────────────────────────────────┐
│                  API GATEWAY LAYER                       │
│  Nginx (Routing, Rate Limiting, Load Balancing)        │
└───────────┬────────────────┬────────────────┬───────────┘
            │                │                │
   ┌────────▼────┐  ┌───────▼──────┐  ┌─────▼────────┐
   │   Auth      │  │   Finance    │  │     AI       │
   │  Service    │  │   Service    │  │   Service    │
   │ (Spring     │  │  (Spring     │  │  (FastAPI)   │
   │   Boot)     │  │    Boot)     │  │              │
   └─────┬───────┘  └──────┬───────┘  └──────┬───────┘
         │                 │                  │
         │          ┌──────▼──────┐           │
         │          │    Redis    │           │
         │          │   (Cache)   │           │
         │          └──────┬──────┘           │
         │                 │                  │
         └────────┬────────┴────────┬─────────┘
                  │                 │
         ┌────────▼────────┐  ┌─────▼────────┐
         │    MongoDB      │  │  ChromaDB    │
         │ (Primary DB)    │  │  (Vectors)   │
         └────────┬────────┘  └──────────────┘
                  │
         ┌────────▼────────┐
         │     Kafka       │
         │ (Event Bus)     │
         └─────────────────┘

┌─────────────────────────────────────────────────────────┐
│              OBSERVABILITY & LOGGING                     │
│                                                          │
│  Prometheus → Grafana (Metrics & Dashboards)            │
│  Elasticsearch ← Logstash → Kibana (Centralized Logs)   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    CI/CD PIPELINE                        │
│         GitHub Actions (Test, Build, Deploy)            │
└─────────────────────────────────────────────────────────┘


### 4.2 Technology Justification

#### *Frontend: React 18 + Vite*
*Why:*
- React: Most popular, huge ecosystem, component reusability
- Vite: 10x faster than CRA, instant HMR, smaller bundles
- *Alternatives rejected:* Vue (smaller community), Angular (too heavy)

#### *Styling: Tailwind CSS*
*Why:*
- Utility-first = rapid development
- Small production bundle (<10KB after purge)
- No CSS naming conflicts
- *Alternatives rejected:* Bootstrap (too opinionated), Material-UI (heavy)

#### *State Management: React Query*
*Why:*
- Best for server state (caching, refetching, error handling)
- Auto background updates
- Optimistic updates built-in
- *Alternatives rejected:* Redux (overkill), Context API (manual work)

#### *Charts: Chart.js*
*Why:*
- Lightweight, beautiful, simple API
- Responsive out of the box
- *Alternatives rejected:* Recharts (heavier), D3.js (too complex)

---

#### *Backend: Spring Boot (Java) + FastAPI (Python)*
*Why Microservices:*
- *Technology diversity:* Java for enterprise security, Python for AI/ML
- *Independent scaling:* AI service needs GPU, Finance needs memory
- *Fault isolation:* AI crash doesn't affect core financial features
- *Team autonomy:* In production, teams can work independently

*Why Spring Boot:*
- Mature, production-tested
- Spring Security = enterprise-grade auth
- Excellent transaction support
- Strong MongoDB integration
- *Alternatives rejected:* Node.js (weaker typing), Django (Python but monolithic)

*Why FastAPI:*
- Python = mandatory for AI/ML ecosystem
- Async/await = fast concurrent requests
- Auto API docs (Swagger)
- Type hints = fewer bugs
- *Alternatives rejected:* Flask (no async), Django (overkill)

---

#### *API Gateway: Nginx*
*Why:*
- Industry standard (70% of top websites use it)
- Single entry point for all services
- Built-in rate limiting, load balancing
- Minimal overhead (<1ms latency)
- *Alternatives rejected:* Kong (overkill for MVP), AWS API Gateway (not free locally)

---

#### *Databases: MongoDB + ChromaDB*
*Why MongoDB:*
- Flexible schema (every user's financial situation is different)
- Fast writes (critical for chat messages)
- JSON-native (easy to work with from all services)
- Embedded documents (nest data naturally)
- *Alternatives rejected:* PostgreSQL (rigid schema), MySQL (same)

*Why ChromaDB (Vector Database):*
- Lightweight (perfect for local development)
- No separate server needed
- Integrates with LangChain
- Fast similarity search (<100ms)
- *Alternatives rejected:* Pinecone (paid), Weaviate (heavy), FAISS (lower-level)

*Why NOT PostgreSQL:*
- Initially planned for Auth Service
- *Removed* because MongoDB handles auth data fine
- Eliminates one database = simpler architecture
- Still relational data in MongoDB (user_id references)

---

#### *Caching: Redis*
*Why:*
- Distributed cache (shared across services)
- Sub-millisecond latency
- Reduces DB queries by 70%+
- Perfect for session management
- *Use cases:*
  - Cache user profiles (hit Finance DB less)
  - Cache analytics results (expensive calculations)
  - Store JWT tokens (fast validation)
  - Cache recent chat messages
- *Alternatives rejected:* Memcached (fewer features), in-memory only (not shared)

---

#### *Message Queue: Kafka*
*Why:*
- Event-driven architecture = decoupled services
- Async processing = faster responses
- Event sourcing = audit trail
- Scales to millions of events/sec
- *Use cases:*
  - User registers → Auth publishes → Finance creates profile
  - Profile updated → Finance publishes → AI invalidates cache
  - Chat sent → AI publishes → Analytics tracks usage
- *Alternatives rejected:* RabbitMQ (more complex), Redis Pub/Sub (no persistence)

---

#### *AI/ML: LangChain + Sentence Transformers + Ollama (Mistral 7B)*
*Why LangChain:*
- Built specifically for RAG applications
- Abstracts complexity (embeddings, retrieval, prompting)
- Active community, well-documented
- *Alternatives rejected:* Building from scratch (reinventing wheel)

*Why Sentence Transformers:*
- Fast embedding generation (<50ms per query)
- Good quality (384-dimensional vectors)
- Runs locally (no API costs)
- Small model size (80MB)
- *Alternatives rejected:* OpenAI Embeddings (paid), USE (slower)

*Why Ollama + Mistral 7B:*
- *100% free* (no API costs)
- Runs locally (privacy, no rate limits)
- Mistral 7B: Good quality for size, fast inference (1-2 sec)
- Multilingual (English, French - important for Morocco)
- *Alternatives rejected:* 
  - OpenAI API (paid, privacy concerns)
  - Llama 2 13B (slower, more RAM)
  - GPT-4 (expensive)

---

#### *Observability: Prometheus + Grafana*
*Why:*
- *Prometheus:* Industry-standard metrics collection
  - Pull-based (services expose metrics)
  - Time-series database
  - Powerful query language (PromQL)
  - *Alternatives rejected:* InfluxDB (more complex), Datadog (paid)

- *Grafana:* Best visualization tool
  - Beautiful dashboards
  - Connects to Prometheus, Elasticsearch, etc.
  - Alerting built-in
  - *Alternatives rejected:* Kibana (better for logs), Tableau (paid)

*What We Monitor:*
- Request rate, latency (p50, p95, p99), error rate per service
- Database query times
- Cache hit/miss ratio
- Kafka consumer lag
- LLM inference time
- Memory/CPU usage

---

#### *Logging: ELK Stack (Elasticsearch + Logstash + Kibana)*
*Why:*
- *Elasticsearch:* Fast full-text search of logs
- *Logstash:* Centralized log collection from all services
- *Kibana:* Visualize and search logs
- *Together:* Aggregate logs from 4 services in one place
- Debug faster (search across all services)
- *Alternatives rejected:* 
  - Loki + Grafana (newer, less mature)
  - Splunk (paid, enterprise-focused)
  - CloudWatch (AWS only)

---

#### *CI/CD: GitHub Actions*
*Why:*
- Free for public repos (unlimited minutes)
- Native GitHub integration
- Simple YAML config
- Automated testing on every push
- Build Docker images automatically
- *Alternatives rejected:* Jenkins (need to host), GitLab CI (not using GitLab), CircleCI (paid)

*What It Does:*
1. Run tests (backend + frontend)
2. Build Docker images
3. Push to Docker Hub
4. Security scans (Trivy)
5. Notify on Slack (optional)

---

#### *Deployment: Docker + Docker Compose*
*Why Docker:*
- Consistent environment (dev = prod)
- Isolate dependencies per service
- Easy to share and deploy
- *Alternatives rejected:* VMs (heavy), bare metal (hard to reproduce)

*Why Docker Compose:*
- Orchestrate 12+ containers with one command
- Define networks, volumes, dependencies
- Perfect for local development
- *Alternatives rejected:* Kubernetes (overkill for local), Docker Swarm (less popular)

---

### 4.3 What Makes This Architecture Enterprise-Grade

1. *Microservices Pattern* → Scalability, fault isolation
2. *API Gateway* → Single entry point, security boundary
3. *Event-Driven* → Async processing, loose coupling
4. *Distributed Caching* → Performance optimization
5. *Full Observability* → Metrics + Logs = production-ready
6. *CI/CD Pipeline* → Automated quality gates
7. *Multiple Databases* → Right tool for right job (polyglot persistence)
8. *Load Balancing Ready* → Nginx can route to multiple instances

*This is NOT over-engineered because:*
- Each technology solves a specific problem
- Removing any component reduces functionality or quality
- Architecture supports 10K+ users without major changes
- Demonstrates production-level thinking (what recruiters want)

---

## 5. FUNCTIONAL REQUIREMENTS

### 5.1 User Management

*FR-1: Registration*
- User provides: Email, password, name
- System validates: Email format, password strength (8+ chars, uppercase, number, special)
- System sends verification email
- User clicks link to verify
- System activates account

*FR-2: Authentication*
- User logs in with email + password
- System generates JWT access token (15 min expiry) + refresh token (7 days)
- Tokens stored in HttpOnly cookies (XSS protection)
- System validates token on every request
- Auto-refresh when access token expires

*FR-3: Password Reset*
- User requests reset via email
- System sends reset link (valid 1 hour)
- User creates new password
- System invalidates old password

*FR-4: Session Management*
- System tracks active sessions in Redis
- User can log out (blacklist token)
- User can view active devices (future feature)

---

### 5.2 Financial Profile Management

*FR-5: Profile Creation (Onboarding)*
- User completes 13-section form
- System validates all required fields
- System saves to MongoDB
- System publishes user.profile.created event to Kafka
- System redirects to Dashboard

*FR-6: Profile Viewing*
- User accesses Dashboard
- System retrieves profile from MongoDB (or Redis cache if available)
- System displays all sections organized
- Response time: <200ms (with cache)

*FR-7: Profile Editing*
- User clicks [Edit] on any section
- System displays modal with pre-filled form
- User modifies data
- System validates changes
- System updates MongoDB
- System publishes profile.updated event to Kafka
- System invalidates Redis cache
- Dashboard reflects changes immediately

*FR-8: Partial Updates*
- User can update individual fields without re-submitting entire profile
- System supports PATCH requests to /api/profile/{userId}/{section}
- Example: Update only income without touching expenses

---

### 5.3 Analytics & Insights

*FR-9: Financial Health Score*
- System calculates score (0-100) based on 5 factors:
  - Income stability: 20% weight
  - Expense management: 20% weight
  - Debt health: 20% weight
  - Emergency fund: 25% weight
  - Savings rate: 15% weight
- System assigns status: Critical (0-40), Needs Improvement (41-60), Good (61-80), Excellent (81-100)
- System generates 3-5 actionable recommendations
- Recalculates on profile update

*FR-10: Spending Analysis*
- System aggregates expenses by category
- System calculates percentages
- System generates pie chart data
- System identifies top 3 spending categories
- System provides insights ("Debt consuming 34% of income")

*FR-11: Net Worth Tracking*
- System calculates: Assets - Debts
- System tracks changes over time (time-series data)
- System projects future net worth based on current trajectory
- System shows trend (increasing/decreasing/stable)

*FR-12: Key Financial Ratios*
- *Debt-to-Income:* (Total Debt / Annual Income) × 100 | Target: <200%
- *Savings Rate:* (Monthly Savings / Monthly Income) × 100 | Target: 15-20%
- *Emergency Fund:* Emergency Fund / Monthly Expenses | Target: 3-6 months
- *Expense-to-Income:* (Monthly Expenses / Monthly Income) × 100 | Target: 70-80%
- System color-codes: Green (good), Yellow (warning), Red (critical)

---

### 5.4 AI Chat (RAG-Powered)

*FR-13: Chat Query Processing*
- User submits question via chat interface
- System flow:
  1. Generate embedding of question (Sentence Transformers)
  2. Query ChromaDB for top 5 similar book sections
  3. Fetch user profile from Finance Service (via HTTP or cache)
  4. Load Moroccan economic context
  5. Construct prompt with all context
  6. Send to Ollama (Mistral 7B)
  7. Stream response token-by-token (optional) or return full response
  8. Save conversation to MongoDB
  9. Publish chat.message.sent event to Kafka
- Response time: <3 seconds (target)

*FR-14: Conversation History*
- System saves all messages (user + assistant) to MongoDB
- User can view past conversations
- User can continue previous conversation
- User can search conversations (future feature)
- Conversations organized by date

*FR-15: Context Awareness*
- AI always has access to user's complete profile
- AI references specific user data in responses ("Based on your 9,000 MAD salary...")
- AI cites book sources when applicable ("As Robert Kiyosaki says in Rich Dad Poor Dad...")
- AI understands Moroccan context (salaries, programs, culture)

*FR-16: Suggested Questions*
- System displays 5 suggested questions on first chat load
- Questions tailored to user's situation (e.g., if high debt → "Should I pay off debt or save?")

---

### 5.5 Data Export

*FR-17: PDF Export*
- User clicks "Export PDF"
- System generates comprehensive report:
  - Cover page with user name + date
  - Table of contents
  - All profile sections formatted
  - Charts as images
  - Financial health score breakdown
  - Key recommendations
- Format: Professional, print-ready
- File size: <2MB

*FR-18: JSON Export*
- User clicks "Export JSON"
- System returns complete MongoDB document
- Pretty-printed, human-readable
- Use case: Backup, migrate to another platform

*FR-19: CSV Export*
- User clicks "Export CSV"
- System generates separate CSVs for: Income, Expenses, Debts, Goals, Assets
- System zips files
- Use case: Import to Excel/Google Sheets

---

### 5.6 Moroccan-Specific Features

*FR-20: Government Programs Database*
- System stores information on:
  - RAMED (free healthcare)
  - Tayssir (education support)
  - INDH (social development programs)
  - Housing subsidies
- For each program: Description, eligibility criteria, application process, required documents

*FR-21: Eligibility Checking*
- User asks AI: "Am I eligible for RAMED?"
- System analyzes user income, family size, assets
- System compares against program criteria
- System responds: Yes/No + next steps if eligible

*FR-22: Moroccan Economic Context*
- System has database of:
  - Average salaries by city (Casablanca: 6,500 MAD, Rabat: 7,000 MAD, etc.)
  - Cost of living data
  - Job market trends
- AI uses this to provide context: "Your 9,000 MAD salary is 38% above Casablanca average"

---

### 5.7 System Features

*FR-23: Rate Limiting*
- Nginx enforces: 100 requests/minute per IP
- Prevents abuse, DDoS protection
- Returns 429 (Too Many Requests) if exceeded

*FR-24: Caching Strategy*
- User profile: Cached 5 minutes
- Analytics results: Cached 10 minutes
- Chat history: Cached 1 hour
- Cache invalidation on data update

*FR-25: Event Processing*
- All Kafka events processed within 1 second
- Failed events retried 3 times before dead-letter queue
- Event log maintained for audit trail

*FR-26: Logging*
- All requests logged: timestamp, endpoint, user_id, status, duration
- Errors logged with stack traces
- Sensitive data (passwords, tokens) never logged
- Logs aggregated in Elasticsearch, searchable in Kibana

*FR-27: Metrics Collection*
- Prometheus scrapes metrics every 15 seconds
- Metrics retained for 30 days
- Grafana dashboards refresh every 30 seconds
- Alerts trigger if: error rate >5%, latency >3s, service down

*FR-28: Health Checks*
- Each service exposes /health endpoint
- Nginx checks health every 10 seconds
- Unhealthy service removed from load balancer rotation
- System auto-recovers when service healthy again

---

## 6. USER INTERFACE SCREENS

### 6.1 Essential UI Screens (11 Total)

*1. Landing Page*
- Hero section: "Your Personal AI Financial Advisor"
- Problem statement (80% of Moroccans financially stressed)
- Solution overview (3 key features)
- CTA: "Get Started Free"
- Footer: About, Privacy Policy, Contact

*2. Registration Page*
- Form: Email, Password, Confirm Password, Name
- Password strength indicator
- Terms & Conditions checkbox
- Submit → Email verification sent

*3. Login Page*
- Form: Email, Password
- "Forgot Password?" link
- Submit → Dashboard

*4. Email Verification Page*
- Message: "Check your email to verify account"
- Resend verification link

*5. Onboarding Form (13 Sections)*
- Multi-step wizard with progress bar
- 13 sections as detailed in user workflow
- Save progress button (resume later)
- Previous/Next navigation
- Submit → Redirect to Dashboard

*6. Dashboard (Main Screen)*
- Quick summary card (income, expenses, net, health score)
- Collapsible sections for all profile data
- Edit buttons on each section
- Navigation: Dashboard, Analytics, Chat, Export
- Profile dropdown (top-right)

*7. Edit Modal (Generic)*
- Overlay modal
- Form with pre-filled current values
- Save/Cancel buttons
- Validation messages
- Closes on save → Dashboard updates

*8. Analytics Dashboard*
- 4 main visualizations (health score, trends, spending, net worth)
- Key ratios with progress bars
- AI-generated insights card
- Export chart button (future feature)

*9. Chat Interface*
- Message list (scrollable)
- User messages (right-aligned, blue)
- AI messages (left-aligned, gray)
- Input field at bottom
- Send button
- Suggested questions chips (first load)
- Markdown rendering (bold, lists, headers)
- Typing indicator (while AI responds)

*10. Export Page*
- Checkboxes for what to include
- Format selection (PDF, JSON, CSV)
- Generate button
- Download link appears after generation

*11. Profile Settings*
- Email, Name (editable)
- Change Password
- Privacy settings
- Delete Account (with confirmation)
- Logout button

---

## 7. DATA FLOW & ARCHITECTURE

### 7.1 Service Communication Patterns

*Synchronous (REST):*

Frontend → Nginx → Service → MongoDB/Redis → Response
Example: Get user profile
1. Frontend: GET /api/profile/user123
2. Nginx routes to Finance Service
3. Finance Service checks Redis cache
4. If miss: Query MongoDB
5. Cache result in Redis
6. Return to frontend
Time: ~50ms (cached), ~150ms (uncached)


*Asynchronous (Kafka):*

Service A → Kafka → Service B (processes later)
Example: User registers
1. Auth Service: User registers → Save to MongoDB
2. Auth Service: Publish "user.registered" event to Kafka
3. Finance Service: Consumes event → Creates empty profile
4. Time: Event published in <10ms, consumed within 1 second


### 7.2 Example Flow: User Edits Profile


1. User clicks [Edit Income]
   → Frontend displays modal with current income (9,000 MAD)

2. User changes to 10,000 MAD, clicks Save
   → Frontend: PATCH /api/profile/user123/income {salary: 10000}

3. Nginx receives request
   → Validates JWT token
   → Routes to Finance Service (port 8081)

4. Finance Service processes
   → Validates data
   → Updates MongoDB document (income section)
   → Publishes Kafka event: "profile.updated" {user_id, section: "income"}
   → Deletes Redis cache: user:profile:user123
   → Returns success

5. AI Service consumes Kafka event
   → Deletes Redis cache: user:profile:user123 (in AI Service cache)
   → Updates internal context for future chat queries

6. Frontend receives success
   → Updates React Query cache
   → Dashboard re-renders with 10,000 MAD
   → User sees change immediately

7. Metrics tracked
   → Prometheus records: profile_updates_total{section="income"} +1
   → Log sent to Logstash: "User user123 updated income"

Time: Total <200ms for user experience
Background processing (Kafka): <1 second


### 7.3 Example Flow: User Asks AI Question


1. User types: "How can I save 3,000 MAD per month?"
   → Frontend: POST /api/chat {user_id, question, conversation_id}

2. Nginx routes to AI Service (port 8000)

3. AI Service processes:
   a. Generate embedding of question
      Time: ~30ms (Sentence Transformers)
   
   b. Query ChromaDB for similar book sections
      Query: "save money", "budgeting", "increase income"
      Results: Top 5 chunks from finance books
      Time: ~50ms
   
   c. Fetch user profile
      Check Redis: user:profile:user123
      If miss: HTTP GET to Finance Service
      Time: ~20ms (cached), ~100ms (uncached)
   
   d. Load Moroccan context
      From local data store (pre-loaded at startup)
      Time: <5ms
   
   e. Construct prompt
      System instructions: "You are a financial advisor..."
      User profile: {complete JSON of user data}
      Book knowledge: [5 relevant excerpts]
      Moroccan context: {average salaries, programs}
      User question: "How can I save 3,000 MAD..."
      Time: ~10ms
   
   f. Send to Ollama (Mistral 7B)
      HTTP POST to http://localhost:11434/api/generate
      Model processes prompt
      Time: ~1,500ms (1.5 seconds for LLM inference)
   
   g. Receive response
      Stream tokens back to frontend (optional)
      Or return full response
   
   h. Save conversation
      MongoDB: Insert message pair (user + assistant)
      Time: ~20ms
   
   i. Publish event
      Kafka: "chat.message.sent" {user_id, timestamp}
      Time: ~5ms

4. Frontend receives response
   → Displays AI message with markdown formatting
   → Appends to conversation history

5. Metrics tracked
   → Prometheus: chat_messages_total +1
   → Prometheus: llm_inference_duration_seconds 1.5
   → Log: "User user123 sent chat message"

Total time: ~1.7 seconds (mostly LLM inference)
User experience: Feels instant if response streamed


---

## 8. DEVELOPMENT ENVIRONMENT SETUP

### 8.1 Prerequisites

*Required Software (All Free):*

1. Docker Desktop (includes Docker Compose)
   - Download: docker.com/products/docker-desktop
   
2. Ollama (for local LLM)
   - Download: ollama.ai
   - Pull model: ollama pull mistral
   
3. Node.js 18+
   - Download: nodejs.org
   
4. Java JDK 17+
   - Download: adoptium.net (Eclipse Temurin)
   
5. Python 3.11+
   - Download: python.org
   
6. Git
   - Download: git-scm.com
   
7. IDE of choice:
   - VS Code (recommended for frontend + Python)
   - IntelliJ IDEA (recommended for Spring Boot)


### 8.2 One-Command Startup

bash
# Clone repository
git clone https://github.com/yourusername/flouswise.git
cd flouswise

# Start entire stack
docker-compose up -d

# Services will start in this order:
# 1. Zookeeper (for Kafka)
# 2. Kafka
# 3. MongoDB
# 4. Redis
# 5. Elasticsearch
# 6. Logstash
# 7. Kibana
# 8. Prometheus
# 9. Grafana
# 10. Auth Service
# 11. Finance Service
# 12. AI Service
# 13. Nginx

# Check status
docker-compose ps

# View logs
docker-compose logs -f [service-name]

# Access points:
# Frontend: http://localhost (via Nginx)
# Grafana: http://localhost:3000 (admin/admin)
# Kibana: http://localhost:5601
# Prometheus: http://localhost:9090
# Kafka UI: http://localhost:8080 (if using kafka-ui)


### 8.3 Development Workflow

*Backend Development (Spring Boot):*
bash
cd auth-service
./mvnw spring-boot:run

# Hot reload enabled with Spring DevTools
# Edit Java files → Auto-recompile


*Frontend Development (React):*
bash
cd frontend
npm install
npm run dev

# Vite hot reload: <50ms updates
# Access: http://localhost:5173


*AI Service Development (FastAPI):*
bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload

# Auto-reload on file changes


---

## 9. PROJECT STRUCTURE


flouswise/
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Page components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # API clients
│   │   ├── utils/              # Helper functions
│   │   └── App.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── auth-service/                # Spring Boot - Authentication
│   ├── src/main/java/com/flouswise/auth/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── model/
│   │   ├── security/
│   │   └── AuthServiceApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── pom.xml
│   └── Dockerfile
│
├── finance-service/             # Spring Boot - Finance Management
│   ├── src/main/java/com/flouswise/finance/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── model/
│   │   └── FinanceServiceApplication.java
│   ├── src/main/resources/
│   ├── pom.xml
│   └── Dockerfile
│
├── ai-service/                  # FastAPI - AI Chat + RAG
│   ├── app/
│   │   ├── api/
│   │   ├── services/
│   │   │   ├── rag_service.py  # RAG pipeline
│   │   │   ├── llm_service.py  # Ollama client
│   │   │   └── embedding_service.py
│   │   ├── models/
│   │   └── main.py
│   ├── data/
│   │   └── books/              # Finance book texts
│   ├── chroma_data/            # Vector database storage
│   ├── requirements.txt
│   └── Dockerfile
│
├── nginx/
│   ├── nginx.conf              # Routing configuration
│   └── logs/
│
├── prometheus/
│   └── prometheus.yml          # Metrics scraping config
│
├── grafana/
│   ├── dashboards/             # JSON dashboard definitions
│   └── datasources/            # Prometheus connection
│
├── logstash/
│   └── logstash.conf           # Log processing pipeline
│
├── kafka/
│   └── topics.sh               # Topic creation script
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml           # GitHub Actions pipeline
│
├── docker-compose.yml          # Full stack orchestration
├── README.md                   # Setup instructions
└── ARCHITECTURE.md             # Technical deep-dive
```
