import { useEffect, useState, useContext } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function AdminApprovalPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [pending, setPending] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [approved, setApproved] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState({});
  const [fetchError, setFetchError] = useState('');
  const [showDebug, setShowDebug] = useState(false);
  const { user: ctxUser } = useContext(AuthContext);

  const fetchLists = async () => {
    setLoading(true);
    setFetchError('');
    try {
      const results = await Promise.allSettled([
        api.get('/api/recipes/admin/pending'),
        api.get('/api/recipes/admin/rejected'),
        api.get('/api/recipes')
      ]);

      // pending
      if (results[0].status === 'fulfilled') {
        setPending(results[0].value.data || []);
      } else {
        setPending([]);
        const reason = results[0].reason?.response?.data?.message || results[0].reason?.message || 'Unknown error';
        setFetchError((s) => s || `Failed to load pending: ${reason}`);
      }

      // rejected
      if (results[1].status === 'fulfilled') {
        setRejected(results[1].value.data || []);
      } else {
        setRejected([]);
        const reason = results[1].reason?.response?.data?.message || results[1].reason?.message || 'Unknown error';
        setFetchError((s) => s || `Failed to load rejected: ${reason}`);
      }

      // approved
      if (results[2].status === 'fulfilled') {
        setApproved(results[2].value.data || []);
      } else {
        setApproved([]);
        const reason = results[2].reason?.response?.data?.message || results[2].reason?.message || 'Unknown error';
        setFetchError((s) => s || `Failed to load approved: ${reason}`);
      }
    } catch (err) {
      console.error('Failed to fetch admin lists', err);
      setFetchError(err.message || 'Failed to fetch lists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const handleReject = async (id) => {
    try {
      setProcessing((s) => ({ ...s, [id]: true }));
      await api.put(`/api/recipes/admin/status/${id}`, { status: 'rejected' });
      await fetchLists();
    } catch (err) {
      console.error('Reject failed', err);
    } finally {
      setProcessing((s) => ({ ...s, [id]: false }));
    }
  };

  const handleApprove = async (id) => {
    try {
      setProcessing((s) => ({ ...s, [id]: true }));
      await api.put(`/api/recipes/admin/status/${id}`, { status: 'approved' });
      await fetchLists();
    } catch (err) {
      console.error('Approve failed', err);
    } finally {
      setProcessing((s) => ({ ...s, [id]: false }));
    }
  };

  return (
    <div className="admin-approvals-page">
      <Navbar />
      <main style={{ padding: '40px 20px' }}>
        <h2 style={{ marginBottom: 16 }}>{t('approvals') || 'Recipe Approvals'}</h2>

        <div className="admin-columns" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <section className="approval-panel">
              <h3 style={{ marginBottom: 12 }}>{t('waitingApproval') || 'Waiting Approval'}</h3>
            {loading ? (
              <p>{t('loading') || 'Loading…'}</p>
            ) : pending.length === 0 ? (
              <p>{t('noPendingRecipes') || 'No pending recipes.'}</p>
            ) : (
              pending.map((r) => (
                <div key={r._id} className="approval-card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/recipes/${r._id}`)}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ width: 80, height: 64, borderRadius: 8, overflow: 'hidden', background: '#f3f3f3' }}>
                      {r.image ? <img src={r.image} alt={r.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                    </div>

                    <div style={{ flex: 1 }}>
                      <strong>{r.title}</strong>
                      <div style={{ fontSize: 13, color: 'var(--muted)' }}>{r.createdBy?.username || r.createdBy || ''}</div>
                    </div>

                    <div>
                      <button className="small-btn" disabled={processing[r._id]} onClick={(e) => { e.stopPropagation(); handleApprove(r._id); }}>
                        {processing[r._id] ? '...' : t('approve') || 'Approve'}
                      </button>
                      <button className="small-btn" style={{ marginLeft: 8, background: 'var(--danger)' }} disabled={processing[r._id]} onClick={(e) => { e.stopPropagation(); handleReject(r._id); }}>
                        {t('reject') || 'Reject'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
            </section>

            <section className="approval-panel" style={{ marginTop: 20 }}>
              <h3 style={{ marginBottom: 12 }}>{t('rejectedRecipes') || 'Rejected Recipes'}</h3>
              {loading ? (
                <p>{t('loading') || 'Loading…'}</p>
              ) : rejected.length === 0 ? (
                <p>{t('noRejectedRecipes') || 'No rejected recipes.'}</p>
              ) : (
                rejected.map((r) => (
                  <div key={r._id} className="approval-card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/recipes/${r._id}`)}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div style={{ width: 72, height: 54, borderRadius: 8, overflow: 'hidden', background: '#f3f3f3' }}>
                        {r.image ? <img src={r.image} alt={r.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                      </div>
                      <div style={{ flex: 1 }}>
                        <strong>{r.title}</strong>
                        <div style={{ fontSize: 13, color: 'var(--muted)' }}>{r.createdBy?.username || r.createdBy || ''}</div>
                      </div>
                      <div>
                        <button className="small-btn" disabled={processing[r._id]} onClick={(e) => { e.stopPropagation(); handleApprove(r._id); }}>
                          {processing[r._id] ? '...' : t('approve') || 'Approve'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </section>
          </div>

          <section className="approval-panel">
            <h3 style={{ marginBottom: 12 }}>{t('approvedRecipes') || 'Approved Recipes'}</h3>
            {approved.length === 0 ? (
              <p>{t('noApprovedRecipes') || 'No approved recipes yet.'}</p>
            ) : (
              approved.slice(0, 20).map((r) => (
                <div key={r._id} className="approval-card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/recipes/${r._id}`)}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ width: 72, height: 54, borderRadius: 8, overflow: 'hidden', background: '#f3f3f3' }}>
                      {r.image ? <img src={r.image} alt={r.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                    </div>
                    <div style={{ flex: 1 }}>
                      <strong>{r.title}</strong>
                      <div style={{ fontSize: 13, color: 'var(--muted)' }}>{r.createdBy?.username || r.createdBy || ''}</div>
                    </div>
                    <div>
                      <button className="small-btn" style={{ marginLeft: 8, background: 'var(--danger)' }} onClick={(e) => { e.stopPropagation(); handleReject(r._id); }}>
                        {t('delete') || 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
