import { useState, useEffect, useRef } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import './App.css'

const API = 'http://localhost:8000'
const COLORS = ['#f5c842','#e87040','#6ee7a0','#60a5fa','#c084fc','#f472b6','#34d399','#fb923c']

// Animated counter hook
function useCounter(target, duration = 1000) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (target === 0) { setValue(0); return }
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(target * eased)
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target])
  return value
}

// Circular gauge component
function Gauge({ score }) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 70 ? '#6ee7a0' : score >= 40 ? '#f5c842' : '#fca5a5'
  const label = score >= 70 ? 'Excellent' : score >= 40 ? 'Fair' : 'Needs Work'

  return (
    <div className="gauge-wrap">
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
        <circle cx="65" cy="65" r={radius} fill="none" stroke={color}
          strokeWidth="10" strokeDasharray={circumference}
          strokeDashoffset={offset} strokeLinecap="round"
          style={{ transform: 'rotate(-90deg)', transformOrigin: '65px 65px', transition: 'stroke-dashoffset 1s ease' }} />
        <text x="65" y="60" textAnchor="middle" fill={color} fontSize="22" fontWeight="700" fontFamily="Cormorant Garamond, serif">{score}</text>
        <text x="65" y="78" textAnchor="middle" fill="rgba(240,230,200,0.4)" fontSize="9" letterSpacing="1">{label.toUpperCase()}</text>
      </svg>
    </div>
  )
}

