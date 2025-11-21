# Finance Books Data

## Instructions

Add text files (.txt) of finance book excerpts here. Each file should contain:

- 10-20 pages of key content from the book
- Focus on actionable advice, principles, strategies
- Plain text format (no special formatting needed)
- UTF-8 encoding

## Recommended Books to Include:

1. **rich_dad_poor_dad.txt**
   - Focus: Assets vs. Liabilities, Cash Flow Quadrant, Financial Education
   - Key concepts: Make money work for you, invest in assets, passive income

2. **total_money_makeover.txt**
   - Focus: Debt elimination, Emergency fund, Baby steps
   - Key concepts: Debt snowball method, $1000 emergency fund, 3-6 months expenses

3. **psychology_of_money.txt**
   - Focus: Behavioral finance, Wealth mindset, Compound interest
   - Key concepts: Time + consistency, enough is enough, room for error

4. **i_will_teach_you_to_be_rich.txt**
   - Focus: Automation, Optimization, Conscious spending
   - Key concepts: Pay yourself first, automate savings, optimize spending

5. **your_money_or_your_life.txt**
   - Focus: Financial independence, Life energy, Tracking expenses
   - Key concepts: Life energy = money, frugality, FI number

6. **millionaire_next_door.txt**
   - Focus: Frugality, Wealth-building habits, Living below means
   - Key concepts: High income ≠ wealthy, frugal lifestyle, invest consistently

7. **intelligent_investor.txt**
   - Focus: Value investing, Risk management, Long-term thinking
   - Key concepts: Margin of safety, Mr. Market, index funds

8. **simple_path_to_wealth.txt**
   - Focus: Index investing, FIRE movement, Simplicity
   - Key concepts: VTSAX, F-You money, avoid debt

9. **barefoot_investor.txt**
   - Focus: Practical budgeting, Bank account system, Insurance
   - Key concepts: Bucket system, grow your mojo, automate finances

10. **compound_effect.txt**
    - Focus: Small habits, Consistency, Long-term results
    - Key concepts: Small steps, daily actions, exponential results

## How to Source Content:

1. **Legal Options:**
   - Purchase ebooks and extract key chapters
   - Use book summaries from Blinkist, getAbstract (check licensing)
   - Create your own summaries from library books
   - Use public domain financial wisdom texts

2. **Format:**
   - Save as plain .txt files
   - UTF-8 encoding
   - Name format: `book_title_lowercase_underscore.txt`
   - Include book metadata at top:
     ```
     Title: Rich Dad Poor Dad
     Author: Robert Kiyosaki
     Key Topics: Assets, Liabilities, Financial Education

     [Content starts here...]
     ```

3. **Content Quality:**
   - Focus on actionable advice
   - Include specific examples
   - Keep language clear and direct
   - Remove fluff and filler content

## After Adding Books:

Run the ingestion script to populate ChromaDB:
```bash
cd /home/user/FlousWise/ai-service
python scripts/ingest_books.py
```

This will:
- Read all .txt files from this directory
- Split into 500-word chunks
- Generate embeddings
- Store in ChromaDB for semantic search
