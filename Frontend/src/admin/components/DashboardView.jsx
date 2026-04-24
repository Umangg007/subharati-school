import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { getAdminStats } from '../api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const relativeTime = (iso) => {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const diff = (new Date(iso) - Date.now()) / 1000;
  if (Math.abs(diff) < 60)  return rtf.format(Math.round(diff), 'second');
  if (Math.abs(diff) < 3600) return rtf.format(Math.round(diff / 60), 'minute');
  if (Math.abs(diff) < 86400) return rtf.format(Math.round(diff / 3600), 'hour');
  return rtf.format(Math.round(diff / 86400), 'day');
};

const Skeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-28 bg-slate-200 rounded-xl" />
      ))}
    </div>
    <div className="h-72 bg-slate-200 rounded-xl" />
  </div>
);

const DashboardView = ({ pageVariants }) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['adminStats'],
    queryFn: getAdminStats,
    refetchInterval: 30000,
  });

  if (isLoading) return <Skeleton />;

  if (error) return (
    <div className="loading-container">
      <div className="error-icon">⚠️</div>
      <h3>Failed to load stats</h3>
      <p>{error.message}</p>
      <button className="retry-btn" onClick={() => refetch()}>Retry</button>
    </div>
  );

  const { totals = {}, recent = {}, monthlyData = [], latestAdmissions = [], latestEnquiries = [] } = data?.data || {};

  const metrics = [
    { label: 'Total Admissions',  value: totals.totalAdmissions  ?? 0, change: `+${recent.recentAdmissions  ?? 0} this week`, color: 'purple' },
    { label: 'Total Enquiries',   value: totals.totalEnquiries   ?? 0, change: `+${recent.recentEnquiries   ?? 0} this week`, color: 'blue' },
    { label: 'Active Events',     value: totals.totalEvents      ?? 0, change: 'total listed',                                  color: 'green' },
    { label: 'Gallery Items',     value: totals.totalGallery     ?? 0, change: 'media files',                                   color: 'orange' },
  ];

  const activity = [
    ...latestAdmissions.map(a => ({ name: a.name, action: `Admission — ${a.course}`, at: a.createdAt, type: 'admission' })),
    ...latestEnquiries.map(e  => ({ name: e.name, action: 'Sent an enquiry',          at: e.createdAt, type: 'enquiry'  })),
  ].sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, 6);

  const chartData = {
    labels: monthlyData.map(d => d.name),
    datasets: [
      {
        label: 'Admissions',
        data: monthlyData.map(d => d.admissions),
        borderColor: '#7c3aed',
        backgroundColor: 'rgba(124,58,237,0.08)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#7c3aed',
      },
      {
        label: 'Enquiries',
        data: monthlyData.map(d => d.enquiries),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.08)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#3b82f6',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' }, title: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {/* KPI Cards */}
      <div className="metrics-grid">
        {metrics.map(({ label, value, change, color }) => (
          <motion.div
            key={label}
            className={`metric-card ${color}`}
            whileHover={{ y: -3, boxShadow: '0 12px 24px -4px rgba(0,0,0,.12)' }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="metric-content">
              <h3>{label}</h3>
              <div className="metric-value">{value}</div>
              <div className="metric-change positive">{change}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart + Activity */}
      <div className="dashboard-grid">
        <motion.div className="chart-card" variants={pageVariants} initial="initial" animate="animate" transition={{ delay: 0.1 }}>
          <h3>6-Month Trend</h3>
          <div className="chart-placeholder">
            <Line data={chartData} options={chartOptions} />
          </div>
        </motion.div>

        <motion.div className="progress-card" variants={pageVariants} initial="initial" animate="animate" transition={{ delay: 0.15 }}>
          <h3>Session 2024–25</h3>
          <div className="progress-content">
            <div className="progress-info">
              <span>Admissions filled</span>
              <span>{totals.totalAdmissions ?? 0}</span>
            </div>
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, ((totals.totalAdmissions ?? 0) / 200) * 100)}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </div>
            <div className="progress-stats">
              <div className="stat"><span className="stat-label">Admissions</span><span className="stat-value">{totals.totalAdmissions ?? 0}</span></div>
              <div className="stat"><span className="stat-label">Enquiries</span><span className="stat-value">{totals.totalEnquiries ?? 0}</span></div>
              <div className="stat"><span className="stat-label">Notices</span><span className="stat-value">{totals.totalNotices ?? 0}</span></div>
            </div>
          </div>
        </motion.div>

        <motion.div className="activity-card" variants={pageVariants} initial="initial" animate="animate" transition={{ delay: 0.2 }}>
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {activity.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>No recent activity.</p>
            ) : activity.map((item, i) => (
              <motion.div
                key={i}
                className="activity-item"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.06 }}
              >
                <div className="activity-avatar">{item.name.slice(0, 2).toUpperCase()}</div>
                <div className="activity-content">
                  <div className="activity-user">{item.name}</div>
                  <div className="activity-action">{item.action}</div>
                  <div className="activity-time">{relativeTime(item.at)}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardView;
