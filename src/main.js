import jsonData from './data/default_data.js';
import optData from './data/opt_data.js';
import translations from './data/eng_esp.js';
import legend from "./data/legend.js";

const semester = translations.semester;
const show = translations.show;
const credits = translations.credits;

let eng = true;
let placeholder = document.createElement('div');
placeholder.className = 'course-placeholder';


function initializeFilters() {
    // 
}

function createCourse(course) {
    const courseDiv = document.createElement('div');
    courseDiv.className = 'course ' + course.type;
    courseDiv.draggable = true;
    courseDiv.innerHTML = `
        <div class="course-content">
            <b class="course-name">${course.name_stylized}</b> <br>
            [${course.id}] <br>
            <small>${course.cred} ${credits.spanish}</small>
            
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

    const semText = document.createTextNode(semester.spanish + " " + number);
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

function deleteSemester(semesterID) {
    const confirmed = window.confirm('¿Quieres eliminar este semestre?');
    if (confirmed) {
        const semester = document.getElementById(semesterID)
        const coursePool = document.getElementById('course-pool');

        const semesterHead = semester.firstChild;
        semester.removeChild(semesterHead); // so the head isnt returned to the course pool

        while (semester.firstChild) {
            coursePool.appendChild(semester.firstChild);
        }
        semester.parentNode.removeChild(semester);
        updateCoursePoolWidth()
    }

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

    // Make the dragged element invisible without deleting it
    event.target.style.opacity = '50';

    // Create a placeholder element and insert it into the target's position
    const placeholder = document.createElement('div');
    placeholder.classList.add('placeholder');
    event.target.parentNode.insertBefore(placeholder, event.target.nextSibling);

    event.dataTransfer.setData('text/plain', event.target.id);

    event.currentTarget.addEventListener(
        'dragend',
        () => {
            if (tooltip) {
                tooltip.style.display = '';
            }

            // Remove the placeholder after the drag ends
            if (placeholder.parentNode) {
                placeholder.parentNode.removeChild(placeholder);
            }

            // Insert the dragged course into the correct position
            if (event.target.closest('.semester')) {
                event.target.closest('.semester').appendChild(event.target);
            } else {
                document.getElementById('course-pool').appendChild(event.target);
            }

            // Reset the course style (opacity and position)
            event.target.style.opacity = '';
        },
        { once: true }
    );
}




function allowDrop(event) {
    event.preventDefault();

    const target = event.target.closest('.semester');
    if (target && target.classList.contains('semester')) {
        const mouseY = event.clientY;

        const children = Array.from(target.children).filter(
            child => child.classList.contains('course')
        );

        let insertBefore = null;
        for (const child of children) {
            const rect = child.getBoundingClientRect();
            if (mouseY < rect.top + rect.height / 2) {
                insertBefore = child;
                break;
            }
        }

        if (insertBefore) {
            insertBefore.parentNode.insertBefore(placeholder, insertBefore);
        } else if (!target.contains(placeholder)) {
            target.appendChild(placeholder);
        }
    }
}

function handleDrop(event) {
    event.preventDefault();

    const courseId = event.dataTransfer.getData('text/plain');
    const courseElement = document.getElementById(courseId);

    let target = event.target;

    if (target.classList.contains('course')) {
        target = target.closest('.semester') || target.closest('#course-pool');
    }

    const targetSemester = target.closest('.semester');

    if (targetSemester && courseElement) {
        if (placeholder.parentNode === targetSemester) {
            targetSemester.insertBefore(courseElement, placeholder);
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
        const coursePool = document.getElementById('course-pool');
        if (event.target === coursePool || coursePool.contains(event.target)) {
            coursePool.appendChild(courseElement);
        }
    }

    // Remove the placeholder
    if (placeholder.parentNode) {
        placeholder.parentNode.removeChild(placeholder);
    }
}



function newSemester() {
    const semesterPool = document.getElementById('semester-pool');
    const newSemesterNumber = semesterPool.children.length;

    const semesterDiv = createSemester(newSemesterNumber);
    semesterPool.appendChild(semesterDiv);

    const addSemesterBtn = document.getElementById('add-semester-btn');
    semesterPool.appendChild(addSemesterBtn);
}

function handleAddSemesterClick() {
    const confirmed = window.confirm('Are you sure you want to add a new semester?');

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
        toggleText.textContent = show.spanish;
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
    });

    updateCoursePoolWidth();
});
