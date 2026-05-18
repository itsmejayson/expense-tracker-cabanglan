import pool from "../db/pool.js"; // Import database pool so this model can run SQL queries

class Dashboard {
  static async getSummary(userId) {
    // Compute total income, total expenses, and balance for one user
    const { rows } = await pool.query(
      `
      SELECT
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expenses,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0)
          - COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS balance
      FROM transactions
      WHERE user_id = $1
      `,
      [userId] // Only compute dashboard totals for the logged-in user
    );

    return rows[0]; // Return summary row
  }

  static async getRecentTransactions(userId) {
    // Get latest transactions for one user, including category and payment method names
    const { rows } = await pool.query(
      `
      SELECT
        transactions.id,
        transactions.title,
        transactions.description,
        transactions.type,
        transactions.amount,
        transactions.transaction_date,
        categories.name AS category_name,
        payment_methods.name AS payment_method_name
      FROM transactions
      LEFT JOIN categories
        ON transactions.category_id = categories.id
      LEFT JOIN payment_methods
        ON transactions.payment_method_id = payment_methods.id
      WHERE transactions.user_id = $1
      ORDER BY transactions.transaction_date DESC, transactions.created_at DESC
      LIMIT 20
      `,
      [userId] // Only get transactions owned by logged-in user
    );

    return rows; // Return recent transaction rows
  }

  static async getDashboardData(userId) {
    // Load summary and recent transactions together
    const [summary, recentTransactions] = await Promise.all([
      this.getSummary(userId), // Get totals
      this.getRecentTransactions(userId), // Get latest transactions
    ]);

    return {
      totalIncome: summary.total_income, // Total income amount
      totalExpenses: summary.total_expenses, // Total expense amount
      balance: summary.balance, // Income minus expenses
      recentTransactions, // Recent transaction list
    };
  }
}

export default Dashboard; // Export Dashboard model