export default function App() {
  const [transactions, setTransactions] = useState([])
  const [summary, setSummary] = useState({ income: 0, expenses: 0, balance: 0, by_category: [] })
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ type: 'expense', amount: '', category: 'Food', description: '', date: new Date().toISOString().split('T')[0] })

  const CATEGORIES = {
    expense: ['Food', 'Rent', 'Transport', 'Entertainment', 'Shopping', 'Health', 'Utilities', 'Other'],
    income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other']
  }

  async function fetchData() {
    const [txRes, sumRes] = await Promise.all([fetch(`${API}/transactions`), fetch(`${API}/summary`)])
    setTransactions(await txRes.json())
    setSummary(await sumRes.json())
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.amount || Number(form.amount) <= 0) return
    await fetch(`${API}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, amount: Number(form.amount) })
    })
    setForm({ type: 'expense', amount: '', category: 'Food', description: '', date: new Date().toISOString().split('T')[0] })
    setShowForm(false)
    fetchData()
  }

  async function deleteTransaction(id) {
    await fetch(`${API}/transactions/${id}`, { method: 'DELETE' })
    fetchData()
  }

  function setType(type) {
    setForm(f => ({ ...f, type, category: CATEGORIES[type][0] }))
  }

  // Animated counters
  const animBalance = useCounter(summary.balance)
  const animIncome = useCounter(summary.income)
  const animExpenses = useCounter(summary.expenses)

  const fmt = (n) => Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  // Financial health score (0-100)
  const healthScore = summary.income === 0 ? 0
    : Math.min(100, Math.round(((summary.income - summary.expenses) / summary.income) * 100 + 50))

  // Consumption %
  const consumptionPct = summary.income === 0 ? 0 : Math.min(100, Math.round((summary.expenses / summary.income) * 100))

  if (loading) return <div className="loading-screen">Loading...</div>

  return (
    <div className="app">
      <div className="bento">

        {/* Hero balance card */}
        <div className="bento-card hero-card">
          <div>
            <div className="hero-label">NET WORTH</div>
            <div className="hero-balance" style={{ color: summary.balance >= 0 ? '#f5c842' : '#fca5a5' }}>
              {summary.balance < 0 ? '-' : ''}${fmt(animBalance)}
            </div>
            <div className="hero-sub">
              <span className="hero-stat income">↑ ${fmt(animIncome)}</span>
              <span className="hero-stat expense">↓ ${fmt(animExpenses)}</span>
            </div>
          </div>
          <button className="add-btn" onClick={() => setShowForm(s => !s)}>
            {showForm ? '✕ Cancel' : '+ New Transaction'}
          </button>
        </div>

        {/* Inline add form */}
        {showForm && (
          <div className="bento-card form-card">
            <div className="type-toggle">
              <button className={`type-btn ${form.type === 'expense' ? 'active-expense' : ''}`} onClick={() => setType('expense')} type="button">↓ Expense</button>
              <button className={`type-btn ${form.type === 'income' ? 'active-income' : ''}`} onClick={() => setType('income')} type="button">↑ Income</button>
            </div>
            <form onSubmit={handleSubmit} className="inline-form">
              <input type="number" placeholder="Amount" step="0.01" min="0.01" value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} className="fi" required />
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="fi">
                {CATEGORIES[form.type].map(c => <option key={c}>{c}</option>)}
              </select>
              <input type="text" placeholder="Description (optional)" value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="fi" />
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="fi" />
              <button type="submit" className="submit-btn">Add</button>
            </form>
          </div>
        )}

        {/* Health score card */}
        <div className="bento-card health-card">
          <div className="mini-label">FINANCIAL HEALTH</div>
          <Gauge score={healthScore} />
          <div className="consumption-wrap">
            <div className="consumption-label">
              <span>Income used</span>
              <span style={{ color: consumptionPct > 90 ? '#fca5a5' : consumptionPct > 70 ? '#f5c842' : '#6ee7a0' }}>{consumptionPct}%</span>
            </div>
            <div className="consumption-bar-bg">
              <div className="consumption-bar" style={{
                width: `${consumptionPct}%`,
                background: consumptionPct > 90 ? '#fca5a5' : consumptionPct > 70 ? '#f5c842' : '#6ee7a0'
              }} />
            </div>
          </div>
        </div>

        {/* Income card */}
        <div className="bento-card mini-card income-card">
          <div className="mini-label">INCOME</div>
          <div className="mini-value income-val">${fmt(animIncome)}</div>
          <div className="mini-count">{transactions.filter(t => t.type === 'income').length} entries</div>
        </div>

        {/* Expense card */}
        <div className="bento-card mini-card expense-card">
          <div className="mini-label">EXPENSES</div>
          <div className="mini-value expense-val">${fmt(animExpenses)}</div>
          <div className="mini-count">{transactions.filter(t => t.type === 'expense').length} entries</div>
        </div>

        {/* Chart card */}
        <div className="bento-card chart-card">
          <div className="card-title">SPENDING</div>
          {summary.by_category.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={summary.by_category} dataKey="amount" nameKey="category"
                    cx="50%" cy="50%" outerRadius={75} innerRadius={42} paddingAngle={2}>
                    {summary.by_category.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={v => `$${v.toFixed(2)}`}
                    contentStyle={{ background: '#111', border: '1px solid rgba(245,200,66,0.2)', borderRadius: '6px', color: '#f0e6c8', fontSize: '0.8rem' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="legend">
                {summary.by_category.slice(0, 4).map((c, i) => (
                  <div key={c.category} className="legend-row">
                    <span className="legend-dot" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="legend-name">{c.category}</span>
                    <span className="legend-amt">${c.amount.toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="no-data">No expense data yet</div>
          )}
        </div>

        {/* Transaction list */}
        <div className="bento-card tx-card-wrap">
          <div className="card-title">TRANSACTIONS <span className="tx-count">{transactions.length}</span></div>
          <div className="tx-scroll">
            {transactions.length === 0 ? (
              <div className="no-data">No transactions yet</div>
            ) : transactions.map(t => (
              <div key={t.id} className={`tx-row ${t.type}`}>
                <div className="tx-icon-wrap">
                  <span className="tx-arrow">{t.type === 'income' ? '↑' : '↓'}</span>
                </div>
                <div className="tx-info">
                  <div className="tx-name">{t.description || t.category}</div>
                  <div className="tx-meta">{t.category} · {t.date}</div>
                </div>
                <div className="tx-right">
                  <span className={`tx-amt ${t.type}`}>{t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}</span>
                  <button className="del-btn" onClick={() => deleteTransaction(t.id)}>✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
