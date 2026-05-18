import Transaction from "../models/transactionModel.js"; // Import User model
import jwt from "jsonwebtoken"; // Import jsonwebtoken for token generation

export const createTransaction = async (req, res, next) => {
  try {
    const {title, amount, type, description, categoryId, paymentMethodId, transactionDate } = req.body; // Read transaction input from request body
    const userId = req.user.id; // Get user id from authenticated request context

    const transaction = await Transaction.create({ 
        userId, // User id from authenticated request
        amount, // Transaction amount
        description, // Transaction description
        title, // Transaction title
        type, // Transaction type
        categoryId, // Category id for transaction
        paymentMethodId, // Payment method id for transaction
        transactionDate, // Date of the transaction
    });
    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const userId = req.user.id; // Get user id from authenticated request context
    const categories = await Transaction.getCategories(userId); // Call static model method directly from Transaction class
    res.status(200).json({ categories }); // Return categories in response
    } catch (error) {
    next(error);
    }
};

export const getPaymentMethods = async (req, res, next) => {
  try {
    const userId = req.user.id; // Get user id from authenticated request context
    const paymentMethods = await Transaction.getPaymentMethods(userId); // Call static model method directly from Transaction class
    res.status(200).json({ paymentMethods }); // Return payment methods in response
    } catch (error) {
    next(error);
    }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    const transactionId = req.params.id; // Get transaction id from route parameter
    const userId = req.user.id; // Get user id from authenticated request context
    const success = await Transaction.deleteById(transactionId, userId); // Call static model method to delete transaction

    if (!success) {
      return res.status(404).json({ message: "Transaction not found or does not belong to user" }); // Return 404 if no transaction was deleted
    } else {
      return res.status(200).json({ message: "Transaction deleted successfully" }); // Return success message if transaction was deleted
    } 
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (req, res, next) => {
  try {
    const transactionId = req.params.id; // Get transaction id from route parameter
    const userId = req.user.id; // Get user id from authenticated request context
    const { amount } = req.body; // Read updated transaction data from request body
    const updatedTransaction = await Transaction.updateById(transactionId, userId, { amount }); // Call static model method to update transaction

    if (!updatedTransaction) {
      return res.status(404).json({ message: "Transaction not found or does not belong to user" }); // Return 404 if no transaction was updated
    } else {
      return res.status(200).json(updatedTransaction); // Return updated transaction data in response
    }
  } catch (error) {
    next(error);
  }
};