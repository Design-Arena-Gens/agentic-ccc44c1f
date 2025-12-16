'use client'

import { useState, useEffect } from 'react'

interface Expense {
  id: string
  description: string
  amount: number
  category: string
  date: string
}

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')

  useEffect(() => {
    const stored = localStorage.getItem('expenses')
    if (stored) {
      setExpenses(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])

  const addExpense = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description || !amount) return

    const newExpense: Expense = {
      id: Date.now().toString(),
      description,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString()
    }

    setExpenses([newExpense, ...expenses])
    setDescription('')
    setAmount('')
    setCategory('food')
  }

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id))
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const monthlyExpenses = expenses.filter(e => {
    const expenseDate = new Date(e.date)
    const now = new Date()
    return expenseDate.getMonth() === now.getMonth() &&
           expenseDate.getFullYear() === now.getFullYear()
  }).reduce((sum, e) => sum + e.amount, 0)

  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount
    return acc
  }, {} as Record<string, number>)

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]

  return (
    <div className="container">
      <div className="header">
        <h1>Expense Tracker</h1>
        <div className="stats">
          <div className="stat-card">
            <div className="stat-label">Total Expenses</div>
            <div className="stat-value">${totalExpenses.toFixed(2)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">This Month</div>
            <div className="stat-value">${monthlyExpenses.toFixed(2)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Items</div>
            <div className="stat-value">{expenses.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Top Category</div>
            <div className="stat-value" style={{ fontSize: '16px' }}>
              {topCategory ? topCategory[0] : '-'}
            </div>
          </div>
        </div>
      </div>

      <div className="add-expense">
        <h2>Add Expense</h2>
        <form onSubmit={addExpense}>
          <div className="form-row">
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Coffee, groceries, etc."
                required
              />
            </div>
            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="food">Food</option>
                <option value="transport">Transport</option>
                <option value="entertainment">Entertainment</option>
                <option value="utilities">Utilities</option>
                <option value="shopping">Shopping</option>
                <option value="health">Health</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <button type="submit">Add Expense</button>
        </form>
      </div>

      <div className="expense-list">
        <h2>Recent Expenses</h2>
        {expenses.length === 0 ? (
          <div className="empty-state">No expenses yet. Add your first expense above!</div>
        ) : (
          expenses.map((expense) => (
            <div key={expense.id} className="expense-item">
              <div className="expense-info">
                <div className="expense-description">{expense.description}</div>
                <div className="expense-meta">
                  <span className="expense-category">{expense.category}</span>
                  {new Date(expense.date).toLocaleDateString()}
                </div>
              </div>
              <div className="expense-amount">${expense.amount.toFixed(2)}</div>
              <button className="delete-btn" onClick={() => deleteExpense(expense.id)}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
