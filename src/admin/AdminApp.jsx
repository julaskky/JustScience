import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Edit3,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Mail,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  User,
  Users,
  X,
} from 'lucide-react';

import { adminApi } from './adminApi';
import './course-management.css';

const STATUSES = ['pending', 'contacted', 'confirmed', 'cancelled'];

const DURATION_OPTIONS = ['1 Week', '2 Weeks', '1 Month', '3 Months'];

const emptyFilters = {
  search: '',
  status: '',
  course: '',
  date_from: '',
  date_to: '',
  page: 1,
  per_page: 10,
};

const emptyCourse = {
  id: null,
  slug: '',
  title: '',
  description: '',
  overview: '',
  prerequisites: '',
  outcomes: [],
  durations: {},
  sort_order: 0,
};

function formatDate(value) {
  if (!value) return '—';

  const date = new Date(value.replace(' ', 'T'));

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function money(value) {
  const amount = Number(value || 0);

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(amount);
}

function StatusBadge({ status }) {
  return (
    <span className={`status-badge status-${status || 'pending'}`}>
      <span className="status-dot" />
      {status || 'pending'}
    </span>
  );
}

function StatCard({ label, value, icon: Icon, tone }) {
  return (
    <div className="admin-stat-card">
      <div className={`admin-stat-icon ${tone}`}>
        <Icon size={19} />
      </div>
      <div>
        <p>{label}</p>
        <strong>{value ?? 0}</strong>
      </div>
    </div>
  );
}

function LoginScreen({ onLogin, loading, error }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function submit(event) {
    event.preventDefault();
    onLogin(email, password);
  }

  return (
    <div className="admin-login-page">
      <section className="admin-login-decoration">
        <div className="login-brand">
          <div className="login-brand-mark">
            <GraduationCap size={23} />
          </div>
          JUST SCIENCE
        </div>

        <div className="login-message">
          <span className="admin-eyebrow">ADMINISTRATOR WORKSPACE</span>
          <h1>Manage learning. Shape the future.</h1>
          <p>
            Access your secure administration workspace to manage course
            enrolments, training programmes and learning content.
          </p>
        </div>

        <div className="login-decoration-footer">
          <ShieldCheck size={16} />
          Secure administrator access
        </div>

        <div className="login-orbit login-orbit-one" />
        <div className="login-orbit login-orbit-two" />
      </section>

      <section className="admin-login-panel">
        <form className="admin-login-form" onSubmit={submit}>
          <div className="login-mobile-brand">
            <GraduationCap size={25} />
            JUST SCIENCE
          </div>

          <span className="admin-eyebrow">WELCOME BACK</span>
          <h2>Administrator login</h2>
          <p className="login-description">
            Sign in with your administrator credentials to continue.
          </p>

          {error && (
            <div className="admin-alert admin-alert-error">
              <X size={17} />
              {error}
            </div>
          )}

          <label htmlFor="admin-email">Email address</label>
          <div className="admin-input-wrap">
            <Mail size={17} />
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              placeholder="admin@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <label htmlFor="admin-password">Password</label>
          <div className="admin-input-wrap">
            <ShieldCheck size={17} />
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <button
            className="admin-primary-button admin-login-button"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="admin-inline-loader" />
                Signing in...
              </>
            ) : (
              <>
                Sign in
                <ArrowRight size={17} />
              </>
            )}
          </button>

          <div className="login-security-note">
            <ShieldCheck size={15} />
            Protected administrator session
          </div>
        </form>
      </section>
    </div>
  );
}

