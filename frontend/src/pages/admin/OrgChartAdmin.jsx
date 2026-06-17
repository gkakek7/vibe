import { useEffect, useState } from 'react';
import api from '../../api/axios';
import PositionAdmin from './PositionAdmin';
import './OrgChartAdmin.css';

const PANEL = { IDLE: 'idle', DEPT_ADD: 'dept-add', DEPT_EDIT: 'dept-edit', EMP_LIST: 'emp-list', EMP_FORM: 'emp-form' };
const EMPTY_DEPT = { name: '', parentId: null, parentName: '', sortOrder: 0 };
const EMPTY_EMP  = { username: '', password: '', name: '', email: '', phone: '', position: '', role: 'ROLE_USER' };

function DeptNode({ dept, selectedId, onSelect, onAdd, onEdit, onDelete }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="admin-dept-node">
      <div className={`admin-dept-row ${selectedId === dept.id ? 'selected' : ''}`}>
        {dept.children?.length > 0 ? (
          <span className="toggle" onClick={() => setOpen(!open)}>{open ? '▼' : '▶'}</span>
        ) : (
          <span className="toggle-placeholder" />
        )}
        <span className="dept-name" onClick={() => onSelect(dept)}>{dept.name}</span>
        <div className="dept-actions">
          <button className="action-btn add" onClick={() => onAdd(dept)} title="하위 부서 추가">+</button>
          <button className="action-btn edit" onClick={() => onEdit(dept)} title="부서 수정">✏️</button>
          <button className="action-btn del" onClick={() => onDelete(dept)} title="부서 삭제">🗑️</button>
        </div>
      </div>
      {open && dept.children?.length > 0 && (
        <div className="admin-dept-children">
          {dept.children.map((child) => (
            <DeptNode key={child.id} dept={child} selectedId={selectedId}
              onSelect={onSelect} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrgChartAdmin({ onClose }) {
  const [activeTab, setActiveTab] = useState('org');
  const [tree, setTree]           = useState([]);
  const [panel, setPanel]         = useState(PANEL.IDLE);
  const [selectedDept, setSelectedDept] = useState(null);
  const [deptForm, setDeptForm]   = useState(EMPTY_DEPT);
  const [deptTarget, setDeptTarget] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [empForm, setEmpForm]     = useState(EMPTY_EMP);
  const [empTarget, setEmpTarget] = useState(null);

  const fetchTree = async () => {
    const res = await api.get('/departments');
    setTree(res.data);
  };

  const fetchEmployees = async (deptId) => {
    const res = await api.get(`/employees/department/${deptId}`);
    setEmployees(res.data);
  };

  useEffect(() => { fetchTree(); }, []);

  /* ── 부서 핸들러 ── */
  const handleSelectDept = (dept) => {
    setSelectedDept(dept);
    setPanel(PANEL.EMP_LIST);
    fetchEmployees(dept.id);
  };

  const handleAddRoot = () => {
    setDeptTarget(null);
    setDeptForm(EMPTY_DEPT);
    setPanel(PANEL.DEPT_ADD);
  };

  const handleAddChild = (parentDept) => {
    setDeptTarget(null);
    setDeptForm({ name: '', parentId: parentDept.id, parentName: parentDept.name, sortOrder: 0 });
    setPanel(PANEL.DEPT_ADD);
  };

  const handleEditDept = (dept) => {
    setDeptTarget(dept);
    setDeptForm({ name: dept.name, parentId: dept.parentId ?? null, parentName: '', sortOrder: dept.sortOrder ?? 0 });
    setPanel(PANEL.DEPT_EDIT);
  };

  const handleDeleteDept = async (dept) => {
    if (!window.confirm(`"${dept.name}" 부서를 삭제하시겠습니까?\n하위 부서와 소속 사원도 함께 삭제됩니다.`)) return;
    await api.delete(`/departments/${dept.id}`);
    fetchTree();
    if (selectedDept?.id === dept.id || deptForm.parentId === dept.id) {
      setSelectedDept(null);
      setDeptForm(EMPTY_DEPT);
      setEmployees([]);
      setPanel(PANEL.IDLE);
    }
  };

  const handleSaveDept = async () => {
    if (!deptForm.name.trim()) { alert('부서명을 입력해주세요.'); return; }
    const payload = { name: deptForm.name.trim(), parentId: deptForm.parentId, sortOrder: deptForm.sortOrder };
    if (deptTarget) {
      await api.put(`/departments/${deptTarget.id}`, payload);
    } else {
      await api.post('/departments', payload);
    }
    fetchTree();
    setDeptTarget(null);
    setDeptForm(EMPTY_DEPT);
    setPanel(PANEL.IDLE);
  };

  /* ── 사원 핸들러 ── */
  const handleAddEmp = () => {
    setEmpTarget(null);
    setEmpForm(EMPTY_EMP);
    setPanel(PANEL.EMP_FORM);
  };

  const handleEditEmp = (emp) => {
    setEmpTarget(emp);
    setEmpForm({ username: emp.username, password: '', name: emp.name, email: emp.email ?? '', phone: emp.phone ?? '', position: emp.position ?? '', role: emp.role });
    setPanel(PANEL.EMP_FORM);
  };

  const handleDeleteEmp = async (emp) => {
    if (!window.confirm(`"${emp.name}" 사원을 삭제하시겠습니까?`)) return;
    await api.delete(`/employees/${emp.id}`);
    fetchEmployees(selectedDept.id);
  };

  const handleSaveEmp = async () => {
    if (!empForm.name.trim()) { alert('이름을 입력해주세요.'); return; }
    if (!empTarget && !empForm.username.trim()) { alert('아이디를 입력해주세요.'); return; }
    if (!empTarget && !empForm.password.trim()) { alert('비밀번호를 입력해주세요.'); return; }

    const payload = {
      username: empForm.username,
      password: empForm.password || undefined,
      name: empForm.name.trim(),
      email: empForm.email,
      phone: empForm.phone,
      position: empForm.position,
      departmentId: selectedDept.id,
      role: empForm.role,
    };

    if (empTarget) {
      await api.put(`/employees/${empTarget.id}`, payload);
    } else {
      await api.post('/employees', payload);
    }
    fetchEmployees(selectedDept.id);
    setEmpTarget(null);
    setEmpForm(EMPTY_EMP);
    setPanel(PANEL.EMP_LIST);
  };

  /* ── 우측 패널 렌더 ── */
  const renderRightPanel = () => {
    switch (panel) {
      case PANEL.DEPT_ADD:
      case PANEL.DEPT_EDIT:
        return (
          <>
            <h3 className="form-title">
              {panel === PANEL.DEPT_EDIT ? `"${deptTarget?.name}" 수정` : deptForm.parentId ? `"${deptForm.parentName}" 하위 부서 추가` : '최상위 부서 추가'}
            </h3>
            <div className="form-field">
              <label>부서명</label>
              <input type="text" value={deptForm.name} placeholder="부서명 입력"
                onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveDept()} autoFocus />
            </div>
            {deptForm.parentId && (
              <div className="form-field">
                <label>상위 부서</label>
                <input type="text" value={deptForm.parentName} readOnly className="readonly" />
              </div>
            )}
            <div className="form-field">
              <label>정렬 순서</label>
              <input type="number" value={deptForm.sortOrder}
                onChange={(e) => setDeptForm({ ...deptForm, sortOrder: Number(e.target.value) })} />
            </div>
            <div className="form-actions">
              <button className="save-btn" onClick={handleSaveDept}>저장</button>
              <button className="cancel-btn" onClick={() => setPanel(PANEL.IDLE)}>취소</button>
            </div>
          </>
        );

      case PANEL.EMP_LIST:
        return (
          <>
            <div className="emp-list-header">
              <h3 className="form-title">{selectedDept?.name} · 사원 목록</h3>
              <button className="add-emp-btn" onClick={handleAddEmp}>+ 사원 추가</button>
            </div>
            {employees.length === 0 ? (
              <p className="empty-msg">소속 사원이 없습니다.</p>
            ) : (
              <div className="emp-list">
                {employees.map((emp) => (
                  <div key={emp.id} className="emp-item">
                    <div className="emp-info">
                      <span className="emp-name">{emp.name}</span>
                      <span className="emp-meta">{emp.position} · {emp.email}</span>
                    </div>
                    <div className="emp-item-actions">
                      <button className="action-btn edit" onClick={() => handleEditEmp(emp)} title="수정">✏️</button>
                      <button className="action-btn del" onClick={() => handleDeleteEmp(emp)} title="삭제">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        );

      case PANEL.EMP_FORM:
        return (
          <>
            <h3 className="form-title">
              {empTarget ? `"${empTarget.name}" 수정` : `${selectedDept?.name} · 사원 추가`}
            </h3>
            {!empTarget && (
              <div className="form-field">
                <label>아이디 *</label>
                <input type="text" value={empForm.username} placeholder="로그인 아이디"
                  onChange={(e) => setEmpForm({ ...empForm, username: e.target.value })} autoFocus />
              </div>
            )}
            <div className="form-field">
              <label>{empTarget ? '비밀번호 (변경 시 입력)' : '비밀번호 *'}</label>
              <input type="password" value={empForm.password} placeholder={empTarget ? '변경하지 않으면 공백' : '비밀번호 입력'}
                onChange={(e) => setEmpForm({ ...empForm, password: e.target.value })} />
            </div>
            <div className="form-field">
              <label>이름 *</label>
              <input type="text" value={empForm.name} placeholder="실명"
                onChange={(e) => setEmpForm({ ...empForm, name: e.target.value })} />
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>직급</label>
                <input type="text" value={empForm.position} placeholder="직급"
                  onChange={(e) => setEmpForm({ ...empForm, position: e.target.value })} />
              </div>
              <div className="form-field">
                <label>권한</label>
                <select value={empForm.role} onChange={(e) => setEmpForm({ ...empForm, role: e.target.value })}>
                  <option value="ROLE_USER">일반</option>
                  <option value="ROLE_ADMIN">관리자</option>
                </select>
              </div>
            </div>
            <div className="form-field">
              <label>이메일</label>
              <input type="email" value={empForm.email} placeholder="이메일"
                onChange={(e) => setEmpForm({ ...empForm, email: e.target.value })} />
            </div>
            <div className="form-field">
              <label>전화번호</label>
              <input type="text" value={empForm.phone} placeholder="전화번호"
                onChange={(e) => setEmpForm({ ...empForm, phone: e.target.value })} />
            </div>
            <div className="form-actions">
              <button className="save-btn" onClick={handleSaveEmp}>저장</button>
              <button className="cancel-btn" onClick={() => { setPanel(PANEL.EMP_LIST); setEmpTarget(null); }}>취소</button>
            </div>
          </>
        );

      default:
        return <p className="empty-msg" style={{ marginTop: 24 }}>부서명을 클릭하면 사원을 관리할 수 있습니다.</p>;
    }
  };

  return (
    <div className="admin-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="admin-modal">
        <div className="admin-modal-header">
          <h2>관리자</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* 탭 메뉴 */}
        <div className="admin-tabs">
          <button className={`admin-tab ${activeTab === 'org' ? 'active' : ''}`} onClick={() => setActiveTab('org')}>
            조직도 관리
          </button>
          <button className={`admin-tab ${activeTab === 'pos' ? 'active' : ''}`} onClick={() => setActiveTab('pos')}>
            직급 관리
          </button>
        </div>

        <div className="admin-modal-body">
          {activeTab === 'org' ? (
            <>
              <div className="admin-tree-panel">
                <button className="add-root-btn" onClick={handleAddRoot}>+ 최상위 부서 추가</button>
                <div className="admin-tree">
                  {tree.length === 0 ? (
                    <p className="empty-msg">등록된 부서가 없습니다.</p>
                  ) : (
                    tree.map((dept) => (
                      <DeptNode key={dept.id} dept={dept} selectedId={selectedDept?.id}
                        onSelect={handleSelectDept} onAdd={handleAddChild}
                        onEdit={handleEditDept} onDelete={handleDeleteDept} />
                    ))
                  )}
                </div>
              </div>
              <div className="admin-form-panel">
                {renderRightPanel()}
              </div>
            </>
          ) : (
            <PositionAdmin />
          )}
        </div>
      </div>
    </div>
  );
}
