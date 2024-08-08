import jsonData from './data/default_data.js';
import optData from './data/opt_data.js';


function createCourse(course) {
    const courseDiv = document.createElement('div');
    courseDiv.className = 'course ' + course.type;
    courseDiv.draggable = true;
    courseDiv.innerHTML = `
        <div class="course-content">
            <b class="course-name">${course.name_stylized}</b> <br>
            [${course.id}] <br>
            <small>${course.cred} créditos</small>
            
        </div>
        <span class="prereq-tooltip">Prereq: ${course.prereq}</span>
    `;
    courseDiv.id = course.id;

    courseDiv.addEventListener('dragstart', handleDragStart);
    courseDiv.addEventListener('click', handleTakenCourse);

    return courseDiv;
}

function handleTakenCourse(event) {
    const courseDiv = event.currentTarget;
    courseDiv.classList.toggle('taken');
}

function initializeCoursePool() {
    const coursePool = document.getElementById('course-pool');

    coursePool.addEventListener('dragover', allowDrop);
    coursePool.addEventListener('drop', handleDrop);
}

function createSemester(number) {
    const semesterDiv = document.createElement('div');
    semesterDiv.id = 'sem' + number;
    semesterDiv.className = 'semester';

    const semesterHead = document.createElement('div');
    semesterHead.className = 'semesterHead';

    const semText = document.createTextNode('Semestre ' + number);
    semesterHead.appendChild(semText);

    if (number > 8) {
        const deleteButton = document.createElement('div');
        deleteButton.className = 'delete-semester-btn';
        deleteButton.innerHTML = `&nbsp<img src="icons/cross.png" alt="x" style="width:12px"> `

        deleteButton.setAttribute('data-semester-id', semesterDiv.id);

        deleteButton.addEventListener('click', function () {
            const semesterID = this.getAttribute('data-semester-id');
            deleteSemester(semesterID);
        });

        semesterHead.appendChild(deleteButton);
    }
    semesterDiv.appendChild(semesterHead);

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

    const addSemesterBtn = document.getElementById('add-semester-btn');
    semesterPool.appendChild(addSemesterBtn);

    semesterPool.addEventListener('dragover', allowDrop);
    semesterPool.addEventListener('drop', handleDrop);
}

function handleDragStart(event) {
    const tooltip = event.currentTarget.querySelector('.prereq-tooltip');
    if (tooltip) {
        tooltip.style.display = 'none';
    }
    event.dataTransfer.setData('text/plain', event.target.id);
}

function handleDragEnd(event) {
    const tooltip = event.currentTarget.querySelector('.prereq-tooltip');
    if (tooltip) {
        tooltip.style.display = 'block'; // Show the tooltip again
    }
}

function handleDrop(event) {
    event.preventDefault();
    const courseId = event.dataTransfer.getData('text/plain');
    const courseElement = document.getElementById(courseId);
    let target = event.target;

    // Ensure target is a valid drop area within a semester or the course pool
    if (!target.classList.contains('course') && !target.closest('.semester') && !target.closest('#course-pool')) {
        return;
    }

    const targetSemester = target.closest('.semester');
    const coursePool = document.getElementById('course-pool');

    if (targetSemester && courseElement) {
        const semesterCourses = Array.from(targetSemester.querySelectorAll('.course'));
        const mouseY = event.clientY;

        let insertBeforeElement = null;
        for (let i = 0; i < semesterCourses.length; i++) {
            const course = semesterCourses[i];
            const courseRect = course.getBoundingClientRect();

            if (mouseY < courseRect.top + courseRect.height / 2) {
                insertBeforeElement = course;
                break;
            }
        }

        if (insertBeforeElement) {
            targetSemester.insertBefore(courseElement, insertBeforeElement);
        } else {
            targetSemester.appendChild(courseElement);
        }

        const semesterText = targetSemester.textContent || targetSemester.innerText;
        const semesterNumberMatch = semesterText.match(/\d+/);
        const semesterNumber = semesterNumberMatch ? parseInt(semesterNumberMatch[0], 10) : null;
        if (semesterNumber >= 9) {
            updateCoursePoolWidth();
        }
    } else if (courseElement) {
        if (event.target === coursePool || coursePool.contains(event.target)) {
            coursePool.appendChild(courseElement);
        }
    }
}

function allowDrop(event) {
    event.preventDefault();
}


function newSemester() {
    const semesterPool = document.getElementById('semester-pool');
    const newSemesterNumber = semesterPool.children.length;

    const semesterDiv = createSemester(newSemesterNumber);
    semesterPool.appendChild(semesterDiv);

    const addSemesterBtn = document.getElementById('add-semester-btn');
    semesterPool.appendChild(addSemesterBtn);
}

function deleteSemester(semesterID) {
    const confirmed = window.confirm('¿Quieres eliminar este semestre?');
    if (confirmed) {
        const semester = document.getElementById(semesterID)
        const coursePool = document.getElementById('course-pool');

        while (semester.firstChild) {
            coursePool.appendChild(semester.firstChild);
        }
        semester.parentNode.removeChild(semester);
        updateCoursePoolWidth()
    }

}

function handleAddSemesterClick() {
    const confirmed = window.confirm('¿Quieres añadir un nuevo semestre?');

    if (confirmed) {
        newSemester();
        updateCoursePoolWidth();
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

function updateCoursePoolWidth() {
    const semesterPoolWidth = document.getElementById('semester-pool').offsetWidth;
    document.querySelector('.collapsible-course-pool').style.width = semesterPoolWidth + 'px';
}

let tooltipTimeout;

function showTooltip(event) {
    const tooltip = event.currentTarget.querySelector('.prereq-tooltip');
    if (tooltip) {
        tooltip.classList.add('visible');

        function positionTooltip() {

            if (event.currentTarget) {
                const rect = event.currentTarget.getBoundingClientRect();
                const tooltipWidth = tooltip.offsetWidth;
                const tooltipHeight = tooltip.offsetHeight;

                const verticalCenter = rect.top + window.scrollY + (rect.height / 2);

                const offset = Math.max(tooltipHeight / 2, 48);

                tooltip.style.top = `${verticalCenter - (tooltipHeight / 2) - offset}px`;
                tooltip.style.left = `${rect.left + window.scrollX + (rect.width / 2) - (tooltipWidth / 2)}px`;
            }
        }

        positionTooltip();

        const mouseMoveHandler = (e) => {
            positionTooltip();
        };

        document.addEventListener('mousemove', mouseMoveHandler);

        event.currentTarget.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
            document.removeEventListener('mousemove', mouseMoveHandler);
        }, { once: true });
    }
}


function hideTooltip(event) {
    clearTimeout(tooltipTimeout);

    const targetElement = event.currentTarget;
    if (targetElement && targetElement.querySelector) {
        const tooltip = targetElement.querySelector('.prereq-tooltip');
        if (tooltip) {
            tooltip.classList.remove('visible');
        }
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

    document.querySelectorAll('.course').forEach(course => {
        course.addEventListener('mouseover', showTooltip);
        course.addEventListener('mouseout', hideTooltip);
        course.addEventListener('dragstart', handleDragStart);
        course.addEventListener('dragend', handleDragEnd);
    });

    updateCoursePoolWidth();
});
