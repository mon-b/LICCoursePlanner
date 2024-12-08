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

function isParityValid(course, semesterNumber) {
    const parity = course.getAttribute('data-parity');
    if (!parity || parity === 'both') return true;

    const isEvenSemester = semesterNumber % 2 === 0;
    if (parity === 'even' && !isEvenSemester) return false;
    if (parity === 'odd' && isEvenSemester) return false;

    return true;
}

function getParityText(parity) {
    switch(parity) {
        case 'even': return 'Semestres Pares';
        case 'odd': return 'Semestres Impares';
        case 'both': return 'Ambos Semestres';
        default: return 'Ambos Semestres';
    }
}

function formatPrereq(prereq) {
    if (!prereq) return 'Sin prerrequisitos';
    return prereq;
}

function createCourse(course) {
    const courseDiv = document.createElement('div');
    courseDiv.className = 'course ' + course.type;
    courseDiv.draggable = true;
    courseDiv.setAttribute('data-parity', course.parity || 'both');
    
    courseDiv.innerHTML = `
        <div class="course-content">
            <b class="course-name">${course.name_stylized}</b> <br>
            [${course.id}] <br>
            <small>${course.cred} créditos</small>
            <div class="prereq-tooltip">
                <div class="tooltip-header">${course.name_stylized}</div>
                <div class="tooltip-prereq">
                    <strong>Prerrequisitos:</strong><br>
                    ${formatPrereq(course.prereq)}
                </div>
                <div class="tooltip-parity">
                    <strong>Dictado en:</strong><br>
                    ${getParityText(course.parity)}
                </div>
            </div>
        </div>
    `;
    
    courseDiv.id = course.id;
    
    courseDiv.addEventListener('dragstart', handleDragStart);
    courseDiv.addEventListener('dragend', handleDragEnd);
    courseDiv.addEventListener('click', handleTakenCourse);
    
    return courseDiv;
}

function handleTakenCourse(event) {
    const courseDiv = event.currentTarget;
    courseDiv.classList.toggle('taken');
    saveState();
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
        const semester = document.getElementById(semesterID);
        const coursePool = document.getElementById('course-pool');

        const semesterHead = semester.firstChild;
        semester.removeChild(semesterHead);

        while (semester.firstChild) {
            coursePool.appendChild(semester.firstChild);
        }
        semester.parentNode.removeChild(semester);
        updateCoursePoolWidth();
        saveState();
    }
}

function initializeSemesters() {
    const semesterPool = document.getElementById('semester-pool');
    const addSemesterBtn = document.getElementById('add-semester-btn');
    const resetSemesterBtn = document.getElementById('reset-btn');

    semesterPool.removeChild(addSemesterBtn);
    semesterPool.removeChild(resetSemesterBtn);

    while (semesterPool.firstChild) {
        semesterPool.removeChild(semesterPool.firstChild);
    }

    jsonData.forEach(semester => {
        const semesterDiv = createSemester(semester.sem);

        semester.courses.forEach(course => {
            const courseElement = createCourse(course);
            semesterDiv.appendChild(courseElement);
        });

        semesterPool.appendChild(semesterDiv);
    });

    semesterPool.appendChild(addSemesterBtn);
    semesterPool.appendChild(resetSemesterBtn);
}

function allowDrop(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    
    let target = event.target.closest('.semester, #course-pool');
    if (!target && event.target.parentElement && event.target.parentElement.id === 'course-pool') {
        target = event.target.parentElement;
    }
    if (!target) return;

    const mouseY = event.clientY;
    const draggedCourse = document.querySelector('.course.dragging');
    if (!draggedCourse) return;

    const tooltip = draggedCourse.querySelector('.prereq-tooltip');
    if (tooltip) {
        tooltip.style.visibility = 'hidden';
    }

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

    document.querySelectorAll('.course:not(.dragging) .prereq-tooltip').forEach(otherTooltip => {
        otherTooltip.style.visibility = 'hidden';
    });
}

