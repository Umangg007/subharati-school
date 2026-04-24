import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaUserAlt, FaCommentDots, FaCheckCircle, FaArrowRight, FaArrowLeft, FaQuestionCircle } from 'react-icons/fa';
import PageHeader from '../common/PageHeader';
import './Enquire.css';
import { apiRequest } from '../../utils/api';

const Enquire = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    childAge: '',
    interestedIn: '',
    preferredTime: '',
    message: ''
  });
  
  const [status, setStatus] = useState({ loading: false, error: '', success: false });
  const [errors, setErrors] = useState({});

  const isEmail = (value) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(value.trim());
  const isPhone = (value) => /^[+()0-9\s-]{7,20}$/.test(value.trim());

  const validateStep = (step) => {
    const nextErrors = {};
    if (step === 1) {
      if (!formData.childAge.trim()) nextErrors.childAge = 'Child age is required';
      if (!formData.interestedIn.trim()) nextErrors.interestedIn = 'Program selection is required';
    }
    if (step === 2) {
      if (!formData.name.trim()) nextErrors.name = 'Name is required';
      if (!formData.email.trim() || !isEmail(formData.email)) nextErrors.email = 'Valid email is required';
      if (!formData.phone.trim() || !isPhone(formData.phone)) nextErrors.phone = 'Valid phone is required';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
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
    if (!validateStep(3)) return;

    setStatus({ loading: true, error: '', success: false });
    const combinedMessage = `Child Age: ${formData.childAge}\nInterested In: ${formData.interestedIn}\nPreferred Time: ${formData.preferredTime}\nMessage: ${formData.message}`;

    try {
      await apiRequest('/api/enquiries', {
        method: 'POST',
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: combinedMessage
        }
      });
      setStatus({ loading: false, error: '', success: true });
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: false });
    }
  };

  const steps = [
    { id: 1, title: "Program", icon: <FaGraduationCap /> },
    { id: 2, title: "Parent", icon: <FaUserAlt /> },
    { id: 3, title: "Details", icon: <FaCommentDots /> }
  ];

  return (
    <section className="enquire-wizard-section" style={{ padding: 0 }}>
      <PageHeader 
        title="Start Your"
        highlightWord="Journey"
        subtitle="Join the Subharati family. Tell us what you're looking for, and we'll guide you through the process of providing the best education for your child."
        icon={<><FaQuestionCircle /> ENQUIRY</>}
        stats={[
          { value: "24h", label: "RESPONSE TIME" },
          { value: "3", label: "SIMPLE STEPS" }
        ]}
      />
      <div className="section-container" style={{ paddingTop: '60px' }}>

        <div className="wizard-container">
          
          {/* Progress Bar */}
          {!status.success && (
            <div className="wizard-progress">
              {steps.map((step, index) => (
                <div key={step.id} className={`progress-step ${currentStep >= step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}>
                  <div className="step-icon">{step.icon}</div>
                  <span className="step-title">{step.title}</span>
                  {index < steps.length - 1 && <div className="step-line"></div>}
                </div>
              ))}
            </div>
          )}

          {/* Form Area */}
          <div className="wizard-form-card">
            <AnimatePresence mode="wait">
              {status.success ? (
                <motion.div 
                  key="success"
                  className="wizard-success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="success-icon-wrap">
                    <FaCheckCircle className="success-icon" />
                  </div>
                  <h2>Application Received!</h2>
                  <p>Thank you for choosing Subharati. Our admissions team will reach out to the provided contact details within 24 hours to schedule your campus visit and consultation.</p>
                  <button className="btn-primary reset-btn" onClick={() => navigate('/home')}>Return Home</button>
                </motion.div>
              ) : (
                <motion.div
                  key={`step-${currentStep}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="wizard-step-content"
                >
                  {status.error && <div className="form-error-banner">{status.error}</div>}

                  {/* STEP 1: PROGRAM */}
                  {currentStep === 1 && (
                    <div className="form-step">
                      <h3>Who are we enrolling?</h3>
                      <p className="step-desc">Let us know your child's stage so we can curate the right programs for them.</p>
                      
                      <div className="form-group slide-up">
                        <label>Child's Age or Current Grade *</label>
                        <input
                          type="text"
                          name="childAge"
                          placeholder="e.g. 4 years old, or Grade 5"
                          value={formData.childAge}
                          onChange={handleChange}
                          className={errors.childAge ? 'has-error' : ''}
                        />
                        {errors.childAge && <span className="error-text">{errors.childAge}</span>}
                      </div>

                      <div className="form-group slide-up delay-1">
                        <label>Program of Interest *</label>
                        <div className="radio-cards">
                          {['pre-primary', 'primary', 'secondary', 'higher-secondary'].map((prog) => (
                            <label key={prog} className={`radio-card ${formData.interestedIn === prog ? 'selected' : ''}`}>
                              <input 
                                type="radio" 
                                name="interestedIn" 
                                value={prog} 
                                onChange={handleChange} 
                                checked={formData.interestedIn === prog}
                              />
                              <div className="radio-content">
                                <span className="radio-title">{prog.replace('-', ' ').toUpperCase()}</span>
                              </div>
                            </label>
                          ))}
                        </div>
                        {errors.interestedIn && <span className="error-text">{errors.interestedIn}</span>}
                      </div>
                    </div>
                  )}

                  {/* STEP 2: PARENT DETAILS */}
                  {currentStep === 2 && (
                    <div className="form-step">
                      <h3>Parent / Guardian Details</h3>
                      <p className="step-desc">How can we get in touch with you?</p>

                      <div className="form-group slide-up">
                        <label>Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          placeholder="Your official name"
                          value={formData.name}
                          onChange={handleChange}
                          className={errors.name ? 'has-error' : ''}
                        />
                        {errors.name && <span className="error-text">{errors.name}</span>}
                      </div>

                      <div className="form-row slide-up delay-1">
                        <div className="form-group">
                          <label>Email Address *</label>
                          <input
                            type="email"
                            name="email"
                            placeholder="To receive prospectuses"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? 'has-error' : ''}
                          />
                          {errors.email && <span className="error-text">{errors.email}</span>}
                        </div>
                        <div className="form-group">
                          <label>Phone Number *</label>
                          <input
                            type="tel"
                            name="phone"
                            placeholder="For direct contact"
                            value={formData.phone}
                            onChange={handleChange}
                            className={errors.phone ? 'has-error' : ''}
                          />
                          {errors.phone && <span className="error-text">{errors.phone}</span>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: MESSAGE & TIME */}
                  {currentStep === 3 && (
                    <div className="form-step">
                      <h3>Final Details</h3>
                      <p className="step-desc">Help us serve you better during our consultation call.</p>

                      <div className="form-group slide-up">
                        <label>Preferred Contact Time</label>
                        <select
                          name="preferredTime"
                          value={formData.preferredTime}
                          onChange={handleChange}
                        >
                          <option value="">Anytime</option>
                          <option value="morning">Morning (9 AM - 12 PM)</option>
                          <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                          <option value="evening">Evening (4 PM - 7 PM)</option>
                        </select>
                      </div>

                      <div className="form-group slide-up delay-1">
                        <label>Any specific questions or requirements?</label>
                        <textarea
                          name="message"
                          placeholder="E.g., I'm interested in knowing more about the transport facilities..."
                          rows="5"
                          value={formData.message}
                          onChange={handleChange}
                        ></textarea>
                      </div>
                    </div>
                  )}

                  {/* Footer Actions */}
                  <div className="wizard-actions">
                    {currentStep > 1 ? (
                      <button type="button" className="action-btn btn-back" onClick={handlePrev}>
                        <FaArrowLeft /> Back
                      </button>
                    ) : <div></div>}
                    
                    {currentStep < 3 ? (
                      <button type="button" className="action-btn btn-next" onClick={handleNext}>
                        Next <FaArrowRight />
                      </button>
                    ) : (
                      <button type="button" className="action-btn btn-submit" onClick={handleSubmit} disabled={status.loading}>
                        {status.loading ? 'Submitting...' : 'Submit Form'} <FaCheckCircle />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Enquire;