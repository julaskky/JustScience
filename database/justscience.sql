
CREATE DATABASE IF NOT EXISTS justscience
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE justscience;

CREATE TABLE IF NOT EXISTS services (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category ENUM(
        'training',
        'consultancy',
        'research',
        'academic_support'
    ) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    durations JSON NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_services_category_active (
        category,
        is_active,
        sort_order
    )
) ENGINE=InnoDB;

INSERT INTO services
(category, slug, title, description, durations, sort_order)
VALUES
(
    'training',
    'website-design',
    'Website Design',
    'Learn to create responsive, modern websites and build a strong foundation in web development.',
    '["1 Week","2 Weeks","1 Month","3 Months"]',
    1
),
(
    'training',
    'python-programming',
    'Python Programming',
    'Develop practical programming skills, from Python fundamentals to building useful applications.',
    '["1 Week","2 Weeks","1 Month","3 Months"]',
    2
),
(
    'training',
    'machine-learning',
    'Machine Learning',
    'Explore predictive modelling, data preparation, model evaluation and intelligent systems.',
    '["1 Week","2 Weeks","1 Month","3 Months"]',
    3
),
(
    'training',
    'artificial-intelligence',
    'Artificial Intelligence',
    'Understand AI techniques and discover how intelligent systems can solve real-world problems.',
    '["1 Week","2 Weeks","1 Month","3 Months"]',
    4
),
(
    'training',
    'deep-learning',
    'Deep Learning',
    'Explore neural networks and modern deep learning approaches for complex data problems.',
    '["1 Week","2 Weeks","1 Month","3 Months"]',
    5
),
(
    'training',
    'natural-language-processing',
    'Natural Language Processing',
    'Learn techniques for processing, analysing and understanding human language with AI.',
    '["1 Week","2 Weeks","1 Month","3 Months"]',
    6
),
(
    'training',
    'large-language-models',
    'Large Language Models',
    'Discover LLM foundations, prompting, practical applications and AI-assisted workflows.',
    '["1 Week","2 Weeks","1 Month","3 Months"]',
    7
),
(
    'consultancy',
    'web-development-consultancy',
    'Website and Web Application Development',
    'Consultancy and development support for websites and web applications.',
    NULL,
    1
),
(
    'consultancy',
    'software-database-solutions',
    'Software and Database Solutions',
    'Technical consultancy for software development, system design and database solutions.',
    NULL,
    2
),
(
    'consultancy',
    'ai-ml-consultancy',
    'AI and Machine Learning Consultancy',
    'Guidance on AI opportunities, machine learning solutions and intelligent applications.',
    NULL,
    3
),
(
    'consultancy',
    'it-advisory',
    'IT Advisory and Technical Support',
    'Technology advisory and technical support for individuals and organisations.',
    NULL,
    4
),
(
    'academic_support',
    'assignment-tutoring',
    'Student Assignment Tutoring',
    'Guided learning, subject explanations and problem-solving support to strengthen academic skills.',
    NULL,
    1
),
(
    'research',
    'research-title-guidance',
    'Research Title Guidance',
    'Support with identifying, refining and delimiting meaningful research topics.',
    NULL,
    2
),
(
    'research',
    'masters-research-support',
    'Master’s Research Support',
    'Research proposal and dissertation guidance, methodology consultation and analytical support.',
    NULL,
    3
),
(
    'research',
    'phd-research-support',
    'PhD Research Support',
    'Research proposal and thesis guidance, research design consultation and analytical support.',
    NULL,
    4
);
