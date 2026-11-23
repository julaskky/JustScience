# Just Science

### Technology. Research. Innovation. Professional Development.

Just Science is a technology and research consultancy platform designed to make professional technology education, digital skills development, and academic research support more accessible.

The platform brings together technology training, software development education, artificial intelligence and machine learning courses, research assistance, and IT consultancy services within a modern web-based environment.

Built with React, PHP, and MySQL, Just Science provides a responsive public-facing website, course information and registration functionality, and an administrative interface for managing courses and enrolments.

---

## Table of Contents

- [Overview](#overview)
- [Core Services](#core-services)
- [Platform Features](#platform-features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Installation and Setup](#installation-and-setup)
- [Database Configuration](#database-configuration)
- [Running the Application](#running-the-application)
- [API Overview](#api-overview)
- [Security Considerations](#security-considerations)
- [Future Development](#future-development)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Overview

Just Science was developed to bridge the gap between technological advancement, practical skills development, and research expertise.

The platform serves individuals and organisations seeking structured technology training, professional technical guidance, and academic research support.

Its primary objectives are to:

- Provide access to practical and professionally oriented technology training.
- Support the development of programming, data science, and artificial intelligence skills.
- Facilitate course discovery and enrolment through an accessible online platform.
- Provide administrative tools for managing training programmes and registrations.
- Offer technology consultancy and academic research support services.
- Establish a foundation for expanding digital learning and consultancy services.

## Core Services

### 1. Professional Technology Training

The platform provides technology-oriented training programmes covering areas such as:

| Training Area | Description |
|---|---|
| Website Design | Modern website development and web technologies |
| Python Programming | Programming fundamentals and practical Python development |
| Machine Learning | Machine learning concepts, algorithms, and applications |
| Artificial Intelligence | AI concepts, methods, and practical applications |
| Deep Learning | Neural networks and advanced deep learning techniques |
| Natural Language Processing | Text processing and language-based AI systems |
| Large Language Models | Modern language models and their applications |

Training programmes are structured around different learning durations, including one-week, two-week, one-month, and three-month options.

### 2. IT Consultancy

Technical consultancy covering software solutions, technology adoption, digital systems, and IT-related problem-solving.

### 3. Academic and Research Support

Academic and research consultancy services include:

- Student assignment support.
- Research topic and title development.
- Master's research proposals and dissertations.
- PhD research proposals and thesis support.
- Research methodology and technical guidance.
- Artificial intelligence and machine learning research support.

These services are intended to support research development and academic progression.

---

## Platform Features

### Public Website

- Modern, responsive interface.
- Presentation of available courses and training programmes.
- Course descriptions and detailed course information.
- Training duration and pricing information.
- Course registration and enrolment functionality.
- Dedicated service and information sections.
- Responsive navigation and reusable interface components.

### Course Management

The administrative interface provides functionality for:

- Administrator authentication.
- Creating and managing training courses.
- Managing course information and pricing.
- Reviewing course enrolments.
- Accessing administrative course and enrolment information.

### Enrolment Management

The platform includes backend functionality for processing course registration information and supporting administrative enrolment management.

### Administrative Interface

A separate administrative entry point is provided through `admin.html`, with dedicated React components and API services.

---

## Technology Stack

The application uses a separated frontend and backend architecture.

| Component | Technology |
|---|---|
| Frontend | React 18 |
| Build Tool | Vite 6 |
| Programming Language (Frontend) | JavaScript / JSX |
| UI Icons | Lucide React |
| Styling | CSS3 |
| Backend | PHP |
| Database | MySQL / MariaDB |
| Web Server | Apache |
| Local Development Environment | XAMPP |
| Package Management | npm |
| Version Control | Git |

---

## System Architecture

Just Science follows a client-server architecture.

**Frontend Layer**

The React application provides the public website, course browsing experience, registration interface, and administrative dashboard.

**Backend Layer**

The PHP REST-style API handles application requests, administrator authentication, course operations, enrolment processing, and database interactions.

**Database Layer**

MySQL stores the application's persistent information, including course and enrolment records.

**Application Communication**

The frontend communicates with the backend through HTTP requests using JSON-based API responses.

---

## Project Structure

```text
justscience/
│
├── api/
│   ├── config/
│   │   ├── .htaccess
│   │   └── config.php
│   │
│   ├── .htaccess
│   ├── index.php
│   ├── services.php
│   ├── enrollments.php
│   ├── admin-auth.php
│   ├── admin-courses.php
│   └── admin-enrollments.php
│
├── database/
│   └── justscience.sql
│
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── admin/
│   │   ├── AdminApp.jsx
│   │   ├── admin.css
│   │   ├── adminApi.js
│   │   └── course-management.css
│   │
│   ├── assets/
│   ├── components/
│   ├── data/
│   ├── services/
│   ├── App.jsx
│   ├── App.css
│   ├── admin-main.jsx
│   ├── index.css
│   ├── main.jsx
│   └── styles.css
│
├── admin.html
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

---

## Installation and Setup

### Prerequisites

Ensure the following software is installed:

- Windows, Linux, or macOS.
- PHP 8.2 or a compatible version.
- MySQL or MariaDB.
- Apache web server.
- Node.js and npm.
- Git (optional, for version control).

For Windows development, XAMPP provides Apache, PHP, and MariaDB/MySQL in one environment.

### 1. Clone the Repository

```bash
git clone https://github.com/julaskky/JustScience.git
```

Navigate into the project directory:

```bash
cd JustScience
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Configure the Database

Start Apache and MySQL through the XAMPP Control Panel.

Open phpMyAdmin:

```text
http://localhost/phpmyadmin
```

Create a database named:

```text
justscience
```

Import the database schema:

```text
database/justscience.sql
```

Alternatively, import the SQL file through the phpMyAdmin Import interface.

### 4. Configure the PHP Backend

Open:

```text
api/config/config.php
```

Configure the database connection settings for your local environment:

```php
const DB_HOST = 'localhost';
const DB_NAME = 'justscience';
const DB_USER = 'root';
const DB_PASS = '';
```

Update these values to match your MySQL configuration.

The local development configuration also defines the permitted frontend origins. Adjust `ALLOWED_ORIGINS` if your frontend runs on a different address or port.

**Important:** These settings are for local development only. Production deployments should use dedicated database credentials and environment-specific configuration.

### 5. Configure the Frontend API

The frontend API services use the local backend endpoint:

```text
http://localhost/justscience/api
```

If the application is installed under a different directory or deployed to another server, update the API base URL in the relevant frontend service configuration.

---

## Running the Application

### Start the Backend

Ensure Apache and MySQL are running in XAMPP.

The backend API will be accessible at:

```text
http://localhost/justscience/api
```

### Start the Frontend

From the project root, execute:

```bash
npm run dev
```

Vite starts the frontend development server, normally at:

```text
http://localhost:5173
```

### Access the Administrative Interface

The administrative entry point is:

```text
http://localhost:5173/admin.html
```

The public website is available at:

```text
http://localhost:5173
```

### Build for Production

Generate the frontend production build:

```bash
npm run build
```

Preview the generated build locally:

```bash
npm run preview
```

The production frontend files are generated in the `dist/` directory.

---

## API Overview

The PHP backend exposes endpoints for the platform's public and administrative operations.

| Endpoint | Purpose |
|---|---|
| `GET /api/` | API entry point |
| `/api/services.php` | Retrieve available services and courses |
| `/api/enrollments.php` | Process course enrolments |
| `/api/admin-auth.php` | Administrator authentication |
| `/api/admin-courses.php` | Administrative course management |
| `/api/admin-enrollments.php` | Administrative enrolment management |

The API uses JSON responses and HTTP status codes to communicate request outcomes.

The administrative endpoints are intended for authenticated administrative operations.

---

## Security Considerations

Security is an important consideration in the development and deployment of Just Science.

The project includes several foundational protections:

- Restricted direct access to sensitive API configuration files through Apache `.htaccess` rules.
- Directory listing disabled for protected API directories.
- CORS origin restrictions for the local frontend.
- Session-based administrator authentication.
- Separation of public and administrative API operations.
- Exclusion of environment files and local dependencies from version control.

### Production Deployment Recommendations

Before deploying the platform to a production server:

1. Replace local database credentials with a dedicated database account.
2. Store sensitive configuration outside publicly accessible directories.
3. Enable HTTPS.
4. Review administrator authentication and session configuration.
5. Validate and sanitise all incoming user data.
6. Apply appropriate CSRF protections to state-changing administrative operations.
7. Restrict access to uploaded files and sensitive resources.
8. Configure production CORS origins.
9. Review file permissions and Apache security rules.
10. Maintain regular database backups.

---

## Future Development

The platform is designed to support further improvements, including:

- Online learning and structured course delivery.
- Student and learner accounts.
- Learning progress tracking.
- Online payment integration.
- Automated enrolment notifications.
- Course completion certificates.
- Expanded administrative reporting and analytics.
- Appointment scheduling for consultancy services.
- Enhanced research support workflows.
- Integration of AI-powered educational and research tools.

These are potential development directions and should not be interpreted as currently implemented functionality.

---

## Contributing

Contributions, suggestions, and technical improvements are welcome.

To contribute:

1. Fork the repository.
2. Create a feature branch.
3. Implement your changes.
4. Test the changes locally.
5. Commit your work with a descriptive commit message.
6. Submit a pull request.

Example:

```bash
git checkout -b feature/new-feature
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
```

---

## License

No open-source licence has currently been specified for this repository.

Unless a licence is added, the source code remains subject to the default copyright protections. Please contact the project owner before redistributing or reusing the code.

---

## Contact

**Project:** Just Science

**GitHub Repository:**  
https://github.com/julaskky/JustScience

**Website:**  
To be announced.

For project enquiries, technical collaboration, consultancy, and further information, please use the repository's GitHub Issues or Discussions.

---

*Just Science — Empowering technology, advancing research, and developing practical skills through innovation.*
