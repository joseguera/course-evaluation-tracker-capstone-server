const CoursesService = {
    getAllCourses(knex) {
        return knex.select('courses.*',
            knex.raw("CONCAT(users.first_name, ' ', users.last_name) as rep_name"))
            .from('courses')
            .join('users', 'courses.program_rep', '=', 'users.id');
    },

    insertCourse(knex, newCourse) {
        return knex
            .insert(newCourse)
            .into('courses')
            .returning('*')
            .then(rows => {
                return rows[0];
            });
    },

    getById(knex, id) {
        return knex.select('courses.*',
            knex.raw("CONCAT(users.first_name, ' ', users.last_name) as rep_name"))
            .from('courses')
            .join('users', 'courses.program_rep', '=', 'users.id')
            .where('courses.id', parseInt(id))
            .first()
    },

    deleteCourse(knex, id) {
        return knex('courses')
            .where({ id })
            .delete()
    },

    updateCourse(knex, id, newCourseFields) {
        return knex('courses')
            .where({ id })
            .update(newCourseFields)
    }
};

module.exports = CoursesService;