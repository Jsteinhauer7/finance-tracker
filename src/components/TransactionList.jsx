export default function TransactionList({ transactions, onDelete }) {
  if (transactions.length === 0) {
    return <div className="empty">No transactions yet — add one!</div>
  }

  return (
    <div className="transaction-list">
      <h2>Transaction History <span className="count">{transactions.length} entries</span></h2>
      {transactions.map(t => (
        <div key={t.id} className={`tx-card ${t.type}`}>
          <div className="tx-left">
            <span className="tx-icon">{t.type === 'income' ? '↑' : '↓'}</span>
            <div>
              <div className="tx-desc">{t.description || t.category}</div>
              <div className="tx-meta">{t.category} · {t.date}</div>
            </div>
          </div>
          <div className="tx-right">
            <span className={`tx-amount ${t.type}`}>
              {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
            </span>
            <button className="btn-delete" onClick={() => onDelete(t.id)} title="Delete">✕</button>
          </div>
        </div>
      ))}
    </div>
  )
}
