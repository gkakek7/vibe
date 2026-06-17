import { useEffect, useState } from 'react';
import api from '../../api/axios';

const EMPTY_FORM = { name: '', priority: '' };

export default function PositionAdmin() {
  const [positions, setPositions] = useState([]);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [editTarget, setEditTarget] = useState(null);

  const fetchPositions = async () => {
    const res = await api.get('/positions');
    setPositions(res.data);
  };

  useEffect(() => { fetchPositions(); }, []);

  const handleEdit = (pos) => {
    setEditTarget(pos);
    setForm({ name: pos.name, priority: pos.priority });
  };

  const handleDelete = async (pos) => {
    if (!window.confirm(`"${pos.name}" 직급을 삭제하시겠습니까?`)) return;
    await api.delete(`/positions/${pos.id}`);
    fetchPositions();
    if (editTarget?.id === pos.id) { setEditTarget(null); setForm(EMPTY_FORM); }
  };

  const handleMoveUp = async (pos) => {
    const res = await api.patch(`/positions/${pos.id}/up`);
    setPositions(res.data);
  };

  const handleMoveDown = async (pos) => {
    const res = await api.patch(`/positions/${pos.id}/down`);
    setPositions(res.data);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { alert('직급명을 입력해주세요.'); return; }
    const payload = { name: form.name.trim(), priority: form.priority !== '' ? Number(form.priority) : undefined };
    if (editTarget) {
      await api.put(`/positions/${editTarget.id}`, payload);
    } else {
      await api.post('/positions', payload);
    }
    fetchPositions();
    setEditTarget(null);
    setForm(EMPTY_FORM);
  };

  const handleCancel = () => { setEditTarget(null); setForm(EMPTY_FORM); };

  return (
    <div className="position-admin">
      {/* 직급 목록 */}
      <div className="position-list-panel">
        <div className="position-list-header">
          <span className="section-title">직급 목록</span>
          <span className="hint">↑↓ 으로 우선순위 조정</span>
        </div>

        {positions.length === 0 ? (
          <p className="empty-msg">등록된 직급이 없습니다.</p>
        ) : (
          <div className="position-list">
            {positions.map((pos, idx) => (
              <div key={pos.id} className={`position-item ${editTarget?.id === pos.id ? 'selected' : ''}`}>
                <span className="position-rank">{idx + 1}</span>
                <span className="position-name">{pos.name}</span>
                <div className="position-item-actions">
                  <button className="order-btn" onClick={() => handleMoveUp(pos)} disabled={idx === 0} title="우선순위 올리기">↑</button>
                  <button className="order-btn" onClick={() => handleMoveDown(pos)} disabled={idx === positions.length - 1} title="우선순위 내리기">↓</button>
                  <button className="action-btn edit" onClick={() => handleEdit(pos)} title="수정">✏️</button>
                  <button className="action-btn del" onClick={() => handleDelete(pos)} title="삭제">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 추가/수정 폼 */}
      <div className="position-form-panel">
        <h3 className="form-title">{editTarget ? `"${editTarget.name}" 수정` : '직급 추가'}</h3>
        <div className="form-field">
          <label>직급명 *</label>
          <input
            type="text"
            value={form.name}
            placeholder="예) 부장, 과장, 대리..."
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            autoFocus
          />
        </div>
        <div className="form-field">
          <label>우선순위 (비워두면 마지막에 추가)</label>
          <input
            type="number"
            min="1"
            value={form.priority}
            placeholder="숫자가 낮을수록 상위 직급"
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
          />
        </div>
        <div className="form-actions">
          <button className="save-btn" onClick={handleSave}>{editTarget ? '수정' : '추가'}</button>
          {editTarget && <button className="cancel-btn" onClick={handleCancel}>취소</button>}
        </div>
      </div>
    </div>
  );
}
