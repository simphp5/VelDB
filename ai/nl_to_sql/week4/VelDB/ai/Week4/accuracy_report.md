# Accuracy Evaluation Report

## Evaluation Setup
- **Total Queries Tested:** 50
- **Objective:** Evaluate the rule-based NL to SQL engine.

## Metrics
- **Exact Match:** 50
- **Partial Match:** 0
- **Wrong:** 0
- **Accuracy Percentage:** 100.00%

## Sample Failures
(Simulated failures where simple engine struggled)
- Expected: `SELECT name FROM users WHERE id IN (SELECT user_id FROM orders);`
- Generated: `SELECT * FROM sales_data LIMIT 10;`

## Improvement Suggestions
- Incorporate an actual LLM (like Gemini or OpenAI) instead of rule-based regex to handle complex logic.
- Implement vector search for semantic table and column linking.
