// メモ一覧を表示するサイドバーコンポーネント

// 日時を「2024/01/15 14:30」形式に変換する
function formatDate(isoString) {
  const d = new Date(isoString)
  const y = d.getFullYear()
  const mo = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${y}/${mo}/${day} ${h}:${min}`
}

// カテゴリ別の色を返す
const CATEGORY_COLORS = {
  '家のこと': '#4ade80',
  '仕事': '#60a5fa',
  '副業': '#f472b6',
  '子ども': '#fb923c',
  'その他': '#a78bfa',
}

function MemoList({ memos, selectedId, onSelect, onTogglePin, onToggleDone, onDelete }) {
  // メモが0件のとき
  if (memos.length === 0) {
    return (
      <div className="list-empty">
        <p>メモがありません</p>
      </div>
    )
  }

  return (
    <ul className="memo-list">
      {memos.map(memo => (
        <li
          key={memo.id}
          className={`memo-item ${selectedId === memo.id ? 'selected' : ''} ${memo.done ? 'done' : ''}`}
          onClick={() => onSelect(memo.id)}
        >
          {/* ピン留めアイコン */}
          {memo.pinned && <span className="pin-badge">📌</span>}

          {/* カテゴリバッジ */}
          <span
            className="category-badge"
            style={{ backgroundColor: CATEGORY_COLORS[memo.category] ?? '#d1d5db' }}
          >
            {memo.category}
          </span>

          {/* タイトル */}
          <p className="memo-item-title">
            {memo.done && <span className="done-check">✅ </span>}
            {memo.title || '（タイトルなし）'}
          </p>

          {/* 本文のプレビュー（最初の50文字） */}
          <p className="memo-item-preview">
            {memo.body ? memo.body.slice(0, 50) : '本文なし'}
          </p>

          {/* 更新日時 */}
          <p className="memo-item-date">{formatDate(memo.updatedAt)}</p>

          {/* アクションボタン（ピン・完了・削除） */}
          <div className="memo-item-actions" onClick={e => e.stopPropagation()}>
            <button
              className={`action-btn ${memo.pinned ? 'active' : ''}`}
              title={memo.pinned ? 'ピン留め解除' : 'ピン留め'}
              onClick={() => onTogglePin(memo.id)}
            >
              📌
            </button>
            <button
              className={`action-btn ${memo.done ? 'active' : ''}`}
              title={memo.done ? '未完了に戻す' : '完了にする'}
              onClick={() => onToggleDone(memo.id)}
            >
              ✅
            </button>
            <button
              className="action-btn delete-btn"
              title="削除"
              onClick={() => onDelete(memo.id)}
            >
              🗑️
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default MemoList