function handleDrop(event) {
    event.preventDefault();

    const courseId = event.dataTransfer.getData('text/plain');
    const courseElement = document.getElementById(courseId);

    if (!courseElement || !placeholder.parentNode) return;

    const targetContainer = event.target.closest('.semester, #course-pool');
    if (!targetContainer) return;

    if (targetContainer.classList.contains('semester')) {
        const semesterText = targetContainer.querySelector('.semesterHead').textContent;
        const semesterNumber = parseInt(semesterText.match(/\d+/)[0]);

        if (!isParityValid(courseElement, semesterNumber)) {
            alert('Este curso solo puede ser dictado en otro semestre debido a su paridad');
            if (placeholder.parentNode) {
                placeholder.parentNode.removeChild(placeholder);
            }
            return;
        }

        if (!checkPrerequisites(courseId, targetContainer)) {
            const course = findCourseData(courseId);
            if (!course) return;

            let message = `No puedes tomar ${course.name_stylized} porque no cumples con los requisitos necesarios.\n\n`;

            const mainAlternatives = course.prereq.split(' o ');
            
            const prereqMessages = mainAlternatives.map(alternative => {
                if (alternative.includes(' y ')) {
                    const courses = alternative.split(' y ');
                    const cleanCourses = courses.map(c => c.replace(/[()]/g, '').trim());
                    return `• Necesitas haber tomado ${cleanCourses.join(' y ')} previamente`;
                } else {
                    const cleanCourse = alternative.replace(/[()]/g, '').trim();
                    if (cleanCourse.includes('(c)')) {
                        const courseId = cleanCourse.replace('(c)', '');
                        return `• Necesitas haber tomado ${courseId} o tomarlo en el mismo semestre`;
                    }
                    return `• Necesitas haber tomado ${cleanCourse} previamente`;
                }
            });

            message += prereqMessages.join('\n o \n');
            alert(message.trim());
            
            if (placeholder.parentNode) {
                placeholder.parentNode.removeChild(placeholder);
            }
            return;
        }
    }

    placeholder.parentNode.insertBefore(courseElement, placeholder);

    if (placeholder.parentNode) {
        placeholder.parentNode.removeChild(placeholder);
    }

    if (targetContainer.classList.contains('semester')) {
        const semesterNumber = parseInt(targetContainer.querySelector('.semesterHead').textContent.match(/\d+/)[0]);
        if (semesterNumber >= 9) {
            updateCoursePoolWidth();
        }
    }

    saveState();
}

