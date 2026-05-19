import { useState } from 'react'

const CATEGORIES = {
  expense: ['Food', 'Rent', 'Transport', 'Entertainment', 'Shopping', 'Health', 'Utilities', 'Other'],
  income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other']
}

export default function AddTransaction({ onAdd }) {
  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [submitting, setSubmitting] = useState(false)

  function handleTypeChange(newType) {
    setType(newType)
    setCategory(CATEGORIES[newType][0])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!amount || isNaN(amount) || Number(amount) <= 0) return
    setSubmitting(true)
    await onAdd({ type, amount: Number(amount), category, description, date })
    setAmount('')
    setDescription('')
    setSubmitting(false)
  }

  return (
    <div className="add-form-wrap">
      <div className="add-form-card">
        <h2>Add Transaction</h2>

        <div className="type-toggle">
          <button
            className={`type-btn expense ${type === 'expense' ? 'active' : ''}`}
            onClick={() => handleTypeChange('expense')}
            type="button"
          >
            ↓ Expense
          </button>
          <button
            className={`type-btn income ${type === 'income' ? 'active' : ''}`}
            onClick={() => handleTypeChange('income')}
            type="button"
          >
            ↑ Income
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Amount ($)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="form-input"
            >
              {CATEGORIES[type].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Description (optional)</label>
            <input
              type="text"
              placeholder="What was this for?"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="form-input"
            />
          </div>

          <button type="submit" className="btn-submit" disabled={submitting}>
            {submitting ? 'Adding...' : `Add ${type === 'income' ? 'Income' : 'Expense'}`}
          </button>
        </form>
      </div>
    </div>
  )
}
