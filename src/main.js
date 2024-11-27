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

function allowDrop(event) {
    event.preventDefault();

    const target = event.target.closest('.semester, #course-pool');
    if (!target) return;

    const mouseY = event.clientY;
    const draggedCourse = document.querySelector('.course[style*="opacity: 0.5"]');
    if (!draggedCourse) return;

    if (target.id === 'course-pool') {
        if (placeholder.parentNode !== target) {
            if (placeholder.parentNode) {
                placeholder.parentNode.removeChild(placeholder);
            }
            target.appendChild(placeholder);
        }
    } else if (target.classList.contains('semester')) {
        const children = Array.from(target.children).filter(
            child => child.classList.contains('course') &&
                child !== draggedCourse &&
                child !== placeholder
        );

        let insertBefore = null;
        for (const child of children) {
            const rect = child.getBoundingClientRect();
            if (mouseY < rect.top + rect.height / 2) {
                insertBefore = child;
                break;
            }
        }

        if (placeholder.parentNode) {
            placeholder.parentNode.removeChild(placeholder);
        }

        const wouldBePlacedAfterDraggedCourse =
            draggedCourse.parentNode === target &&
            ((draggedCourse.nextElementSibling === insertBefore) ||
            (!insertBefore && Array.from(target.children).indexOf(draggedCourse) === target.children.length - 1));

        if (!wouldBePlacedAfterDraggedCourse) {
            if (insertBefore) {
                target.insertBefore(placeholder, insertBefore);
            } else {
                target.appendChild(placeholder);
            }
        }
    }
}

function handleDrop(event) {
    event.preventDefault();

    const courseId = event.dataTransfer.getData('text/plain');
    const courseElement = document.getElementById(courseId);


    if (!courseElement || !placeholder.parentNode) return;

    const targetContainer = event.target.closest('.semester, #course-pool');
    if (!targetContainer) return;

    placeholder.parentNode.insertBefore(courseElement, placeholder);

    if (placeholder.parentNode) {
        placeholder.parentNode.removeChild(placeholder);
    }

    if (targetContainer.classList.contains('semester')) {
        const semesterText = targetContainer.textContent || targetContainer.innerText;
        const semesterNumber = parseInt(semesterText.match(/\d+/)?.[0] || '0', 10);
        if (semesterNumber >= 9) {
            updateCoursePoolWidth();
        }
    }
}

function handleDragStart(event) {
    const tooltip = event.currentTarget.querySelector('.prereq-tooltip');
    if (tooltip) {
        tooltip.style.display = 'none';
    }

    event.target.style.opacity = '0.5';

    if (placeholder.parentNode) {
        placeholder.parentNode.removeChild(placeholder);
    }

    event.dataTransfer.setData('text/plain', event.target.id);

    event.currentTarget.addEventListener('dragend', () => {
        if (tooltip) {
            tooltip.style.display = '';
        }

        if (placeholder.parentNode) {
            placeholder.parentNode.removeChild(placeholder);
        }

        event.target.style.opacity = '';
    }, { once: true });
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
    const filters = document.getElementById('filters');
    const toggleText = document.getElementById('toggle-text');
    const imgIcon = document.querySelector('#header img');

    coursePool.style.display = coursePool.style.display === 'none' ? 'flex' : 'none';
    filters.style.display = coursePool.style.display === 'flex' ? 'block' : 'none';

    if (coursePool.style.display === 'flex') {
        toggleText.textContent = 'Ocultar cursos disponibles';
        imgIcon.src = 'icons/less.png';
    } else {
        toggleText.textContent = show.spanish;
        imgIcon.src = 'icons/more.png';
    }
}

function updateCoursePoolWidth() {
    const semesterPoolWidth = document.getElementById('semester-pool').offsetWidth;
    document.querySelector('.collapsible-course-pool').style.width = semesterPoolWidth + 'px';
}

function createFilterUI() {
    const filterDiv = document.getElementById('filters');
    filterDiv.innerHTML = `
       <input type="text" id="course-search" placeholder="Buscar por nombre o sigla" class="search-input">
       <div class="filter-tags"></div>
   `;

    const tagMappings = {
        'fmat': legend.spanish.matematicos,
        'dcc': legend.spanish.minimosCompu,
        'major': legend.spanish.majorCompu,
        'ofg': legend.spanish.formacionGeneral,
        'eti': legend.spanish.etica,
        'optcomp': legend.spanish.optComputacion,
        'opt-cien': legend.spanish.optCiencias,
        'opt-mat': legend.spanish.optMatematicos,
        'optlet': legend.spanish.optLetras,
        'econ': legend.spanish.optEconomia,
        'opt-ast': legend.spanish.optAstronomia,
        'optbio': legend.spanish.optBiologia,
        'optsci': '', // Exclude this category
        'optcom': legend.spanish.optComunicacion
    };

    const allTypes = Object.keys(tagMappings).filter(type => tagMappings[type] !== '');
    const tagContainer = filterDiv.querySelector('.filter-tags');
    const activeFilters = new Set();

    allTypes.forEach(type => {
        const tag = document.createElement('button');
        tag.className = `filter-tag ${type}`;
        tag.dataset.type = type;
        tag.textContent = tagMappings[type];
        tag.addEventListener('click', () => {
            tag.classList.toggle('active');
            if (tag.classList.contains('active')) {
                activeFilters.add(type);
            } else {
                activeFilters.delete(type);
            }
        });
        tagContainer.appendChild(tag);
    });

    initializeFilters(activeFilters);
}

function initializeFilters(activeFilters) {
    const searchInput = document.getElementById('course-search');
    const filterTags = document.querySelectorAll('.filter-tag');

    searchInput.addEventListener('input', () => filterCourses(activeFilters));
    filterTags.forEach(tag => {
        if (activeFilters.has(tag.dataset.type)) {
            tag.classList.add('active');
        }
        tag.addEventListener('click', () => {
            filterCourses(activeFilters);
        });
    });

    function filterCourses(activeFilters) {
        const searchTerm = searchInput.value.toLowerCase();
        const courses = document.querySelectorAll('#course-pool .course');

        courses.forEach(course => {
            const courseText = course.textContent.toLowerCase();
            const courseType = Array.from(course.classList)
                .find(cls => cls !== 'course');

            const matchesSearch = !searchTerm || courseText.includes(searchTerm);
            const matchesType = activeFilters.size === 0 || activeFilters.has(courseType);

            course.style.display = matchesSearch && matchesType ? 'flex' : 'none';
        });
    }
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
    createFilterUI();

    const addSemesterBtn = document.getElementById('add-semester-btn');
    addSemesterBtn.addEventListener('click', handleAddSemesterClick);

    document.getElementById('course-pool').style.display = 'none';
    document.getElementById('filters').style.display = 'none';

    const header = document.getElementById('header');
    header.addEventListener('click', toggleCoursePool);

    document.querySelectorAll('.course').forEach(course => {
        course.addEventListener('mouseover', showTooltip);
        course.addEventListener('mouseout', hideTooltip);
    });

    updateCoursePoolWidth();
});
