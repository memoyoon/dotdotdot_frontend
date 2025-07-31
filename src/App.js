import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MemoList from './components/MemoList';
import AddMemo from './components/AddMemo';

function App() {
  return (
    <Router>
      <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h1>📝 DotDotDot 메모앱</h1>

        {/* 네비게이션 */}
        <nav style={{ marginBottom: '1rem' }}>
          <Link to="/" style={{ marginRight: '1rem' }}>📋 메모 목록</Link>
          <Link to="/add">➕ 메모 추가</Link>
        </nav>

        {/* 페이지 라우트 */}
        <Routes>
          <Route path="/" element={<MemoList />} />
          <Route path="/add" element={<AddMemo />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
