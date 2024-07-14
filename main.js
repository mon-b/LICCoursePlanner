import jsonData from './data.js';

const allCourses = [];

function collectAllCourses(){
    jsonData.forEach(semester => {
        semester.courses.forEach(course => {
            allCourses.push(course);
            console.log('Course ' + course.name + ' added ' + course.id);
        });
    });
}

function createCourse(course) {
    const courseDiv = document.createElement('div');
    courseDiv.className = 'course';
    courseDiv.draggable = true;
    courseDiv.textContent = `${course.name} (${course.cred} créditos)`;
    courseDiv.id = course.id;

    courseDiv.addEventListener('dragstart', handleDragStart);

    return courseDiv;
}

function initializeCoursePool() {
    const coursePool = document.getElementById('course-pool');
    allCourses.forEach(course => {
        const courseElement = createCourse(course);
        coursePool.appendChild(courseElement);
    });

    coursePool.addEventListener('dragover', allowDrop);
    coursePool.addEventListener('drop', handleDrop);
}

function createSemester(number) {
    const semesterDiv = document.createElement('div');
    semesterDiv.className = 'semester';
    semesterDiv.textContent = 'Semestre ' + number;

    semesterDiv.addEventListener('dragover', allowDrop);
    semesterDiv.addEventListener('drop', handleDrop);

    return semesterDiv;
}

function initializeSemesters() {
    const semesterPool = document.getElementById('semester-pool');
    for (let semester_number = 1; semester_number <= 8; semester_number++) {
        const semester = createSemester(semester_number);
        semesterPool.appendChild(semester);
    }
}

function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
}

function allowDrop(event) {
    event.preventDefault();
}


function handleDrop(event) {
    event.preventDefault();
    const courseId = event.dataTransfer.getData('text/plain');
    const courseElement = document.getElementById(courseId);
    const targetSemester = event.target.closest('.semester');


    if (targetSemester && courseElement && event.target.classList.contains('semester')) {
        targetSemester.appendChild(courseElement);
    }
    else if (!targetSemester && courseElement) {
        const coursePool = document.getElementById('course-pool');

        if (event.target === coursePool || coursePool.contains(event.target)) {
            coursePool.appendChild(courseElement);
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    collectAllCourses();
    initializeCoursePool();
    initializeSemesters();
});
