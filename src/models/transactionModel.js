import pool from "../db/pool.js";

class Transaction {
    static async create({ userId, amount, description, title, type, categoryId, paymentMethodId, transactionDate }) {
        const { rows } = await pool.query(
            "INSERT INTO transactions (user_id, amount, description, title, type, category_id, payment_method_id, transaction_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, user_id, amount, description, title, type, category_id, payment_method_id, transaction_date, created_at",
            [userId, amount, description, title, type, categoryId, paymentMethodId, transactionDate]
        );
        return rows[0];
    }

    static async getTransactionsByUserId(userId) {
        const { rows } = await pool.query(
            "SELECT id, user_id, amount, description, title, category_id, payment_method_id, transaction_date, created_at FROM transactions WHERE user_id = $1 ORDER BY created_at DESC",
            [userId]
        );
        return rows;
    }

    static async getCategories(userId) {
        // Get categories that belong to one user
        const { rows } = await pool.query(
        "SELECT id, name, type, color, icon FROM categories WHERE user_id = $1 ORDER BY name ASC",
        [userId]
        );

        return rows; // Return user's categories
    }

    static async getPaymentMethods(userId) {
        // Get payment methods that belong to one user
        const { rows } = await pool.query(
        "SELECT id, name, type FROM payment_methods WHERE user_id = $1 ORDER BY name ASC",
        [userId]
        );
        return rows; // Return user's payment methods
    }

    static async deleteById(id, userId) {
        // Delete one transaction by id, but only if it belongs to the user
        const { rowCount } = await pool.query(
        "DELETE FROM transactions WHERE id = $1 AND user_id = $2",
        [id, userId]
        );
        return rowCount > 0; // Return true if a row was deleted
    }

    static async updateById(id, userId, { amount }) {
        // Update one transaction by id, but only if it belongs to the user
        const { rows } = await pool.query(
        `UPDATE transactions SET amount = $1 WHERE id = $2 AND user_id = $3 RETURNING id, user_id, amount, description, title, type, category_id, payment_method_id, transaction_date, created_at`,
        [amount, id, userId]
        );
        return rows[0]; // Return the updated transaction
    }
}

export default Transaction;