function handleDragStart(event) {
    const courseElement = event.currentTarget;
    courseElement.classList.add('dragging');

    document.querySelectorAll('.prereq-tooltip').forEach(tooltip => {
        tooltip.style.visibility = 'hidden';
        tooltip.style.opacity = '0';
    });

    event.dataTransfer.setData('text/plain', courseElement.id);
    event.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(event) {
    const courseElement = event.currentTarget;
    courseElement.classList.remove('dragging');
    
    document.querySelectorAll('.prereq-tooltip').forEach(tooltip => {
        tooltip.style.visibility = '';
        tooltip.style.opacity = '';
    });
}

function createNewCourseModal() {
    const modal = document.createElement('div');
    modal.classList.add('new-course-modal');

    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal-overlay');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    modalContent.innerHTML = `
        <span class="new-course-modal-close">&times;</span>
        <h2 class="modal-title">Crear nuevo curso</h2>
        <div class="form-element">
            <input type="text" class="course-name-input" placeholder="Nombre del curso">
        </div>
        <div class="form-element">
            <select class="course-type-dropdown">
                <option value="" disabled selected>Seleccionar tipo de curso</option>
                ${Object.entries(legend.spanish.tagMappings).map(([type, label]) => 
                    `<option value="${type}">${label}</option>`
                ).join('')}
            </select>
        </div>
        <div class="form-element">
            <input type="text" class="course-id-input" placeholder="Sigla del curso">
        </div>
        <div class="form-element">
            <input type="text" class="course-cred-input" placeholder="Créditos">
        </div>
        <button class="create-course-btn">Crear curso</button>
    `;

    modal.appendChild(modalContent);
    
    const placeholder = document.createElement('div');
    placeholder.classList.add('course', 'course-placeholder');
    placeholder.innerHTML = `
        <div class="course-placeholder-content">
            <img src="icons/more.png" alt="Add" width="50">
        </div>
    `;

    const showModal = () => {
        console.log('Showing modal'); 
        document.body.appendChild(modalOverlay);
        document.body.appendChild(modal);
        modalOverlay.style.display = 'block';
        modal.style.display = 'block';
    };

    const hideModal = () => {
        modal.style.display = 'none';
        modalOverlay.style.display = 'none';
        document.body.removeChild(modal);
        document.body.removeChild(modalOverlay);
    };

    modalOverlay.addEventListener('click', hideModal);
    modalContent.querySelector('.new-course-modal-close').addEventListener('click', hideModal);
    modalContent.querySelector('.create-course-btn').addEventListener('click', () => {
        const name = modalContent.querySelector('.course-name-input').value;
        const type = modalContent.querySelector('.course-type-dropdown').value;
        const id = modalContent.querySelector('.course-id-input').value;
        const cred = modalContent.querySelector('.course-cred-input').value;

        if (name && type && id && cred) {
            createNewCourse(type, name, id, cred);
            hideModal();
        }
    });

    placeholder.addEventListener('click', () => {
        console.log('Placeholder clicked'); 
        showModal();
    });

    return { modal, placeholder, showModal, hideModal };
}

function newSemester() {
    const semesterPool = document.getElementById('semester-pool');
    const semesters = semesterPool.querySelectorAll('.semester');

    let maxNumber = 8;
    semesters.forEach(semester => {
        const semesterHead = semester.querySelector('.semesterHead');
        const number = parseInt(semesterHead.textContent.match(/\d+/)[0]);
        maxNumber = Math.max(maxNumber, number);
    });

    const newNumber = maxNumber + 1;
    const semesterDiv = createSemester(newNumber);

    const addSemesterBtn = document.getElementById('add-semester-btn');
    semesterPool.insertBefore(semesterDiv, addSemesterBtn);

    updateCoursePoolWidth();
}

function handleAddSemesterClick() {
    const confirmed = window.confirm('¿Añadir un nuevo semestre?');

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
    const collapsibleContainer = document.querySelector('.collapsible-course-pool');
    
    // Toggle las clases expanded
    coursePool.classList.toggle('expanded');
    filters.classList.toggle('expanded');
    toggleText.classList.toggle('expanded');
    collapsibleContainer.classList.toggle('expanded');
    
    // Actualizar el texto del botón
    if (coursePool.classList.contains('expanded')) {
        toggleText.innerHTML = '<span class="rotate180">&#9662;</span> Ocultar cursos disponibles';
        
        setTimeout(() => {
            if (coursePool.scrollHeight > coursePool.clientHeight) {
                coursePool.style.overflowY = 'scroll';
            }
        }, 500);
    } else {
        toggleText.innerHTML = show.spanish;
        coursePool.style.overflowY = 'hidden';
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
        'optsci': '',
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
}

function filterCourses(activeFilters) {
    const searchTerm = document.getElementById('course-search').value.toLowerCase();
    const courses = document.querySelectorAll('#course-pool .course');
    const placeholder = document.querySelector('.course-placeholder');

    courses.forEach(course => {
        if (course.classList.contains('course-placeholder')) {
            return;
        }

        const courseText = course.textContent.toLowerCase();
        const courseType = Array.from(course.classList)
            .find(cls => cls !== 'course');

        const matchesSearch = !searchTerm || courseText.includes(searchTerm);
        const matchesType = activeFilters.size === 0 || activeFilters.has(courseType);

        course.style.display = matchesSearch && matchesType ? 'flex' : 'none';
    });

    if (placeholder) {
        placeholder.style.display = 'flex';
    }
}

window.customCourses = new Set();

function createNewCourse(type, name, id, cred) {
    const course = {
        type,
        name_stylized: name,
        id,
        cred,
        prereq: '',
    };

    const courseElement = createCourse(course);
    courseElement.classList.add(type);

    window.customCourses.add(id);

    const placeholder = document.querySelector('.course-placeholder');

    if (placeholder && placeholder.parentNode) {
        placeholder.parentNode.insertBefore(courseElement, placeholder.nextSibling);
    } else {
        document.getElementById('course-pool').appendChild(courseElement);
    }

    const filterTags = document.querySelectorAll('.filter-tag.active');
    filterTags.forEach(tag => {
        tag.classList.remove('active');
    });

    const searchInput = document.getElementById('course-search');
    if (searchInput) {
        searchInput.value = '';
    }

    filterCourses(new Set());

    saveState();
}

function saveState() {
    const state = {
        semesters: [],
        coursePool: [],
        customCourses: [],
        semesterCount: 0,
        coursePoolVisible: document.getElementById('course-pool').style.display === 'flex'
    };

    const semesterPool = document.getElementById('semester-pool');
    const coursePool = document.getElementById('course-pool');
    const semesterDivs = semesterPool.querySelectorAll('.semester');

    document.querySelectorAll('.course').forEach(course => {
        if (window.customCourses.has(course.id)) {
            state.customCourses.push({
                id: course.id,
                name_stylized: course.querySelector('.course-name').textContent,
                type: Array.from(course.classList).find(cls => cls !== 'course' && cls !== 'taken'),
                cred: course.querySelector('small').textContent.split(' ')[0],
                prereq: ''
            });
        }
    });

    semesterDivs.forEach(semester => {
        const semesterHead = semester.querySelector('.semesterHead');
        const semesterNumber = parseInt(semesterHead.textContent.match(/\d+/)[0]);

        const courses = semester.querySelectorAll('.course');
        const semesterData = {
            number: semesterNumber,
            courses: Array.from(courses)
                .filter(course => !course.classList.contains('course-placeholder'))
                .map(course => ({
                    id: course.id,
                    type: Array.from(course.classList).find(cls => cls !== 'course' && cls !== 'taken'),
                    taken: course.classList.contains('taken')
                }))
        };

        state.semesters.push(semesterData);
    });

    state.coursePool = Array.from(coursePool.querySelectorAll('.course'))
        .filter(course => !course.classList.contains('course-placeholder'))
        .map(course => ({
            id: course.id,
            type: Array.from(course.classList).find(cls => cls !== 'course' && cls !== 'taken'),
            taken: course.classList.contains('taken')
        }));

    state.semesterCount = Math.max(...state.semesters.map(s => s.number), 8);
    localStorage.setItem('coursePlannerState', JSON.stringify(state));
}

function loadState() {
    const savedState = localStorage.getItem('coursePlannerState');
    if (!savedState) return;

    const state = JSON.parse(savedState);
    window.customCourses = new Set(state.customCourses.map(course => course.id));

    // Obtener todas las referencias DOM necesarias
    const semesterPool = document.getElementById('semester-pool');
    const coursePool = document.getElementById('course-pool');
    const filters = document.getElementById('filters');
    const toggleText = document.getElementById('toggle-text');
    const addSemesterBtn = document.getElementById('add-semester-btn');
    const resetSemesterBtn = document.getElementById('reset-btn');

    // Clonar y reemplazar el course pool
    const newCoursePool = coursePool.cloneNode(false);
    coursePool.parentNode.replaceChild(newCoursePool, coursePool);
    
    // Añadir event listeners
    newCoursePool.addEventListener('dragover', allowDrop);
    newCoursePool.addEventListener('drop', handleDrop);

    // Limpiar los contenedores
    semesterPool.innerHTML = '';
    newCoursePool.innerHTML = '';

    // Añadir el placeholder para nuevos cursos
    const modalComponents = createNewCourseModal();
    newCoursePool.appendChild(modalComponents.placeholder);

    // Cargar los semestres ordenados
    state.semesters.sort((a, b) => a.number - b.number);
    
    // Restaurar cada semestre
    state.semesters.forEach(semesterData => {
        const semesterDiv = createSemester(semesterData.number);

        // Restaurar los cursos de cada semestre
        semesterData.courses.forEach(courseData => {
            let courseElement;
            if (window.customCourses.has(courseData.id)) {
                courseElement = createCourseFromPool(courseData.id, state.customCourses);
            } else {
                courseElement = createCourseFromPool(courseData.id);
            }
            
            if (courseElement) {
                if (courseData.taken) {
                    courseElement.classList.add('taken');
                }
                semesterDiv.appendChild(courseElement);
            }
        });

        semesterPool.appendChild(semesterDiv);
    });

    // Restaurar los cursos en el course pool
    state.coursePool.forEach(courseData => {
        let courseElement;
        if (window.customCourses.has(courseData.id)) {
            courseElement = createCourseFromPool(courseData.id, state.customCourses);
        } else {
            courseElement = createCourseFromPool(courseData.id);
        }
        
        if (courseElement) {
            if (courseData.taken) {
                courseElement.classList.add('taken');
            }
            newCoursePool.appendChild(courseElement);
        }
    });

    // Restaurar los botones
    semesterPool.appendChild(addSemesterBtn);
    semesterPool.appendChild(resetSemesterBtn);

    // Inicializar el estado del course pool con las nuevas animaciones
    initializeCoursePoolState(newCoursePool, filters, toggleText, state.coursePoolVisible);

    // Actualizar el número del último semestre
    window.lastSemesterNumber = state.semesterCount;
    
    // Actualizar el ancho del course pool
    updateCoursePoolWidth();
}


function resetPlanner() {
    const confirmed = window.confirm('¿Estás seguro que quieres reiniciar el planner? Todos los cambios se perderán.');

    if (confirmed) {
        localStorage.removeItem('coursePlannerState');

        const coursePool = document.getElementById('course-pool');

        const coursePlaceholder = coursePool.querySelector('.course-placeholder');

        coursePool.innerHTML = '';

        coursePool.appendChild(coursePlaceholder);

        initializeCoursePool();
        initializeSemesters();
        addOptCourses();

        updateCoursePoolWidth();

        document.querySelectorAll('.course').forEach(course => {
            course.classList.remove('taken');
        });
    }
}

function createCourseFromPool(courseId, customCourses = []) {
    const customCourse = customCourses.find(course => course.id === courseId);
    if (customCourse) {
        const courseElement = createCourse({
            id: customCourse.id,
            name_stylized: customCourse.name_stylized,
            type: customCourse.type,
            cred: customCourse.cred,
            prereq: customCourse.prereq
        });
        courseElement.classList.add(customCourse.type);
        return courseElement;
    }

    const allCourses = [...jsonData.flatMap(sem => sem.courses), ...optData.flatMap(opt => opt.courses)];
    const courseData = allCourses.find(course => course.id === courseId);

    if (courseData) {
        return createCourse(courseData);
    }
    return null;
}

document.addEventListener('DOMContentLoaded', function () {
    window.lastSemesterNumber = 8;
    window.customCourses = new Set();

    const coursePool = document.getElementById('course-pool');

    const savedState = localStorage.getItem('coursePlannerState');
    if (savedState) {
        loadState();
    } else {
        initializeCoursePool();
        initializeSemesters();
        addOptCourses();
        
        const modalComponents = createNewCourseModal();
        coursePool.insertBefore(modalComponents.placeholder, coursePool.firstChild);
    }

    createFilterUI();

    const addSemesterBtn = document.getElementById('add-semester-btn');
    addSemesterBtn.addEventListener('click', handleAddSemesterClick);

    const resetSemesterBtn = document.getElementById('reset-btn');
    resetSemesterBtn.addEventListener('click', resetPlanner);

    coursePool.style.display = 'none';
    document.getElementById('filters').style.display = 'none';

    const header = document.getElementById('header');
    header.addEventListener('click', toggleCoursePool);

    ['dragend', 'click'].forEach(eventType => {
        document.addEventListener(eventType, () => {
            saveState();
        });
    });

    window.addEventListener('beforeunload', () => {
        saveState();
    });

    updateCoursePoolWidth();
});

function parsePrerequisites(prereqString) {
    if (!prereqString) return [];
    
    const andGroups = prereqString.split(' y ');
    
    const groups = andGroups.map(group => {
        const orGroup = group.split(' o ');
        return orGroup.map(course => {
            const coreqMatch = course.match(/([A-Z]+\d+)\(c\)/);
            if (coreqMatch) {
                return {
                    id: coreqMatch[1],
                    isCoreq: true
                };
            }
            
            const normalMatch = course.match(/([A-Z]+\d+)/);
            if (normalMatch) {
                return {
                    id: normalMatch[1],
                    isCoreq: false
                };
            }
            
            return null;
        }).filter(item => item !== null);
    });
    
    return groups;
}

function checkPrerequisites(courseId, targetSemesterDiv, checkedCourses = new Set()) {
    if (checkedCourses.has(courseId)) {
        return true;
    }
    checkedCourses.add(courseId);

    const course = findCourseData(courseId);
    if (!course || !course.prereq) {
        return true;
    }

    const prereqGroups = parsePrerequisites(course.prereq);
    
    for (const orGroup of prereqGroups) {
        const orGroupSatisfied = orGroup.some(prereq => {
            if (prereq.isCoreq) {
                return isInPreviousSemester(prereq.id, targetSemesterDiv) || 
                       isInSameSemester(prereq.id, targetSemesterDiv);
            } else {
                return isInPreviousSemester(prereq.id, targetSemesterDiv) && 
                       checkPrerequisites(prereq.id, targetSemesterDiv, checkedCourses);
            }
        });

        if (!orGroupSatisfied) {
            return false;
        }
    }

    return true;
}

function findCourseData(courseId) {
    for (const semester of jsonData) {
        const course = semester.courses.find(c => c.id === courseId);
        if (course) return course;
    }
    
    for (const optGroup of optData) {
        const course = optGroup.courses.find(c => c.id === courseId);
        if (course) return course;
    }
    
    return null;
}

function isInSameSemester(courseId, semesterDiv) {
    if (!semesterDiv) return false;
    
    const courses = Array.from(semesterDiv.querySelectorAll('.course'));
    const draggedCourse = document.querySelector('.course.dragging');
    
    if (draggedCourse && draggedCourse.id === courseId && 
        draggedCourse.closest('.semester') === semesterDiv) {
        return true;
    }
    
    return courses.some(course => course.id === courseId && !course.classList.contains('dragging'));
}

function getSemesterNumber(element) {
    const semesterDiv = element.closest('.semester');
    if (!semesterDiv) return null;
    const semesterText = semesterDiv.querySelector('.semesterHead').textContent;
    return parseInt(semesterText.match(/\d+/)[0]);
}

function isInPreviousSemester(courseId, targetSemesterDiv) {
    const targetSemesterNumber = getSemesterNumber(targetSemesterDiv);
    if (!targetSemesterNumber) return false;

    const course = document.getElementById(courseId);
    if (!course) return false;

    const courseSemesterNumber = getSemesterNumber(course);
    return courseSemesterNumber && courseSemesterNumber < targetSemesterNumber;
}

function initializeCoursePoolState(coursePool, filters, toggleText, isVisible) {
    const collapsibleContainer = document.querySelector('.collapsible-course-pool');
    
    if (isVisible) {
        coursePool.classList.add('expanded');
        filters.classList.add('expanded');
        toggleText.classList.add('expanded');
        collapsibleContainer.classList.add('expanded');
        toggleText.innerHTML = '<span class="rotate180">&#9662;</span> Ocultar cursos disponibles';
        
        setTimeout(() => {
            if (coursePool.scrollHeight > coursePool.clientHeight) {
                coursePool.style.overflowY = 'scroll';
            }
        }, 500);
    } else {
        coursePool.classList.remove('expanded');
        filters.classList.remove('expanded');
        toggleText.classList.remove('expanded');
        collapsibleContainer.classList.remove('expanded');
        toggleText.innerHTML = show.spanish;
        coursePool.style.overflowY = 'hidden';
    }
}