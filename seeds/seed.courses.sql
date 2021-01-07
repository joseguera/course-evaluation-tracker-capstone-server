BEGIN;

TRUNCATE
  users,
  courses
  RESTART IDENTITY CASCADE,
  questions
  RESTART IDENTITY CASCADE;

INSERT INTO users (first_name, last_name, username, password)
VALUES
    ('Chicano', 'Chickie', 'chicks_mcgee', 'secret');

INSERT INTO courses (instructor_name, program_area, program_rep, course_number, course_name, quarter, project_id, notes, score)
VALUES 
    ('Dana Leland',	'accounting', 'Mark Ramseyer', 'MGMT X 127-223', 'Federal Income Taxation', 'Winter 2021', 377875, 'missing meeting times, outcomes (1/7/21)', 15);

INSERT INTO questions (question1, question2, question3, question4, question5, question6, question7, question8, question9, question10, total)
VALUES
    (2, 3, 2, 1, 3, 2, 3, 2, 3, 1, 23);