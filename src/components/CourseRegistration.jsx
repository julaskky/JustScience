import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  LoaderCircle,
  X,
} from 'lucide-react';

import { api } from '../services/api';
import '../styles/course-registration.css';

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

const initialForm = {
  full_name: '',
  email: '',
  phone: '',
  country: '',
  experience_level: 'Beginner',
  learning_goals: '',
  website: '',
};

export default function CourseRegistration({
  course,
  duration,
  price,
  onClose,
}) {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (submitting) return;

    setSubmitting(true);

    try {
      const result = await api.submitEnrollment({
        ...form,
        course_slug: course.slug,
        duration,
        price,
      });

      setSuccess(result);
      setForm(initialForm);
    } catch (err) {
      setError(
        err.message ||
          'Registration could not be completed. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="registration-overlay"
      onClick={onClose}
    >
      <section
        className="registration-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="registration-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="registration-close"
          onClick={onClose}
          aria-label="Close registration"
        >
          <X size={21} />
        </button>

        {success ? (
          <div className="registration-success">
            <div className="registration-success-icon">
              <CheckCircle2 size={42} />
            </div>

            <span className="registration-eyebrow">
              REGISTRATION RECEIVED
            </span>

            <h2 id="registration-title">
              Thank you for registering!
            </h2>

            <p>
              Your enrolment request has been submitted successfully.
              Our team will contact you using the email address you provided.
            </p>

            <div className="registration-reference">
              <span>YOUR REGISTRATION REFERENCE</span>
              <strong>{success.reference}</strong>
            </div>

            <div className="registration-summary">
              <div>
                <span>Course</span>
                <strong>{success.registration.course}</strong>
              </div>

              <div>
                <span>Duration</span>
                <strong>{success.registration.duration}</strong>
              </div>

              <div>
                <span>Course price</span>
                <strong>{formatPrice(success.registration.price)}</strong>
              </div>

              <div>
                <span>Status</span>
                <strong className="registration-pending">
                  Pending
                </strong>
              </div>
            </div>

            <button
              type="button"
              className="registration-submit"
              onClick={onClose}
            >
              Done
              <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <>
            <div className="registration-header">
              <span className="registration-eyebrow">
                JUST SCIENCE
              </span>

              <h2 id="registration-title">
                Course Registration
              </h2>

              <p>
                Complete the form below to submit your enrolment request.
              </p>
            </div>

            <div className="registration-course-summary">
              <div>
                <span>Selected course</span>
                <strong>{course.title}</strong>
              </div>

              <div className="registration-course-price">
                <span>{duration}</span>
                <strong>{formatPrice(price)}</strong>
              </div>
            </div>

            {error && (
              <div className="registration-error" role="alert">
                {error}
              </div>
            )}

            <form
              className="registration-form"
              onSubmit={handleSubmit}
            >
              <div className="registration-form-grid">
                <div className="registration-field registration-full">
                  <label htmlFor="registration-full-name">
                    Full name *
                  </label>

                  <input
                    id="registration-full-name"
                    type="text"
                    name="full_name"
                    placeholder="Enter your full name"
                    value={form.full_name}
                    onChange={handleChange}
                    minLength={2}
                    maxLength={150}
                    autoComplete="name"
                    required
                  />
                </div>

                <div className="registration-field">
                  <label htmlFor="registration-email">
                    Email address *
                  </label>

                  <input
                    id="registration-email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    maxLength={190}
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="registration-field">
                  <label htmlFor="registration-phone">
                    Phone number
                  </label>

                  <input
                    id="registration-phone"
                    type="tel"
                    name="phone"
                    placeholder="+27 ..."
                    value={form.phone}
                    onChange={handleChange}
                    maxLength={40}
                    autoComplete="tel"
                  />
                </div>

                <div className="registration-field registration-full">
                  <label htmlFor="registration-country">
                    Country
                  </label>

                  <input
                    id="registration-country"
                    type="text"
                    name="country"
                    placeholder="Enter your country"
                    value={form.country}
                    onChange={handleChange}
                    maxLength={100}
                    autoComplete="country-name"
                  />
                </div>

                <div className="registration-field registration-full">
                  <label htmlFor="registration-experience">
                    Current experience level
                  </label>

                  <select
                    id="registration-experience"
                    name="experience_level"
                    value={form.experience_level}
                    onChange={handleChange}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="registration-field registration-full">
                  <label htmlFor="registration-goals">
                    What would you like to achieve? (Optional)
                  </label>

                  <textarea
                    id="registration-goals"
                    name="learning_goals"
                    placeholder="Briefly describe your learning objectives..."
                    value={form.learning_goals}
                    onChange={handleChange}
                    maxLength={3000}
                    rows={4}
                  />
                </div>
              </div>

              {/* Hidden honeypot field for basic spam protection */}
              <div className="registration-honeypot" aria-hidden="true">
                <label htmlFor="registration-website">
                  Website
                </label>
                <input
                  id="registration-website"
                  type="text"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <p className="registration-privacy">
                By submitting this form, you agree that Just Science
                may use your contact information to respond to your
                course registration enquiry.
              </p>

              <div className="registration-actions">
                <button
                  type="button"
                  className="registration-back"
                  onClick={onClose}
                  disabled={submitting}
                >
                  <ArrowLeft size={17} />
                  Cancel
                </button>

                <button
                  type="submit"
                  className="registration-submit"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <LoaderCircle
                        size={18}
                        className="registration-spinner"
                      />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Registration
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </section>
    </div>
  );
}