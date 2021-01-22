BEGIN;

TRUNCATE
  users,
  courses
  RESTART IDENTITY CASCADE;

INSERT INTO users (first_name, last_name, username, password)
VALUES
    ('Chicano', 'Chickie', 'chicks_mcgee', 'secret'),
    ('Ogolla', 'Lina', 'logolla', 'secret');


INSERT INTO courses (instructor_name, program_area, program_rep, course_number, course_name, quarter, project_id, notes, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10)
VALUES 
    ('Dana Leland',	'accounting', 1, 'MGMT X 127-223', 'Federal Income Taxation', 'Winter 2021', 377875, 'missing meeting times, outcomes (1/7/21)', 2, 3, 2, 1, 3, 2, 3, 2, 3, 1),
    ('Tan Chee-Sum', 'accounting', 2, '	MGMT X 422-077', 'Cost Accounting and Analysis (Online)', 'Winter 2021', 377774, 'missing meeting times, schedule (1/7/21)', 1, 2, 1, 2, 1, 3, 2, 3, 1, 1);