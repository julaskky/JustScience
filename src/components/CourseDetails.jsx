import { useState } from 'react';
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Code2,
  Cpu,
  Globe,
  MessageCircle,
  Monitor,
  Network,
  Sparkles,
  X,
} from 'lucide-react';

import { coursePricing } from '../data/coursePricing';
import CourseRegistration from './CourseRegistration';
import '../styles/course-details.css';

const iconMap = {
  'website-design': Monitor,
  'python-programming': Code2,
  'machine-learning': BrainCircuit,
  'artificial-intelligence': Cpu,
  'deep-learning': Network,
  'natural-language-processing': MessageCircle,
  'large-language-models': Sparkles,
};

const durations = ['1 Week', '2 Weeks', '1 Month', '3 Months'];

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

export default function CourseDetails({ course, index = 0 }) {
  const [isOpen, setIsOpen] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState('1 Month');

  const slug = course.slug;
  const details = coursePricing[slug];

  if (!details) return null;

  const Icon = iconMap[slug] || Globe;
  const price = details.prices[selectedDuration];

  function closeRegistration() {
    setRegistrationOpen(false);
    setIsOpen(false);
  }

  return (
    <>
      <article
        className="course-card"
        style={{ '--course-index': index }}
      >
        <div className="course-card-top">
          <div className="course-icon">
            <Icon size={25} />
          </div>

          <span className="course-number">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        <div className="course-card-content">
          <h3>{course.title}</h3>

          <p>
            {course.description || details.overview}
          </p>

          <div className="course-card-meta">
            <span>
              <CheckCircle2 size={14} />
              Flexible durations
            </span>

            <span>
              <CheckCircle2 size={14} />
              Practical learning
            </span>
          </div>

          <button
            type="button"
            className="course-details-trigger"
            onClick={() => setIsOpen(true)}
          >
            View course details
            <ArrowRight size={17} />
          </button>
        </div>
      </article>

      {isOpen && (
        <div
          className="course-modal-overlay"
          onClick={() => setIsOpen(false)}
        >
          <section
            className="course-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="course-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="course-modal-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close course details"
            >
              <X size={21} />
            </button>

            <div className="course-modal-heading">
              <div className="course-icon">
                <Icon size={27} />
              </div>

              <span className="course-modal-label">
                JUST SCIENCE TRAINING
              </span>

              <h2 id="course-modal-title">{course.title}</h2>

              <p>{details.overview}</p>
            </div>

            <div className="course-modal-section">
              <h3>What you will learn</h3>

              <ul className="course-outcomes">
                {details.outcomes.map((outcome, outcomeIndex) => (
                  <li key={outcomeIndex}>
                    <CheckCircle2 size={17} />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="course-modal-section">
              <h3>Entry requirements</h3>

              <p className="course-prerequisite">
                {details.prerequisites}
              </p>
            </div>

            <div className="course-pricing-panel">
              <div className="course-pricing-header">
                <div>
                  <span className="course-modal-label">
                    COURSE PRICING
                  </span>

                  <h3>Choose your duration</h3>
                </div>

                <span className="course-currency">USD</span>
              </div>

              <div className="course-duration-options">
                {durations.map((duration) => (
                  <button
                    type="button"
                    key={duration}
                    className={`course-duration-option ${
                      selectedDuration === duration ? 'active' : ''
                    }`}
                    onClick={() => setSelectedDuration(duration)}
                  >
                    {duration}
                  </button>
                ))}
              </div>

              <div className="course-selected-price">
                <div>
                  <span>Selected programme</span>
                  <strong>{selectedDuration}</strong>
                </div>

                <div className="course-price-value">
                  {formatPrice(price)}
                </div>
              </div>

              <button
                type="button"
                className="course-enrol-button"
                onClick={() => setRegistrationOpen(true)}
              >
                Register for this course
                <ArrowRight size={18} />
              </button>

              <p className="course-price-note">
                Submit your registration to express your interest
                in this training programme.
              </p>
            </div>
          </section>
        </div>
      )}

      {registrationOpen && (
        <CourseRegistration
          course={course}
          duration={selectedDuration}
          price={price}
          onClose={closeRegistration}
        />
      )}
    </>
  );
}