import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FaChartLine, FaChartBar, FaChartPie, FaSyncAlt } from 'react-icons/fa';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { getAdminStats } from '../api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AnalyticsView = ({ pageVariants }) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['adminStats'],
    queryFn: getAdminStats,
  });

  if (isLoading) return <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading analytics…</div>;
  if (isError)   return <div style={{ padding: '3rem', textAlign: 'center', color: '#dc2626' }}>Failed to load data</div>;

  const stats = data?.data ?? {};
  const monthlyData = stats.monthlyTrends || [];

  // Line Chart Data
  const lineData = {
    labels: monthlyData.map(d => d.month),
    datasets: [
      {
        label: 'Admissions',
        data: monthlyData.map(d => d.admissions),
        borderColor: '#7c3aed',
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Enquiries',
        data: monthlyData.map(d => d.enquiries),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ],
  };

  // Pie Chart Data (Distribution)
  const pieData = {
    labels: ['Admissions', 'Enquiries', 'Events', 'Notices', 'Gallery'],
    datasets: [{
      data: [
        stats.totalAdmissions || 0,
        stats.totalEnquiries || 0,
        stats.totalEvents || 0,
        stats.totalNotices || 0,
        stats.totalGallery || 0
      ],
      backgroundColor: ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'],
      borderWidth: 0,
    }]
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Analytics Overview</h2>
          <p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Detailed insights and performance metrics</p>
        </div>
        <button onClick={() => refetch()} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#64748b', fontWeight: 600 }}>
          <FaSyncAlt size={14} /> Refresh
        </button>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {/* Monthly Trends */}
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,.08)', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaChartLine style={{ color: '#7c3aed' }} /> Growth Trends
          </h3>
          <div style={{ height: '300px' }}>
            <Line data={lineData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero: true } } }} />
          </div>
        </div>

        {/* Distribution */}
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,.08)', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaChartPie style={{ color: '#10b981' }} /> Content Distribution
          </h3>
          <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
            <Pie data={pieData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>
      </div>

      {/* Stats Table */}
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,.08)', border: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaChartBar style={{ color: '#3b82f6' }} /> Monthly Breakdown
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                <th style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Month</th>
                <th style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Admissions</th>
                <th style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Enquiries</th>
                <th style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Total Interaction</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((d, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#1e293b' }}>{d.month}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>{d.admissions}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>{d.enquiries}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ background: '#f0f9ff', color: '#0369a1', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>
                      {d.admissions + d.enquiries}
                    </span>
                  </td>
                </tr>
              )).reverse()}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsView;
