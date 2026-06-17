import TopNav from '../../components/TopNav';
import './PortalPage.css';

const PORTLETS = [
  { id: 1, title: '공지사항', content: '등록된 공지사항이 없습니다.' },
  { id: 2, title: '전자결재 수신함', content: '대기 중인 결재가 없습니다.' },
  { id: 3, title: '최근 게시물', content: '등록된 게시물이 없습니다.' },
  { id: 4, title: '일정', content: '오늘 일정이 없습니다.' },
];

export default function PortalPage() {
  return (
    <div className="portal-layout">
      <TopNav />
      <main className="portal-main">
        <div className="portlet-grid">
          {PORTLETS.map((p) => (
            <div key={p.id} className="portlet">
              <div className="portlet-header">{p.title}</div>
              <div className="portlet-body">{p.content}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
