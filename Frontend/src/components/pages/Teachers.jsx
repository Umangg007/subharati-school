import { FaUserGraduate, FaHeart, FaLightbulb, FaHandsHelping } from 'react-icons/fa';
import PageHeader from '../common/PageHeader';
import './Teachers.css';

const teacherValues = [
  {
    icon: <FaUserGraduate />,
    title: 'Qualified Mentors',
    description: 'Experienced educators trained in early-childhood pedagogy and classroom care.'
  },
  {
    icon: <FaHeart />,
    title: 'Compassionate Guidance',
    description: 'Teachers build trust with every child through warmth, patience, and encouragement.'
  },
  {
    icon: <FaLightbulb />,
    title: 'Creative Methods',
    description: 'Play-based activities, storytelling, and interactive learning make each day meaningful.'
  },
  {
    icon: <FaHandsHelping />,
    title: 'Parent Partnership',
    description: 'Regular communication keeps families connected to progress and classroom growth.'
  }
];

const Teachers = () => {
  return (
    <section className="teachers-page">
      <PageHeader
        title="Our"
        highlightWord="Teachers"
        subtitle="A caring team that inspires curiosity, confidence, and strong early learning habits."
        icon={<>TEACHING EXCELLENCE</>}
        stats={[
          { value: 'Experienced', label: 'EDUCATORS' },
          { value: 'Child-Centric', label: 'APPROACH' },
          { value: 'Interactive', label: 'LESSONS' },
          { value: 'Supportive', label: 'MENTORSHIP' }
        ]}
      />
    {/* Team Photos Section */}
    <div className="team-photos-section">
      <div className="team-photos-wrap">
        <div className="team-photo-card">
          <img 
            src="https://res.cloudinary.com/dpxk81avt/image/upload/q_auto/f_auto/v1776935217/Annual_function_16_paxc7y.jpg" 
            alt="Primary Section Teachers"
            className="team-photo-img"
          />
          <div className="team-photo-label">
            <h3>Primary Section</h3>
            <p>Our dedicated primary educators</p>
          </div>
        </div>
  
        <div className="team-photo-card">
          <img 
            src="https://res.cloudinary.com/dpxk81avt/image/upload/q_auto/f_auto/v1776935166/Annual_function_14_uka407.jpg" 
            alt="Pre-Primary Section Teachers"
            className="team-photo-img"
          />
          <div className="team-photo-label">
            <h3>Pre-Primary Section</h3>
            <p>Our caring pre-primary teachers</p>
          </div>
        </div>
      </div>
    </div>

      <div className="teachers-grid-wrap">
        <div className="teachers-grid">
          {teacherValues.map((value) => (
            <article key={value.title} className="teachers-card">
              <div className="teachers-icon">{value.icon}</div>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </article>
          ))}
        </div>
      </div>

    </section>
  );
};

export default Teachers;
