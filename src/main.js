import jsonData from './data/default_data.js';
import optData from './data/opt_data.js';

function createCourse(course) {
    const courseDiv = document.createElement('div');
    courseDiv.className = 'course ' + course.type;
    courseDiv.draggable = true;
    courseDiv.innerHTML = `
        <b>${course.name_stylized}</b>
        [${course.id}]
        <small>${course.cred} créditos</small>
    `;
    courseDiv.id = course.id;

    courseDiv.addEventListener('dragstart', handleDragStart);

    return courseDiv;
}

function initializeCoursePool() {
    const coursePool = document.getElementById('course-pool');

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

    jsonData.forEach(semester => {
        const semesterDiv = createSemester(semester.sem);

        semester.courses.forEach(course => {
            const courseElement = createCourse(course);
            semesterDiv.appendChild(courseElement);
        });

        semesterPool.appendChild(semesterDiv);
    });

    semesterPool.addEventListener('dragover', allowDrop);
    semesterPool.addEventListener('drop', handleDrop);
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
    let target = event.target;

    if (target.classList.contains('course')) {
        target = target.closest('.semester');
    }

    const targetSemester = target.closest('.semester');

    if (targetSemester && courseElement) {
        targetSemester.appendChild(courseElement);
    } else if (courseElement) {
        const coursePool = document.getElementById('course-pool');
        if (event.target === coursePool || coursePool.contains(event.target)) {
            coursePool.appendChild(courseElement);
        }
    }
}


function newSemester() {
    const semesterPool = document.getElementById('semester-pool');
    const newSemesterNumber = semesterPool.children.length + 1;

    const semesterDiv = createSemester(newSemesterNumber);
    semesterPool.appendChild(semesterDiv);
}


function handleAddSemesterClick() {
    const confirmed = window.confirm('Are you sure you want to add a new semester?');

    if (confirmed) {
        newSemester();
    }
}

function addOptCourses() {
    const coursePool = document.getElementById('course-pool');
    optData.forEach(opt => {
        if (opt.courses && Array.isArray(opt.courses)) {
            opt.courses.forEach(course => {
                const courseElement = createCourse(course);
                coursePool.appendChild(courseElement);
            });
        } else {
            console.error('Invalid structure in optData:', opt);
        }
    });
}

function toggleCoursePool() {
    const coursePool = document.getElementById('course-pool');
    coursePool.classList.toggle('open');
    const toggleText = document.getElementById('toggle-text');
    const imgIcon = document.querySelector('#header img');

    if (coursePool.classList.contains('open')) {
        coursePool.style.display = 'flex';
        toggleText.textContent = 'Ocultar Cursos Disponibles';
        imgIcon.src = 'icons/less.png';
    } else {
        coursePool.style.display = 'none';
        toggleText.textContent = 'Mostrar Cursos Disponibles';
        imgIcon.src = 'icons/more.png';
    }
}


document.addEventListener('DOMContentLoaded', function () {
    initializeCoursePool();
    initializeSemesters();
    addOptCourses();

    const addSemesterBtn = document.getElementById('add-semester-btn');
    addSemesterBtn.addEventListener('click', handleAddSemesterClick);

    const header = document.getElementById('header');
    header.addEventListener('click', toggleCoursePool);

});
