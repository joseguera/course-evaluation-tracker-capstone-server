const CoursesService = {
    getAllCourses(knex) {
        return knex.select('*').from('courses');
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
        return knex
            .from('courses')
            .select('*')
            .where('id', id)
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