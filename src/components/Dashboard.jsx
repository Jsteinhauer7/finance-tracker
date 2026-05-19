import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#6366f1','#f59e0b','#10b981','#ef4444','#3b82f6','#8b5cf6','#ec4899','#14b8a6']

export default function Dashboard({ summary }) {
  const { income, expenses, balance, by_category } = summary

  return (
    <div className="dashboard">
      <div className="stat-grid">
        <div className="stat-card balance">
          <div className="stat-label">Balance</div>
          <div className="stat-value" style={{ color: balance >= 0 ? '#10b981' : '#ef4444' }}>
            ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Income</div>
          <div className="stat-value income">${income.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Expenses</div>
          <div className="stat-value expense">${expenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        </div>
      </div>

      {by_category.length > 0 ? (
        <div className="chart-section">
          <div className="chart-card">
            <h3>Spending by Category</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={by_category}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%" cy="50%"
                  outerRadius={100}
                  innerRadius={55}
                  paddingAngle={3}
                >
                  {by_category.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => `$${v.toFixed(2)}`}
                  contentStyle={{ background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e0e0f0' }}
                />
                <Legend wrapperStyle={{ color: '#e0e0f0', fontSize: '0.82rem' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="category-list">
            <h3>Breakdown</h3>
            {by_category.map((c, i) => (
              <div key={c.category} className="category-row">
                <div className="category-dot" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="category-name">{c.category}</span>
                <div className="category-bar-wrap">
                  <div
                    className="category-bar"
                    style={{
                      width: `${(c.amount / by_category[0].amount) * 100}%`,
                      background: COLORS[i % COLORS.length]
                    }}
                  />
                </div>
                <span className="category-amount">${c.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="empty">No transactions yet — add some to see your dashboard!</div>
      )}
    </div>
  )
}