function EnrollmentDetails({
  enrollment,
  onClose,
  onStatusChange,
  updating,
}) {
  return (
    <div className="admin-modal-overlay" onMouseDown={onClose}>
      <section
        className="admin-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="admin-modal-header">
          <div>
            <span className="admin-eyebrow">REGISTRATION DETAILS</span>
            <h2>{enrollment.full_name}</h2>
          </div>
          <button
            type="button"
            className="admin-icon-button"
            onClick={onClose}
            aria-label="Close details"
          >
            <X size={18} />
          </button>
        </div>

        <div className="admin-reference-panel">
          <span>Registration reference</span>
          <strong>{enrollment.enrollment_reference}</strong>
          <StatusBadge status={enrollment.status} />
        </div>

        <div className="admin-detail-grid">
          <div className="admin-detail-item">
            <span>Full name</span>
            <strong>{enrollment.full_name}</strong>
          </div>
          <div className="admin-detail-item">
            <span>Email address</span>
            <strong>{enrollment.email}</strong>
          </div>
          <div className="admin-detail-item">
            <span>Phone number</span>
            <strong>{enrollment.phone}</strong>
          </div>
          <div className="admin-detail-item">
            <span>Country</span>
            <strong>{enrollment.country}</strong>
          </div>
          <div className="admin-detail-item">
            <span>Course</span>
            <strong>{enrollment.course_title}</strong>
          </div>
          <div className="admin-detail-item">
            <span>Duration</span>
            <strong>{enrollment.duration}</strong>
          </div>
          <div className="admin-detail-item">
            <span>Course fee</span>
            <strong>{money(enrollment.price_usd)}</strong>
          </div>
          <div className="admin-detail-item">
            <span>Experience level</span>
            <strong>{enrollment.experience_level || '—'}</strong>
          </div>
          <div className="admin-detail-item">
            <span>Registration date</span>
            <strong>{formatDate(enrollment.submitted_at)}</strong>
          </div>
        </div>

        <div className="admin-goals-panel">
          <span>Learning goals</span>
          <p>{enrollment.learning_goals || 'No learning goals provided.'}</p>
        </div>

        <div className="admin-modal-status">
          <label htmlFor="enrollment-status">Update registration status</label>
          <select
            id="enrollment-status"
            value={enrollment.status}
            onChange={(event) => onStatusChange(event.target.value)}
            disabled={updating}
          >
            {STATUSES.map((status) => (
              <option value={status} key={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </section>
    </div>
  );
}

function CourseStatusBadge({ active }) {
  return (
    <span className={`course-status-badge ${active ? 'published' : 'unpublished'}`}>
      <span />
      {active ? 'Published' : 'Unpublished'}
    </span>
  );
}

function CourseEditor({ course, onClose, onSave, saving, error }) {
  const [form, setForm] = useState(() => ({
    ...emptyCourse,
    ...course,
    outcomes: Array.isArray(course?.outcomes) ? course.outcomes : [],
    durations: course?.durations && typeof course.durations === 'object'
      ? { ...course.durations }
      : {},
  }));

  const [newDuration, setNewDuration] = useState('');

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updatePrice(duration, value) {
    setForm((current) => ({
      ...current,
      durations: {
        ...current.durations,
        [duration]: value,
      },
    }));
  }

  function addDuration() {
    if (!newDuration || Object.prototype.hasOwnProperty.call(form.durations, newDuration)) {
      return;
    }

    setForm((current) => ({
      ...current,
      durations: {
        ...current.durations,
        [newDuration]: '',
      },
    }));

    setNewDuration('');
  }

  function removeDuration(duration) {
    setForm((current) => {
      const durations = { ...current.durations };
      delete durations[duration];

      return { ...current, durations };
    });
  }

  function updateOutcome(index, value) {
    setForm((current) => ({
      ...current,
      outcomes: current.outcomes.map((outcome, outcomeIndex) =>
        outcomeIndex === index ? value : outcome
      ),
    }));
  }

  function addOutcome() {
    setForm((current) => ({
      ...current,
      outcomes: [...current.outcomes, ''],
    }));
  }

  function removeOutcome(index) {
    setForm((current) => ({
      ...current,
      outcomes: current.outcomes.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function submit(event) {
    event.preventDefault();

    const cleanOutcomes = form.outcomes
      .map((outcome) => outcome.trim())
      .filter(Boolean);

    const cleanDurations = {};

    Object.entries(form.durations).forEach(([duration, price]) => {
      if (String(price).trim() !== '') {
        cleanDurations[duration] = Number(price);
      }
    });

    onSave({
      id: form.id || null,
      slug: form.slug.trim().toLowerCase(),
      title: form.title.trim(),
      description: form.description.trim(),
      overview: form.overview.trim(),
      prerequisites: form.prerequisites.trim(),
      outcomes: cleanOutcomes,
      durations: cleanDurations,
      sort_order: Number(form.sort_order) || 0,
    });
  }

  const availableDurations = DURATION_OPTIONS.filter(
    (duration) => !Object.prototype.hasOwnProperty.call(form.durations, duration)
  );

  return (
    <div className="admin-modal-overlay course-editor-overlay" onMouseDown={onClose}>
      <section
        className="admin-modal course-editor-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="admin-modal-header">
          <div>
            <span className="admin-eyebrow">
              {form.id ? 'EDIT TRAINING COURSE' : 'CREATE TRAINING COURSE'}
            </span>
            <h2>{form.id ? 'Update course information' : 'Add a new course'}</h2>
          </div>

          <button
            type="button"
            className="admin-icon-button"
            onClick={onClose}
            aria-label="Close course editor"
          >
            <X size={18} />
          </button>
        </div>

        <form className="course-editor-form" onSubmit={submit}>
          {error && (
            <div className="admin-alert admin-alert-error">
              <X size={17} />
              {error}
            </div>
          )}

          <div className="course-form-grid">
            <label className="course-form-field">
              Course title *
              <input
                value={form.title}
                onChange={(event) => updateField('title', event.target.value)}
                placeholder="e.g. Python Programming"
                required
                maxLength={200}
              />
            </label>

            <label className="course-form-field">
              Course slug *
              <input
                value={form.slug}
                onChange={(event) => updateField('slug', event.target.value)}
                placeholder="e.g. python-programming"
                required
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                title="Use lowercase letters, numbers and hyphens only."
                maxLength={150}
              />
              <small>Use lowercase letters and hyphens, e.g. python-programming.</small>
            </label>
          </div>

          <label className="course-form-field">
            Short description *
            <textarea
              value={form.description}
              onChange={(event) => updateField('description', event.target.value)}
              placeholder="A short description displayed on the course card."
              rows={3}
              required
            />
          </label>

          <label className="course-form-field">
            Course overview
            <textarea
              value={form.overview}
              onChange={(event) => updateField('overview', event.target.value)}
              placeholder="Explain what the course covers."
              rows={4}
            />
          </label>

          <label className="course-form-field">
            Prerequisites
            <textarea
              value={form.prerequisites}
              onChange={(event) => updateField('prerequisites', event.target.value)}
              placeholder="Describe any prior knowledge or requirements."
              rows={3}
            />
          </label>

          <div className="course-editor-section">
            <div className="course-editor-section-heading">
              <div>
                <h3>Learning outcomes</h3>
                <p>List what participants should be able to do after the course.</p>
              </div>
              <button type="button" className="course-small-button" onClick={addOutcome}>
                <Plus size={15} />
                Add outcome
              </button>
            </div>

            {form.outcomes.length === 0 && (
              <p className="course-empty-inline">No learning outcomes added yet.</p>
            )}

            {form.outcomes.map((outcome, index) => (
              <div className="course-outcome-row" key={index}>
                <span>{index + 1}</span>
                <input
                  value={outcome}
                  onChange={(event) => updateOutcome(index, event.target.value)}
                  placeholder={`Learning outcome ${index + 1}`}
                />
                <button
                  type="button"
                  className="course-remove-button"
                  onClick={() => removeOutcome(index)}
                  aria-label="Remove learning outcome"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="course-editor-section">
            <div className="course-editor-section-heading">
              <div>
                <h3>Durations and pricing</h3>
                <p>Set the available course durations and their fees in USD.</p>
              </div>
            </div>

            <div className="course-duration-list">
              {Object.entries(form.durations).map(([duration, price]) => (
                <div className="course-duration-row" key={duration}>
                  <div>
                    <strong>{duration}</strong>
                    <small>Course duration</small>
                  </div>

                  <label>
                    <span>USD</span>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={price}
                      onChange={(event) => updatePrice(duration, event.target.value)}
                      required
                    />
                  </label>

                  <button
                    type="button"
                    className="course-remove-button"
                    onClick={() => removeDuration(duration)}
                    aria-label={`Remove ${duration}`}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="course-add-duration">
              <select
                value={newDuration}
                onChange={(event) => setNewDuration(event.target.value)}
                aria-label="Choose a duration to add"
              >
                <option value="">Select a duration</option>
                {availableDurations.map((duration) => (
                  <option value={duration} key={duration}>
                    {duration}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="course-small-button"
                onClick={addDuration}
                disabled={!newDuration}
              >
                <Plus size={15} />
                Add duration
              </button>
            </div>

            {Object.keys(form.durations).length === 0 && (
              <p className="course-form-warning">
                Add at least one duration and price before saving.
              </p>
            )}
          </div>

          <label className="course-form-field course-sort-field">
            Display order
            <input
              type="number"
              min="0"
              step="1"
              value={form.sort_order}
              onChange={(event) => updateField('sort_order', event.target.value)}
            />
            <small>Lower numbers appear earlier on the public course listing.</small>
          </label>

          <div className="course-editor-actions">
            <button
              type="button"
              className="course-secondary-button"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="admin-primary-button"
              disabled={saving || Object.keys(form.durations).length === 0}
            >
              {saving ? (
                <>
                  <span className="admin-inline-loader" />
                  Saving course...
                </>
              ) : (
                <>
                  <CheckCircle2 size={17} />
                  Save course
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default function AdminApp() {
  const [initializing, setInitializing] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [activePage, setActivePage] = useState('dashboard');

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    contacted: 0,
    confirmed: 0,
    cancelled: 0,
  });

  const [enrollments, setEnrollments] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total_records: 0,
    total_pages: 1,
  });

  const [filters, setFilters] = useState({ ...emptyFilters });
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [pageError, setPageError] = useState('');
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [notice, setNotice] = useState('');

  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [courseError, setCourseError] = useState('');
  const [courseSearch, setCourseSearch] = useState('');
  const [courseStatusFilter, setCourseStatusFilter] = useState('all');
  const [courseEditorOpen, setCourseEditorOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [savingCourse, setSavingCourse] = useState(false);
  const [courseSaveError, setCourseSaveError] = useState('');
  const [changingCourseStatus, setChangingCourseStatus] = useState(null);

  const loadEnrollments = useCallback(async (nextFilters = filters) => {
    setLoadingRecords(true);
    setPageError('');

    try {
      const response = await adminApi.getEnrollments(nextFilters);

      setEnrollments(response.data || []);
      setStats(response.stats || {
        total: 0,
        pending: 0,
        contacted: 0,
        confirmed: 0,
        cancelled: 0,
      });
      setPagination(response.pagination || {
        page: 1,
        per_page: 10,
        total_records: 0,
        total_pages: 1,
      });
    } catch (error) {
      setPageError(error.message || 'Unable to load enrolments.');
    } finally {
      setLoadingRecords(false);
    }
  }, [filters]);

  const loadCourses = useCallback(async () => {
    setLoadingCourses(true);
    setCourseError('');

    try {
      const response = await adminApi.getCourses();
      setCourses(response.data || []);
    } catch (error) {
      setCourseError(error.message || 'Unable to load courses.');
    } finally {
      setLoadingCourses(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        await adminApi.getCsrfToken();
        const session = await adminApi.getSession();

        if (!mounted) return;

        if (session.authenticated) {
          setAdmin(session.admin);
          setAuthenticated(true);
        }
      } catch {
        if (mounted) setAuthenticated(false);
      } finally {
        if (mounted) setInitializing(false);
      }
    }

    initialize();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (authenticated) {
      loadEnrollments(filters);
    }
  }, [authenticated, filters, loadEnrollments]);

  useEffect(() => {
  if (authenticated) {
    loadCourses();
  }
}, [authenticated, loadCourses]);

  async function handleLogin(email, password) {
    setLoginLoading(true);
    setLoginError('');

    try {
      await adminApi.login(email, password);
      const session = await adminApi.getSession();

      setAdmin(session.admin);
      setAuthenticated(true);
      setActivePage('dashboard');
      setFilters({ ...emptyFilters });
    } catch (error) {
      setLoginError(error.message || 'Unable to sign in.');
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await adminApi.logout();
    } catch {
      // The local interface is reset even if the server session has expired.
    }

    setAuthenticated(false);
    setAdmin(null);
    setEnrollments([]);
    setCourses([]);
    setSelectedEnrollment(null);
    setLoginError('');
    setNotice('');
    setActivePage('dashboard');
    setFilters({ ...emptyFilters });

    try {
      await adminApi.getCsrfToken();
    } catch {
      // A fresh token will be requested when the login screen is used again.
    }
  }

  function updateFilter(field, value) {
    setFilters((current) => ({
      ...current,
      [field]: value,
      page: 1,
    }));
  }

  async function openEnrollment(id) {
    setPageError('');

    try {
      const response = await adminApi.getEnrollment(id);
      setSelectedEnrollment(response.data);
    } catch (error) {
      setPageError(error.message || 'Unable to load registration details.');
    }
  }

  async function handleStatusChange(status) {
    if (!selectedEnrollment) return;

    setUpdatingStatus(true);

    try {
      await adminApi.updateStatus(selectedEnrollment.id, status);

      setSelectedEnrollment((current) => ({
        ...current,
        status,
      }));

      setNotice('Registration status updated successfully.');
      await loadEnrollments(filters);
    } catch (error) {
      setPageError(error.message || 'Unable to update registration status.');
    } finally {
      setUpdatingStatus(false);
    }
  }

  async function handleSaveCourse(courseData) {
    setSavingCourse(true);
    setCourseSaveError('');

    try {
      await adminApi.saveCourse(courseData);
      setCourseEditorOpen(false);
      setEditingCourse(null);
      setNotice(
        courseData.id
          ? 'Course updated successfully.'
          : 'Course created successfully. It is currently unpublished.'
      );
      await loadCourses();
    } catch (error) {
      setCourseSaveError(error.message || 'Unable to save this course.');
    } finally {
      setSavingCourse(false);
    }
  }

  async function handleCourseStatus(course) {
    const nextStatus = Number(course.is_active) !== 1;

    setChangingCourseStatus(course.id);
    setCourseError('');

    try {
      await adminApi.updateCourseStatus(course.id, nextStatus);
      setNotice(
        nextStatus
          ? `${course.title} has been published.`
          : `${course.title} has been unpublished.`
      );
      await loadCourses();
    } catch (error) {
      setCourseError(error.message || 'Unable to update course publication status.');
    } finally {
      setChangingCourseStatus(null);
    }
  }

  function openNewCourse() {
    setEditingCourse({ ...emptyCourse });
    setCourseSaveError('');
    setCourseEditorOpen(true);
  }

  function openEditCourse(course) {
    setEditingCourse(course);
    setCourseSaveError('');
    setCourseEditorOpen(true);
  }

  const filteredCourses = useMemo(() => {
    const query = courseSearch.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesSearch = !query
        || String(course.title || '').toLowerCase().includes(query)
        || String(course.slug || '').toLowerCase().includes(query)
        || String(course.description || '').toLowerCase().includes(query);

      const isPublished = Number(course.is_active) === 1;

      const matchesStatus = courseStatusFilter === 'all'
        || (courseStatusFilter === 'published' && isPublished)
        || (courseStatusFilter === 'unpublished' && !isPublished);

      return matchesSearch && matchesStatus;
    });
  }, [courses, courseSearch, courseStatusFilter]);

  const publishedCount = courses.filter(
    (course) => Number(course.is_active) === 1
  ).length;

  const unpublishedCount = courses.length - publishedCount;

  if (initializing) {
    return (
      <div className="admin-loading-screen">
        <span className="admin-loader" />
        Checking administrator session...
      </div>
    );
  }

  if (!authenticated) {
    return (
      <LoginScreen
        onLogin={handleLogin}
        loading={loginLoading}
        error={loginError}
      />
    );
  }

  const pageTitle = activePage === 'courses'
    ? 'Course management'
    : activePage === 'enrollments'
      ? 'Course enrolments'
      : 'Enrolment dashboard';

  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <a href="/" className="admin-sidebar-brand">
          <div className="admin-brand-icon">
            <GraduationCap size={23} />
          </div>
          <span>
            <strong>JUST SCIENCE</strong>
            <small>ADMIN WORKSPACE</small>
          </span>
        </a>

        <div className="admin-sidebar-section">
          <span className="admin-sidebar-label">WORKSPACE</span>

          <button
            type="button"
            className={`admin-sidebar-link ${activePage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActivePage('dashboard')}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button
            type="button"
            className={`admin-sidebar-link ${activePage === 'enrollments' ? 'active' : ''}`}
            onClick={() => setActivePage('enrollments')}
          >
            <Users size={18} />
            Course enrolments
          </button>

          <button
            type="button"
            className={`admin-sidebar-link ${activePage === 'courses' ? 'active' : ''}`}
            onClick={() => setActivePage('courses')}
          >
            <BookOpen size={18} />
            Course management
          </button>
        </div>

        <div className="admin-sidebar-bottom">
          <div className="admin-sidebar-user">
            <div className="admin-avatar">
              {(admin?.full_name || admin?.name || 'A').charAt(0).toUpperCase()}
            </div>
            <div className="admin-user-info">
              <strong>{admin?.full_name || admin?.name || 'Administrator'}</strong>
              <span>{admin?.email || 'Administrator account'}</span>
            </div>
          </div>

          <button
            type="button"
            className="admin-logout-button"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="admin-topbar-caption">JUST SCIENCE / WORKSPACE</span>
            <h1>{pageTitle}</h1>
          </div>

          <div className="admin-topbar-right">
            <span className="admin-secure-label">
              <ShieldCheck size={15} />
              Secure session
            </span>

            <button
              type="button"
              className="admin-icon-button"
              onClick={() => {
                if (activePage === 'courses') loadCourses();
                else loadEnrollments(filters);
              }}
              aria-label="Refresh current page"
              title="Refresh"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </header>

        <section className="admin-content">
          <div className="admin-welcome-row">
            <div>
              <h2>
                {activePage === 'courses'
                  ? 'Manage your training programmes'
                  : activePage === 'enrollments'
                    ? 'Manage course registrations'
                    : `Welcome back, ${(admin?.full_name || admin?.name || 'Administrator').split(' ')[0]}`}
              </h2>
              <p>
                {activePage === 'courses'
                  ? 'Create courses, update learning content, manage prices and control publication.'
                  : activePage === 'enrollments'
                    ? 'Review registrations, search for students and update enrolment status.'
                    : 'Here is an overview of your course registrations and training activity.'}
              </p>
            </div>

            <div className="admin-date-label">
              <CalendarDays size={15} />
              {new Intl.DateTimeFormat('en', {
                weekday: 'short',
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              }).format(new Date())}
            </div>
          </div>

          {notice && (
            <div className="admin-alert admin-alert-success">
              <CheckCircle2 size={17} />
              {notice}
              <button type="button" onClick={() => setNotice('')}>
                <X size={16} />
              </button>
            </div>
          )}

          {activePage !== 'courses' ? (
            <>
              {pageError && (
                <div className="admin-alert admin-alert-error">
                  <X size={17} />
                  {pageError}
                  <button type="button" onClick={() => setPageError('')}>
                    <X size={16} />
                  </button>
                </div>
              )}

              <div className="admin-stats-grid">
                <StatCard label="Total registrations" value={stats.total} icon={Users} tone="stat-blue" />
                <StatCard label="Pending" value={stats.pending} icon={Clock3} tone="stat-orange" />
                <StatCard label="Contacted" value={stats.contacted} icon={Activity} tone="stat-purple" />
                <StatCard label="Confirmed" value={stats.confirmed} icon={CheckCircle2} tone="stat-green" />
                <StatCard label="Cancelled" value={stats.cancelled} icon={X} tone="stat-red" />
              </div>

              <section className="admin-records-card">
                <div className="admin-records-heading">
                  <div>
                    <span className="admin-eyebrow">REGISTRATION MANAGEMENT</span>
                    <h2>Course enrolments</h2>
                    <p>Review registrations and manage their current status.</p>
                  </div>
                  <span className="admin-record-count">
                    {pagination.total_records} records
                  </span>
                </div>

                <div className="admin-filters">
                  <div className="admin-search-field">
                    <Search size={18} />
                    <input
                      type="search"
                      placeholder="Search name, email, reference or course..."
                      value={filters.search}
                      onChange={(event) => updateFilter('search', event.target.value)}
                    />
                  </div>

                  <select
                    value={filters.status}
                    onChange={(event) => updateFilter('status', event.target.value)}
                    aria-label="Filter by status"
                  >
                    <option value="">All statuses</option>
                    {STATUSES.map((status) => (
                      <option value={status} key={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>

                  <select
                    value={filters.course}
                    onChange={(event) => updateFilter('course', event.target.value)}
                    aria-label="Filter by course"
                  >
                    <option value="">All courses</option>
                    {courses.map((course) => (
                      <option value={course.slug} key={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-date-filters">
                  <label>
                    From
                    <input
                      type="date"
                      value={filters.date_from}
                      onChange={(event) => updateFilter('date_from', event.target.value)}
                    />
                  </label>
                  <label>
                    To
                    <input
                      type="date"
                      value={filters.date_to}
                      onChange={(event) => updateFilter('date_to', event.target.value)}
                    />
                  </label>
                  <button
                    type="button"
                    className="admin-reset-button"
                    onClick={() => setFilters({ ...emptyFilters })}
                  >
                    Reset filters
                  </button>
                </div>

                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>STUDENT</th>
                        <th>COURSE</th>
                        <th>DURATION</th>
                        <th>FEE</th>
                        <th>REGISTERED</th>
                        <th>STATUS</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {loadingRecords ? (
                        <tr>
                          <td colSpan="7" className="admin-table-message">
                            <span className="admin-inline-loader" />
                            Loading enrolments...
                          </td>
                        </tr>
                      ) : enrollments.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="admin-table-message">
                            <BookOpen size={25} />
                            <strong>No registrations found</strong>
                            <span>Try changing your search or filters.</span>
                          </td>
                        </tr>
                      ) : (
                        enrollments.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <div className="admin-student-cell">
                                <div className="admin-student-avatar">
                                  {(item.full_name || '?').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <strong>{item.full_name}</strong>
                                  <span>{item.email}</span>
                                  <small>{item.enrollment_reference}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <strong className="admin-course-name">{item.course_title}</strong>
                            </td>
                            <td>{item.duration}</td>
                            <td className="admin-fee">{money(item.price_usd)}</td>
                            <td>{formatDate(item.submitted_at)}</td>
                            <td><StatusBadge status={item.status} /></td>
                            <td>
                              <button
                                type="button"
                                className="admin-view-button"
                                onClick={() => openEnrollment(item.id)}
                              >
                                View <ArrowRight size={15} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="admin-pagination">
                  <span>
                    Showing {enrollments.length
                      ? ((pagination.page - 1) * pagination.per_page) + 1
                      : 0}
                    {' '}to{' '}
                    {Math.min(
                      pagination.page * pagination.per_page,
                      pagination.total_records
                    )}
                    {' '}of {pagination.total_records} registrations
                  </span>

                  <div className="admin-pagination-controls">
                    <button
                      type="button"
                      disabled={pagination.page <= 1 || loadingRecords}
                      onClick={() => setFilters((current) => ({
                        ...current,
                        page: current.page - 1,
                      }))}
                    >
                      <ArrowLeft size={16} />
                      Previous
                    </button>
                    <span>
                      Page {pagination.page} of {pagination.total_pages}
                    </span>
                    <button
                      type="button"
                      disabled={pagination.page >= pagination.total_pages || loadingRecords}
                      onClick={() => setFilters((current) => ({
                        ...current,
                        page: current.page + 1,
                      }))}
                    >
                      Next
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </section>
            </>
          ) : (
            <section className="course-management">
              {courseError && (
                <div className="admin-alert admin-alert-error">
                  <X size={17} />
                  {courseError}
                  <button type="button" onClick={() => setCourseError('')}>
                    <X size={16} />
                  </button>
                </div>
              )}

              <div className="course-management-stats">
                <div className="course-management-stat">
                  <div className="course-management-stat-icon blue">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <span>Total courses</span>
                    <strong>{courses.length}</strong>
                  </div>
                </div>

                <div className="course-management-stat">
                  <div className="course-management-stat-icon green">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <span>Published</span>
                    <strong>{publishedCount}</strong>
                  </div>
                </div>

                <div className="course-management-stat">
                  <div className="course-management-stat-icon orange">
                    <Clock3 size={20} />
                  </div>
                  <div>
                    <span>Unpublished</span>
                    <strong>{unpublishedCount}</strong>
                  </div>
                </div>
              </div>

              <section className="admin-records-card course-list-card">
                <div className="course-list-heading">
                  <div>
                    <span className="admin-eyebrow">TRAINING CATALOGUE</span>
                    <h2>All training courses</h2>
                    <p>
                      Manage course content, pricing, durations and publication status.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="admin-primary-button course-add-button"
                    onClick={openNewCourse}
                  >
                    <Plus size={17} />
                    Add new course
                  </button>
                </div>

                <div className="course-list-toolbar">
                  <div className="admin-search-field">
                    <Search size={18} />
                    <input
                      type="search"
                      placeholder="Search by course title, slug or description..."
                      value={courseSearch}
                      onChange={(event) => setCourseSearch(event.target.value)}
                    />
                  </div>

                  <select
                    value={courseStatusFilter}
                    onChange={(event) => setCourseStatusFilter(event.target.value)}
                    aria-label="Filter courses by publication status"
                  >
                    <option value="all">All courses</option>
                    <option value="published">Published</option>
                    <option value="unpublished">Unpublished</option>
                  </select>
                </div>

                <div className="course-management-table-wrap">
                  <table className="course-management-table">
                    <thead>
                      <tr>
                        <th>COURSE</th>
                        <th>DURATIONS / PRICING</th>
                        <th>STATUS</th>
                        <th>LAST UPDATED</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingCourses ? (
                        <tr>
                          <td colSpan="5" className="course-table-message">
                            <span className="admin-inline-loader" />
                            Loading courses...
                          </td>
                        </tr>
                      ) : filteredCourses.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="course-table-message">
                            <BookOpen size={27} />
                            <strong>No courses found</strong>
                            <span>Try another search or add a new course.</span>
                          </td>
                        </tr>
                      ) : (
                        filteredCourses.map((course) => (
                          <tr key={course.id}>
                            <td>
                              <div className="course-table-title">
                                <div className="course-table-icon">
                                  <GraduationCap size={19} />
                                </div>
                                <div>
                                  <strong>{course.title}</strong>
                                  <span>{course.slug}</span>
                                  <small>
                                    {course.description || 'No short description provided.'}
                                  </small>
                                </div>
                              </div>
                            </td>

                            <td>
                              <div className="course-price-list">
                                {Object.entries(course.durations || {}).map(
                                  ([duration, price]) => (
                                    <span key={duration}>
                                      <b>{duration}</b>
                                      {money(price)}
                                    </span>
                                  )
                                )}
                                {Object.keys(course.durations || {}).length === 0 && (
                                  <span className="course-no-prices">No pricing configured</span>
                                )}
                              </div>
                            </td>

                            <td>
                              <CourseStatusBadge active={Number(course.is_active) === 1} />
                            </td>

                            <td className="course-updated-date">
                              {formatDate(course.updated_at)}
                            </td>

                            <td>
                              <div className="course-row-actions">
                                <button
                                  type="button"
                                  className="course-edit-button"
                                  onClick={() => openEditCourse(course)}
                                >
                                  <Edit3 size={15} />
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  className={`course-toggle-button ${
                                    Number(course.is_active) === 1 ? 'is-published' : ''
                                  }`}
                                  onClick={() => handleCourseStatus(course)}
                                  disabled={changingCourseStatus === course.id}
                                  title={Number(course.is_active) === 1
                                    ? 'Unpublish course'
                                    : 'Publish course'}
                                >
                                  {changingCourseStatus === course.id ? (
                                    <span className="admin-inline-loader" />
                                  ) : Number(course.is_active) === 1 ? (
                                    <>
                                      <ToggleRight size={17} />
                                      Unpublish
                                    </>
                                  ) : (
                                    <>
                                      <ToggleLeft size={17} />
                                      Publish
                                    </>
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="course-list-footer">
                  <span>
                    Showing {filteredCourses.length} of {courses.length} courses
                  </span>
                  <span>
                    Changes to published courses are reflected on the public website.
                  </span>
                </div>
              </section>
            </section>
          )}

          <footer className="admin-footer">
            <span>© {new Date().getFullYear()} Just Science</span>
            <span>
              {activePage === 'courses'
                ? 'Course Management'
                : 'Course Enrolment Management'}
            </span>
          </footer>
        </section>
      </main>

      {selectedEnrollment && (
        <EnrollmentDetails
          enrollment={selectedEnrollment}
          onClose={() => setSelectedEnrollment(null)}
          onStatusChange={handleStatusChange}
          updating={updatingStatus}
        />
      )}

      {courseEditorOpen && editingCourse && (
        <CourseEditor
          key={editingCourse.id || 'new-course'}
          course={editingCourse}
          onClose={() => {
            setCourseEditorOpen(false);
            setEditingCourse(null);
            setCourseSaveError('');
          }}
          onSave={handleSaveCourse}
          saving={savingCourse}
          error={courseSaveError}
        />
      )}
    </div>
  );
}