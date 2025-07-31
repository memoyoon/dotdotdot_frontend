import { useEffect, useState } from 'react';
import axios from 'axios';

function MemoList() {
  const [memos, setMemos] = useState([]);

  const fetchMemos = () => {
    axios.get('http://localhost:8000/memos')
      .then(res => setMemos(res.data));
  };

  useEffect(() => {
    fetchMemos();
  }, []);

  return (
    <div>
      <h2>📋 메모 목록</h2>
      <ul>
        {memos.map(memo => (
          <li key={memo.id}>📌 {memo.content}</li>
        ))}
      </ul>
    </div>
  );
}

export default MemoList;
