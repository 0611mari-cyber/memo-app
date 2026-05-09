// メモを検索するテキスト入力コンポーネント

function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        className="search-input"
        placeholder="タイトル・本文で検索..."
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {/* 入力済みのときだけクリアボタンを表示 */}
      {value && (
        <button className="search-clear" onClick={() => onChange('')}>
          ✕
        </button>
      )}
    </div>
  )
}

export default SearchBar
