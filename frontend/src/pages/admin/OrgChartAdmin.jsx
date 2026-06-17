import { useEffect, useState } from 'react';
import api from '../../api/axios';
import './OrgChartAdmin.css';

function DeptNode({ dept, onAdd, onEdit, onDelete }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="admin-dept-node">
      <div className="admin-dept-row">
        {dept.children?.length > 0 ? (
          <span className="toggle" onClick={() => setOpen(!open)}>{open ? '▼' : '▶'}</span>
        ) : (
          <span className="toggle-placeholder" />
        )}
        <span className="dept-name">{dept.name}</span>
        <div className="dept-actions">
          <button className="action-btn add" onClick={() => onAdd(dept)} title="하위 부서 추가">+</button>
          <button className="action-btn edit" onClick={() => onEdit(dept)} title="수정">✏️</button>
          <button className="action-btn del" onClick={() => onDelete(dept)} title="삭제">🗑️</button>
        </div>
      </div>
      {open && dept.children?.length > 0 && (
        <div className="admin-dept-children">
          {dept.children.map((child) => (
            <DeptNode key={child.id} dept={child} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

const EMPTY_FORM = { name: '', parentId: null, parentName: '', sortOrder: 0 };

export default function OrgChartAdmin({ onClose }) {
  const [tree, setTree] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editTarget, setEditTarget] = useState(null); // null = 추가, dept = 수정

  const fetchTree = async () => {
    const res = await api.get('/departments');
    setTree(res.data);
  };

  useEffect(() => { fetchTree(); }, []);

  const handleAddRoot = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
  };

  const handleAdd = (parentDept) => {
    setEditTarget(null);
    setForm({ name: '', parentId: parentDept.id, parentName: parentDept.name, sortOrder: 0 });
  };

  const handleEdit = (dept) => {
    setEditTarget(dept);
    setForm({ name: dept.name, parentId: dept.parentId ?? null, parentName: '', sortOrder: dept.sortOrder ?? 0 });
  };

  const handleDelete = async (dept) => {
    if (!window.confirm(`"${dept.name}" 부서를 삭제하시겠습니까?`)) return;
    await api.delete(`/departments/${dept.id}`);
    fetchTree();
    if (editTarget?.id === dept.id || form.parentId === dept.id) {
      setEditTarget(null);
      setForm(EMPTY_FORM);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) { alert('부서명을 입력해주세요.'); return; }
    const payload = { name: form.name.trim(), parentId: form.parentId, sortOrder: form.sortOrder };
    if (editTarget) {
      await api.put(`/departments/${editTarget.id}`, payload);
    } else {
      await api.post('/departments', payload);
    }
    fetchTree();
    setEditTarget(null);
    setForm(EMPTY_FORM);
  };

  const handleCancel = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
  };

  return (
    <div className="admin-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="admin-modal">
        <div className="admin-modal-header">
          <h2>조직도 관리</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="admin-modal-body">
          {/* 좌측: 트리 */}
          <div className="admin-tree-panel">
            <button className="add-root-btn" onClick={handleAddRoot}>+ 최상위 부서 추가</button>
            <div className="admin-tree">
              {tree.length === 0 ? (
                <p className="empty-msg">등록된 부서가 없습니다.</p>
              ) : (
                tree.map((dept) => (
                  <DeptNode key={dept.id} dept={dept} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} />
                ))
              )}
            </div>
          </div>

          {/* 우측: 폼 */}
          <div className="admin-form-panel">
            <h3 className="form-title">
              {editTarget ? `"${editTarget.name}" 수정` : form.parentId ? `"${form.parentName}" 하위 부서 추가` : '최상위 부서 추가'}
            </h3>
            <div className="form-field">
              <label>부서명</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="부서명 입력"
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              />
            </div>
            {form.parentId && (
              <div className="form-field">
                <label>상위 부서</label>
                <input type="text" value={form.parentName} readOnly className="readonly" />
              </div>
            )}
            <div className="form-field">
              <label>정렬 순서</label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
              />
            </div>
            <div className="form-actions">
              <button className="save-btn" onClick={handleSave}>저장</button>
              <button className="cancel-btn" onClick={handleCancel}>취소</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
