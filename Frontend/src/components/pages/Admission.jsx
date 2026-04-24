import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaUserGraduate } from 'react-icons/fa';
import PageHeader from '../common/PageHeader';
import './Admission.css';
import { apiRequest } from '../../utils/api';

const Admission = () => {
  const [formData, setFormData] = useState({
    childName: '',
    parentName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    previousSchool: '',
    grade: ''
  });
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });
  const [errors, setErrors] = useState({});

  const isEmail = (value) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(value.trim());
  const isPhone = (value) => /^[+()0-9\s-]{7,20}$/.test(value.trim());

  const validate = () => {
    const nextErrors = {};
    if (!formData.childName.trim()) {
      nextErrors.childName = 'Child name is required';
    }
    if (!formData.parentName.trim()) {
      nextErrors.parentName = 'Parent name is required';
    }
    if (!formData.email.trim() || !isEmail(formData.email)) {
      nextErrors.email = 'Valid email is required';
    }
    if (!formData.phone.trim() || !isPhone(formData.phone)) {
      nextErrors.phone = 'Phone number is required';
    }
    if (!formData.dateOfBirth.trim()) {
      nextErrors.dateOfBirth = 'Date of birth is required';
    }
    if (!formData.address.trim()) {
      nextErrors.address = 'Address is required';
    }
    if (!formData.grade.trim()) {
      nextErrors.grade = 'Grade is required';
    }
    if (!formData.previousSchool.trim()) {
      nextErrors.previousSchool = 'Previous school is required';
    } else if (formData.previousSchool.trim().length > 200) {
      nextErrors.previousSchool = 'Previous school is too long';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (e) => {
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    }
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    setStatus({ loading: true, error: '', success: '' });

    const details = [
      `Child Name: ${formData.childName}`,
      `Parent Name: ${formData.parentName}`,
      `Date of Birth: ${formData.dateOfBirth}`,
      `Address: ${formData.address}`,
      `Previous School: ${formData.previousSchool}`
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await apiRequest('/api/admissions', {
        method: 'POST',
        body: {
          name: formData.parentName,
          email: formData.email,
          phone: formData.phone,
          course: formData.grade,
          details
        }
      });
      setStatus({ loading: false, error: '', success: 'Thank you for your admission inquiry! We will contact you soon.' });
      setFormData({
        childName: '',
        parentName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        address: '',
        previousSchool: '',
        grade: ''
      });
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: '' });
    }
  };

  return (
    <section className="admission" style={{ padding: 0 }}>
      <PageHeader
        title="Start Your Child's"
        highlightWord="Journey"
        subtitle="Join a community where every child's potential is nurtured with care and excellence. We are currently accepting admissions for all sections."
        icon={<><FaUserGraduate /> ADMISSION</>}
        stats={[
          { value: '100%', label: 'PLACEMENT' },
          { value: '04', label: 'SIMPLE STEPS' }
        ]}
      />
      <div className="section-container" style={{ paddingTop: '60px' }}>

        <div className="admission-content">
          <motion.div
            className="admission-info"
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Admission Process</h2>
            <div className="process-steps">
              <div className="step">
                <div className="step-number">01</div>
                <div className="step-content">
                  <h3>Online/Physical Inquiry</h3>
                  <p>Express your interest through our digital form or visit our campus office.</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">02</div>
                <div className="step-content">
                  <h3>Campus Tour</h3>
                  <p>Personalize your experience with a guided tour of our modern facilities.</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">03</div>
                <div className="step-content">
                  <h3>Interactive Session</h3>
                  <p>A friendly meeting with our educators to understand your child's personality.</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">04</div>
                <div className="step-content">
                  <h3>Document Submission</h3>
                  <p>Complete the enrollment with the necessary documentation and fees.</p>
                </div>
              </div>
            </div>

            <div className="requirements">
              <h3>Required Documentation</h3>
              <ul>
                <li>Original Birth Certificate</li>
                <li>Recent Passport Size Photographs (6)</li>
                <li>Residential Address Proof</li>
                <li>Previous Academic Records (if applicable)</li>
                <li>Aadhar Card Copy (Parent & Child)</li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            className="admission-form"
            initial={{ x: 30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Inquiry Form</h2>
            <form onSubmit={handleSubmit}>
              {status.error && <p className="form-error">{status.error}</p>}
              {status.success && <p className="form-success">{status.success}</p>}

              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    name="childName"
                    placeholder="Child's Full Name"
                    value={formData.childName}
                    onChange={handleChange}
                    required
                  />
                  {errors.childName && <p className="field-error-text">{errors.childName}</p>}
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="parentName"
                    placeholder="Parent's name"
                    value={formData.parentName}
                    onChange={handleChange}
                    required
                  />
                  {errors.parentName && <p className="field-error-text">{errors.parentName}</p>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && <p className="field-error-text">{errors.email}</p>}
                </div>

                <div className="form-group">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Primary Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                  {errors.phone && <p className="field-error-text">{errors.phone}</p>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    name="dateOfBirth"
                    placeholder="Date of Birth"
                    onFocus={(e) => (e.target.type = 'date')}
                    onBlur={(e) => (e.target.type = 'text')}
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                  />
                  {errors.dateOfBirth && <p className="field-error-text">{errors.dateOfBirth}</p>}
                </div>

                <div className="form-group">
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seeking Admission For</option>
                    <optgroup label="Pre-Primary">
                      <option value="nursery">Nursery</option>
                      <option value="lkg">LKG</option>
                      <option value="ukg">UKG</option>
                    </optgroup>
                    <optgroup label="Primary & Secondary">
                      <option value="1st-10th">1st to 10th Standard</option>
                      <option value="higher-secondary">Higher Secondary</option>
                    </optgroup>
                  </select>
                  {errors.grade && <p className="field-error-text">{errors.grade}</p>}
                </div>
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="address"
                  placeholder="Complete Residential Address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="previousSchool"
                  placeholder="Previous School Name (if applicable)"
                  value={formData.previousSchool}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={status.loading}
              >
                {status.loading ? 'Processing...' : 'Submit Admission Inquiry'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Admission;
