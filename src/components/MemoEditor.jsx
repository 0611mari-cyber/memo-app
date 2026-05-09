// メモを編集・表示するメインエディターコンポーネント
import { useState, useEffect } from 'react'

// 利用可能なカテゴリ（「すべて」は選択肢に含めない）
const CATEGORIES = ['家のこと', '仕事', '副業', '子ども', 'その他']

// 日時を読みやすい形式に変換する
function formatDate(isoString) {
  const d = new Date(isoString)
  return d.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function MemoEditor({ memo, onUpdate, onDelete }) {
  // フォームの状態をメモの内容で初期化
  const [title, setTitle] = useState(memo.title)
  const [body, setBody] = useState(memo.body)
  const [category, setCategory] = useState(memo.category)
  const [pinned, setPinned] = useState(memo.pinned)
  const [done, setDone] = useState(memo.done)

  // 入力が変わるたびに自動保存（500ms のデバウンス）
  useEffect(() => {
    const timer = setTimeout(() => {
      onUpdate({ ...memo, title, body, category, pinned, done })
    }, 500)
    return () => clearTimeout(timer)
  }, [title, body, category, pinned, done])

  // ピン留めトグル（即時反映）
  function handleTogglePin() {
    const next = !pinned
    setPinned(next)
    onUpdate({ ...memo, title, body, category, pinned: next, done })
  }

  // 完了チェックトグル（即時反映）
  function handleToggleDone() {
    const next = !done
    setDone(next)
    onUpdate({ ...memo, title, body, category, pinned, done: next })
  }

  return (
    <div className="editor">
      {/* ===== ヘッダー：ツールバー ===== */}
      <div className="editor-toolbar">
        {/* カテゴリ選択 */}
        <select
          className="category-select"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <div className="toolbar-right">
          {/* ピン留めボタン */}
          <button
            className={`toolbar-btn ${pinned ? 'active' : ''}`}
            onClick={handleTogglePin}
            title={pinned ? 'ピン留め解除' : 'ピン留め'}
          >
            📌 {pinned ? 'ピン留め中' : 'ピン留め'}
          </button>

          {/* 完了チェックボタン */}
          <button
            className={`toolbar-btn ${done ? 'active' : ''}`}
            onClick={handleToggleDone}
            title={done ? '未完了に戻す' : '完了にする'}
          >
            ✅ {done ? '完了済み' : '完了にする'}
          </button>

          {/* 削除ボタン */}
          <button
            className="toolbar-btn delete"
            onClick={() => onDelete(memo.id)}
            title="削除"
          >
            🗑️ 削除
          </button>
        </div>
      </div>

      {/* ===== タイトル入力 ===== */}
      <input
        className="editor-title"
        type="text"
        placeholder="タイトルを入力..."
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      {/* ===== 本文入力 ===== */}
      <textarea
        className="editor-body"
        placeholder="本文を入力..."
        value={body}
        onChange={e => setBody(e.target.value)}
      />

      {/* ===== フッター：作成日時・更新日時 ===== */}
      <div className="editor-footer">
        <span>作成：{formatDate(memo.createdAt)}</span>
        <span>更新：{formatDate(memo.updatedAt)}</span>
      </div>
    </div>
  )
}

export default MemoEditor
