import Header from './components/Header';

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="layout">
      <Header />
      <div className="container">{children}</div>
    </div>
  );
}