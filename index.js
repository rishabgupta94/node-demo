const express = require('express');
const Joi = require('joi');

const app = express();

app.use(express.json());

const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' }
];

app.get('/', (req, res) => {
    res.send('Hello World!!');
});

// GET - Access all courses
app.get('/api/courses', (req, res) => {
    res.send(courses);
});

// GET - Access course by ID
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find((c) => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found');
    res.send(course);
});

// POST - Creating a course
app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name,
    };
    courses.push(course);
    res.send(course);
});

// PUT - Updating a course
app.put('/api/courses/:id', (req, res) => {
    // Look up the course, return 404 if it does not exist
    const course = courses.find((c) => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found');

    // Validate the new course name, return 400 if the course is invalid
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Update the course. Return the updated course
    course.name = req.body.name;
    res.send(course);
});

// DELETE - Deleting a course
app.delete('/api/courses/:id', (req, res) => {
    // Look up the course, return 404 if it does not exist
    const course = courses.find((c) => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found');

    // Delete a course
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    res.send(courses);
});

const validateCourse = (course) => {
    const schema = Joi.object({ name: Joi.string().min(3).required() });
    return schema.validate(course);
};

// Listen to the port
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
