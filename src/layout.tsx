import Header from './components/Header';

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="layout">
      <Header />
      <div>{children}</div>
    </div>
  );
}