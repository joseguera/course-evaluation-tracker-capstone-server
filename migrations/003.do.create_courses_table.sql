DROP TABLE IF EXISTS courses;

CREATE TABLE courses (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    instructor_name TEXT NOT NULL,
    program_area TEXT NOT NULL,
    program_rep INTEGER
        REFERENCES users(id) ON DELETE CASCADE NOT NULL,  
    course_number TEXT NOT NULL,
    course_name TEXT NOT NULL,
    quarter TEXT NOT NULL,
    project_id INTEGER NOT NULL,
    notes TEXT,
    total INTEGER
        REFERENCES questions(id) ON DELETE CASCADE NOT NULL
    UNIQUE(total)
);