import React, { useEffect, useState } from 'react';
import { Search, Filter, ArrowUpDown, ChevronRight, UserCheck } from 'lucide-react';
import { formatCurrency, getSegmentBadgeClass } from '../utils/formatters';
import { apiService } from '../api/apiService';

export default function CustomerIntelligence({ currency, onSelectCustomer }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('monetary');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchCustomers = () => {
    setLoading(true);
    apiService.getCustomers(search, segmentFilter)
      .then(data => {
        setCustomers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCustomers();
  }, [segmentFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCustomers();
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const sortedCustomers = [...customers].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];
    if (typeof valA === 'string') {
      return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortOrder === 'asc' ? valA - valB : valB - valA;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Controls Bar */}
      <div className="crios-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '350px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search customer ID, category, or segment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem 0.6rem 2.4rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-primary)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>
        </form>

        {/* Segment Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {['all', 'Champions', 'Loyal Customers', 'Potential Loyalists', 'New Customers', 'At Risk', 'Hibernating'].map((seg) => (
            <button
              key={seg}
              onClick={() => setSegmentFilter(seg)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '2rem',
                border: '1px solid var(--border-color)',
                background: segmentFilter === seg ? 'var(--accent-primary)' : 'var(--bg-primary)',
                color: segmentFilter === seg ? '#ffffff' : 'var(--text-muted)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {seg === 'all' ? 'All Segments' : seg}
            </button>
          ))}
        </div>
      </div>

      {/* Main Customers Table */}
      <div className="crios-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Customer Intelligence Directory ({customers.length} Accounts)
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Click any row for comprehensive profile drilldown
          </span>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading Customer Directory...</div>
        ) : (
          <table className="crios-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('customer_id')} style={{ cursor: 'pointer' }}>
                  Customer ID <ArrowUpDown size={12} />
                </th>
                <th onClick={() => handleSort('segment')} style={{ cursor: 'pointer' }}>
                  Segment Tier <ArrowUpDown size={12} />
                </th>
                <th onClick={() => handleSort('recency')} style={{ cursor: 'pointer' }}>
                  Recency <ArrowUpDown size={12} />
                </th>
                <th onClick={() => handleSort('frequency')} style={{ cursor: 'pointer' }}>
                  Frequency <ArrowUpDown size={12} />
                </th>
                <th onClick={() => handleSort('monetary')} style={{ cursor: 'pointer' }}>
                  Monetary Volume <ArrowUpDown size={12} />
                </th>
                <th onClick={() => handleSort('aov')} style={{ cursor: 'pointer' }}>
                  AOV <ArrowUpDown size={12} />
                </th>
                <th>RFM Score</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedCustomers.map((cust) => (
                <tr
                  key={cust.customer_id}
                  onClick={() => onSelectCustomer(cust.customer_id)}
                  style={{ cursor: 'pointer' }}
                >
                  <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{cust.customer_id}</td>
                  <td>
                    <span className={`badge ${getSegmentBadgeClass(cust.segment)}`}>
                      {cust.segment}
                    </span>
                  </td>
                  <td>{cust.recency} days ago</td>
                  <td>{cust.frequency} orders</td>
                  <td style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>
                    {formatCurrency(cust.monetary, currency)}
                  </td>
                  <td>{formatCurrency(cust.aov, currency)}</td>
                  <td>
                    <span className="font-mono" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      R:{cust.r_score} | F:{cust.f_score} | M:{cust.m_score}
                    </span>
                  </td>
                  <td>
                    <ChevronRight size={16} color="var(--text-muted)" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
