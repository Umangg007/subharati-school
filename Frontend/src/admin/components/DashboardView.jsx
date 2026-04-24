import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Line, Doughnut, Bar, PolarArea, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Title, Tooltip, Legend, Filler, ArcElement, RadialLinearScale, BarElement
} from 'chart.js';
import { getAdminStats } from '../api';
import { 
  FaUserGraduate, FaEnvelope, FaCalendarAlt, FaImages, 
  FaClock, FaCheckCircle, FaHistory, FaSyncAlt,
  FaChartLine, FaChartPie, FaChartBar, FaTachometerAlt
} from 'react-icons/fa';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, 
  Title, Tooltip, Legend, Filler, ArcElement, RadialLinearScale, BarElement
);

const relativeTime = (iso) => {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const diff = (new Date(iso) - Date.now()) / 1000;
  if (Math.abs(diff) < 60) return rtf.format(Math.round(diff), 'second');
  if (Math.abs(diff) < 3600) return rtf.format(Math.round(diff / 60), 'minute');
  if (Math.abs(diff) < 86400) return rtf.format(Math.round(diff / 3600), 'hour');
  return rtf.format(Math.round(diff / 86400), 'day');
};

const KPICard = ({ label, value, change, color, icon: Icon }) => (
  <motion.div
    whileHover={{ y: -4, boxShadow: '0 12px 24px -4px rgba(0,0,0,.12)' }}
    transition={{ type: 'spring', stiffness: 300 }}
    style={{ 
      background: 'white', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #e2e8f0', 
      position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '0.5rem'
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</h3>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', margin: '0.5rem 0' }}>{value}</div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981' }}>{change}</div>
      </div>
      <div style={{ padding: '0.75rem', borderRadius: '12px', background: `${color}10`, color: color, fontSize: '1.25rem' }}>
        <Icon />
      </div>
    </div>
  </motion.div>
);

const DashboardView = ({ pageVariants }) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['adminStats'],
    queryFn: getAdminStats,
    refetchInterval: 60000,
  });

  if (isLoading) return <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>Initializing Dashboard...</div>;

  if (error) return (
    <div style={{ padding: '3rem', textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
      <h3 style={{ color: '#1e293b' }}>Failed to load stats</h3>
      <p style={{ color: '#64748b' }}>{error.message}</p>
      <button style={{ marginTop: '1rem', background: '#7c3aed', color: 'white', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }} onClick={() => refetch()}>Retry</button>
    </div>
  );

  const stats = data?.data || {};
  const { totals = {}, recent = {}, monthlyData = [], latestAdmissions = [], latestEnquiries = [], admissionsByCourse = [], admissionsByStatus = [], galleryByCategory = [] } = stats;

  const metrics = [
    { label: 'Total Admissions',  value: totals.totalAdmissions || 0, change: `+${recent.recentAdmissions || 0} this week`, color: '#7c3aed', icon: FaUserGraduate },
    { label: 'Total Enquiries',   value: totals.totalEnquiries || 0,  change: `+${recent.recentEnquiries || 0} this week`, color: '#3b82f6', icon: FaEnvelope },
    { label: 'Active Events',     value: totals.totalEvents || 0,     change: 'Overall', color: '#10b981', icon: FaCalendarAlt },
    { label: 'Gallery Items',     value: totals.totalGallery || 0,    change: 'Media assets', color: '#f59e0b', icon: FaImages },
  ];

  // Chart configs
  const lineData = {
    labels: monthlyData.map(d => d.name),
    datasets: [
      { label: 'Admissions', data: monthlyData.map(d => d.admissions), borderColor: '#7c3aed', backgroundColor: 'rgba(124,58,237,0.08)', tension: 0.4, fill: true, pointRadius: 4 },
      { label: 'Enquiries', data: monthlyData.map(d => d.enquiries), borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.08)', tension: 0.4, fill: true, pointRadius: 4 }
    ],
  };

  const statusData = {
    labels: admissionsByStatus.map(s => s._id || 'Pending'),
    datasets: [{ data: admissionsByStatus.map(s => s.count), backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'], borderWidth: 0 }]
  };

  const courseData = {
    labels: admissionsByCourse.map(c => c._id || 'Unknown'),
    datasets: [{ data: admissionsByCourse.map(c => c.count), backgroundColor: ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'], borderWidth: 0 }]
  };

  const galleryData = {
    labels: galleryByCategory.map(g => g._id || 'Uncategorized'),
    datasets: [{ label: 'Count', data: galleryByCategory.map(g => g.count), backgroundColor: 'rgba(124, 58, 237, 0.7)', borderRadius: 4 }]
  };

  const commonOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, font: { size: 11, weight: '600' } } } } };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {metrics.map((m, i) => <KPICard key={i} {...m} />)}
      </div>

      {/* Main Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', minWidth: 0 }}>
          <h3 style={{ margin: '0 0 1.5rem', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaChartLine style={{ color: '#7c3aed' }} /> Growth & Engagement</h3>
          <div style={{ height: '300px' }}><Line data={lineData} options={commonOptions} /></div>
        </div>
        
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', minWidth: 0 }}>
          <h3 style={{ margin: '0 0 1.5rem', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaChartPie style={{ color: '#10b981' }} /> Admissions Pulse</h3>
          <div style={{ height: '300px' }}><Pie data={statusData} options={commonOptions} /></div>
        </div>
      </div>

      {/* Detailed Analytics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 1.5rem', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaChartBar style={{ color: '#f59e0b' }} /> Course Popularity</h3>
          <div style={{ height: '280px' }}><PolarArea data={courseData} options={commonOptions} /></div>
        </div>
        
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 1.5rem', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaImages style={{ color: '#3b82f6' }} /> Media Distribution</h3>
          <div style={{ height: '280px' }}><Bar data={galleryData} options={{ ...commonOptions, indexAxis: 'y' }} /></div>
        </div>

        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 1.5rem', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaHistory style={{ color: '#ef4444' }} /> Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '280px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {([...latestAdmissions, ...latestEnquiries]).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #f1f5f9' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#7c3aed', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0 }}>{item.name[0]}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '0.8rem', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b' }}>{item.course ? 'Admission' : 'Enquiry'}</p>
                </div>
                <span style={{ fontSize: '0.65rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>{relativeTime(item.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        <button onClick={() => refetch()} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.75rem 2rem', fontSize: '0.85rem', fontWeight: 700, color: '#7c3aed', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(124,58,237,0.1)' }}>
          <FaSyncAlt size={14} /> Refresh Dashboard
        </button>
      </div>
    </motion.div>
  );
};

export default DashboardView;
