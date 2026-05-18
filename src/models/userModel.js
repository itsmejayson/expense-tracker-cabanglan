import pool from "../db/pool.js"; // Import database pool
import bcrypt from "bcrypt"; // Import bcrypt for password hashing

class User {
    static async create({ name, email, passwordHash }) {
        // Create a new user in the database
        const { rows } = await pool.query(
        "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at",
        [name, email, passwordHash]
        );

        return rows[0]; // Return created user
    }

    static async getAllUsers() {
        // Get all users from the database
        const { rows } = await pool.query(
        "SELECT id, name, email, created_at FROM users ORDER BY created_at DESC"
        );

        return rows; // Return all users
    }

    static async getUserById(id) {
        // Get one user by id
        const { rows } = await pool.query(
        "SELECT id, name, email, created_at FROM users WHERE id = $1",
        [id]
        );

        return rows[0]; // Return the found user, or undefined if not found
    }

    static async login({ email, password }) {
    // Find user by email first
    const { rows } = await pool.query(
        "SELECT id, name, email, password_hash FROM users WHERE email = $1",
        [email] // Use parameter to prevent SQL injection
    );

    const user = rows[0]; // Get first matching user

    if (!user) {
        return null; // No user found with this email
    }

    const isPasswordCorrect = await bcrypt.compare(
        password, // Plain password from login form
        user.password_hash // Hashed password from database
    );

    if (!isPasswordCorrect) {
        return null; // Password does not match
    }

    delete user.password_hash; // Remove password hash before returning user

    return user; // Return safe user data
    }
}

export default User; // Export model