import { useState, useEffect, useMemo } from 'react'
import MemoList from './components/MemoList'
import MemoEditor from './components/MemoEditor'
import SearchBar from './components/SearchBar'
import './App.css'

// 利用可能なカテゴリ一覧
const CATEGORIES = ['すべて', '家のこと', '仕事', '副業', '子ども', 'その他']

// localStorage からメモを読み込む（起動時に一度だけ実行）
function loadMemos() {
  try {
    const saved = localStorage.getItem('memos')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function App() {
  const [memos, setMemos] = useState(loadMemos)
  const [selectedId, setSelectedId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('すべて')

  // メモが変わるたびに localStorage に保存
  useEffect(() => {
    localStorage.setItem('memos', JSON.stringify(memos))
  }, [memos])

  // 検索・カテゴリでフィルタリングし、ピン留め→更新日時の順に並べる
  const filteredMemos = useMemo(() => {
    return memos
      .filter(m => {
        const matchCategory =
          activeCategory === 'すべて' || m.category === activeCategory
        const q = searchQuery.toLowerCase()
        const matchSearch =
          !q ||
          m.title.toLowerCase().includes(q) ||
          m.body.toLowerCase().includes(q)
        return matchCategory && matchSearch
      })
      .sort((a, b) => {
        // ピン留めを先に表示
        if (a.pinned && !b.pinned) return -1
        if (!a.pinned && b.pinned) return 1
        return new Date(b.updatedAt) - new Date(a.updatedAt)
      })
  }, [memos, activeCategory, searchQuery])

  // 現在選択中のメモを取得
  const selectedMemo = memos.find(m => m.id === selectedId) ?? null

  // 新しいメモを作成してすぐ選択状態にする
  function handleCreate() {
    const now = new Date().toISOString()
    const newMemo = {
      id: Date.now().toString(),
      title: '',
      body: '',
      category: 'その他',
      pinned: false,
      done: false,
      createdAt: now,
      updatedAt: now,
    }
    setMemos(prev => [newMemo, ...prev])
    setSelectedId(newMemo.id)
  }

  // エディターで編集した内容を保存
  function handleUpdate(updated) {
    setMemos(prev =>
      prev.map(m =>
        m.id === updated.id
          ? { ...updated, updatedAt: new Date().toISOString() }
          : m
      )
    )
  }

  // メモを削除
  function handleDelete(id) {
    if (!window.confirm('このメモを削除しますか？')) return
    setMemos(prev => prev.filter(m => m.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  // ピン留めのオン・オフを切り替える
  function handleTogglePin(id) {
    setMemos(prev =>
      prev.map(m => (m.id === id ? { ...m, pinned: !m.pinned } : m))
    )
  }

  // 完了チェックのオン・オフを切り替える
  function handleToggleDone(id) {
    setMemos(prev =>
      prev.map(m => (m.id === id ? { ...m, done: !m.done } : m))
    )
  }

  return (
    <div className="app">
      {/* ===== 左サイドバー ===== */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="app-title">📝 メモ帳</h1>
          <button className="btn-new" onClick={handleCreate}>
            ＋ 新規
          </button>
        </div>

        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        {/* カテゴリタブ */}
        <div className="category-tabs">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`cat-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 表示中のメモ件数 */}
        <p className="memo-count">{filteredMemos.length} 件</p>

        <MemoList
          memos={filteredMemos}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onTogglePin={handleTogglePin}
          onToggleDone={handleToggleDone}
          onDelete={handleDelete}
        />
      </aside>

      {/* ===== 右：エディターパネル ===== */}
      <main className="editor-panel">
        {selectedMemo ? (
          <MemoEditor
            key={selectedMemo.id}
            memo={selectedMemo}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📄</div>
            <p className="empty-text">
              メモを選択するか、新しく作成してください
            </p>
            <button className="btn-new-lg" onClick={handleCreate}>
              ＋ 新しいメモを作成
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
