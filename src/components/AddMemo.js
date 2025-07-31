import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddMemo() {
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMemo = {
      id: Date.now(),
      content,
    };

    axios.post('http://localhost:8000/memos', newMemo)
      .then(() => {
        navigate('/'); // 저장 후 목록으로 이동
      });
  };

  return (
    <div>
      <h2>➕ 메모 추가</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="메모 입력"
          style={{ padding: '0.5rem', width: '300px' }}
        />
        <button type="submit" style={{ marginLeft: '0.5rem' }}>저장</button>
      </form>
    </div>
  );
}

export default AddMemo;
