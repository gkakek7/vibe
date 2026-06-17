import { useEffect, useState } from 'react';
import TopNav from '../../components/TopNav';
import api from '../../api/axios';
import './OrgChartPage.css';

function DepartmentNode({ dept, onSelect, selectedId }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="dept-node">
      <div
        className={`dept-label ${selectedId === dept.id ? 'selected' : ''}`}
        onClick={() => { onSelect(dept); setOpen(!open); }}
      >
        {dept.children?.length > 0 && (
          <span className="dept-toggle">{open ? '▼' : '▶'}</span>
        )}
        {dept.name}
      </div>
      {open && dept.children?.length > 0 && (
        <div className="dept-children">
          {dept.children.map((child) => (
            <DepartmentNode key={child.id} dept={child} onSelect={onSelect} selectedId={selectedId} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrgChartPage() {
  const [tree, setTree] = useState([]);
  const [selected, setSelected] = useState(null);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    api.get('/departments').then((res) => setTree(res.data));
  }, []);

  const handleSelect = async (dept) => {
    setSelected(dept);
    const res = await api.get(`/employees/department/${dept.id}`);
    setEmployees(res.data);
  };

  return (
    <div className="orgchart-layout">
      <TopNav />
      <main className="orgchart-main">
        <div className="orgchart-panel">
          <div className="orgchart-tree">
            <h3 className="panel-title">조직도</h3>
            {tree.map((dept) => (
              <DepartmentNode key={dept.id} dept={dept} onSelect={handleSelect} selectedId={selected?.id} />
            ))}
          </div>
          <div className="orgchart-employees">
            <h3 className="panel-title">{selected ? `${selected.name} 사원 목록` : '부서를 선택하세요'}</h3>
            {employees.length === 0 ? (
              <p className="empty-msg">사원이 없습니다.</p>
            ) : (
              <table className="emp-table">
                <thead>
                  <tr><th>이름</th><th>직급</th><th>이메일</th><th>전화번호</th></tr>
                </thead>
                <tbody>
                  {employees.map((e) => (
                    <tr key={e.id}>
                      <td>{e.name}</td>
                      <td>{e.position}</td>
                      <td>{e.email}</td>
                      <td>{e.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
