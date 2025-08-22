import { Outlet } from 'react-router-dom';
import Layout from '../../layout';

// 지금은 무조건 통과. 나중에 FastAPI 붙이면 여기서 세션 확인/리다이렉트
export default function PrivateGate() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}