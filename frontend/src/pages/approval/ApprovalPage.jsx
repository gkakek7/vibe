import TopNav from '../../components/TopNav';
import './ApprovalPage.css';

export default function ApprovalPage() {
  return (
    <div className="approval-layout">
      <TopNav />
      <iframe
        src="http://localhost:8081"
        className="approval-iframe"
        title="전자결재"
      />
    </div>
  );
}
