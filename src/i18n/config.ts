import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      title: "LICCoursePlanner",
      subtitle: "Course planner for Computer Science Degree UC",
      goToPlanner: "Go to Planner",
      semester: "Semester",
      showCoursePool: "Show available courses",
      hideCoursePool: "Hide courses",
      credits: "credits",
      addSemester: "Add Semester",
      deleteSemester: "Delete Semester",
      resetPlanner: "Reset Planner",
      resetPlan: "Reset Plan",
      confirmAddSemester: "Add a new semester?",
      confirmDeleteSemester: "Delete this semester?",
      confirmReset: "Are you sure you want to reset the planner? All changes will be lost.",
      searchPlaceholder: "Search by name or code",
      createCourse: "Create Course",
      createCustomCourse: "Create Custom Course",
      courseName: "Course Name",
      courseCode: "Course Code",
      courseCredits: "Credits",
      courseType: "Course Type",
      selectCourseType: "Select course type",
      noPrerequisites: "No prerequisites",
      prerequisitesError: "You cannot take {{course}} because you don't meet the necessary requirements.",
      parityError: "This course can only be taught in another semester due to its parity",
      availableCourses: "Available Courses",
      noCoursesFound: "No courses found matching your criteria",
      dropCoursesHere: "Drop courses here",
      categories: {
        all: "All Courses",
        core: "Core CS",
        math: "Mathematics",
        electives: "Electives",
        general: "General"
      },
      features: {
        dragDrop: {
          title: "Drag and Drop",
          description: "Drag and drop courses to create your personalized study plan."
        },
        prerequisites: {
          title: "Course Prerequisites",
          description: "Visualize the prerequisites for each course."
        },
        classification: {
          title: "Course Classification",
          description: "Courses separated by area of interest."
        }
      },
      disclaimer: "The planner is still under development, so prerequisites or specific course details may be incorrect. Always verify official university information.",
      courseTypes: {
        fmat: "Math",
        dcc: "Min CS",
        major: "Major CS",
        ofg: "General Training",
        eti: "Ethics",
        opt: "OPT",
        optcomp: "OPT CS",
        "opt-cien": "OPT Science",
        optcom: "OPT Communication",
        "opt-mat": "OPT Math",
        optlet: "OPT Literature",
        econ: "OPT Economics",
        "opt-ast": "OPT Astronomy",
        optbio: "OPT Biology"
      }
    }
  },
  es: {
    translation: {
      title: "LICCoursePlanner",
      subtitle: "Planificador de ramos para Licenciatura en Ciencias de la Computación UC",
      goToPlanner: "Ir al Planner",
      semester: "Semestre",
      showCoursePool: "Mostrar cursos disponibles",
      hideCoursePool: "Ocultar cursos",
      credits: "créditos",
      addSemester: "Añadir Semestre",
      deleteSemester: "Eliminar Semestre",
      resetPlanner: "Reiniciar Planner",
      resetPlan: "Reiniciar Plan",
      confirmAddSemester: "¿Añadir un nuevo semestre?",
      confirmDeleteSemester: "¿Quieres eliminar este semestre?",
      confirmReset: "¿Estás seguro que quieres reiniciar el planner? Todos los cambios se perderán.",
      searchPlaceholder: "Buscar por nombre o sigla",
      createCourse: "Crear Curso",
      createCustomCourse: "Crear Curso Personalizado",
      courseName: "Nombre del curso",
      courseCode: "Sigla del curso",
      courseCredits: "Créditos",
      courseType: "Tipo de curso",
      selectCourseType: "Seleccionar tipo de curso",
      noPrerequisites: "Sin prerrequisitos",
      prerequisitesError: "No puedes tomar {{course}} porque no cumples con los requisitos necesarios.",
      parityError: "Este curso solo puede ser dictado en otro semestre debido a su paridad",
      availableCourses: "Cursos Disponibles",
      noCoursesFound: "No se encontraron cursos que coincidan con los criterios",
      dropCoursesHere: "Suelta cursos aquí",
      categories: {
        all: "Todos los Cursos",
        core: "CS Centrales",
        math: "Matemáticas",
        electives: "Electivos",
        general: "Generales"
      },
      features: {
        dragDrop: {
          title: "Drag and Drop",
          description: "Arrastra y suelta los ramos para crear tu plan de estudio personalizado."
        },
        prerequisites: {
          title: "Prerrequisitos de Ramos",
          description: "Visualiza los prerrequisitos de cada ramo."
        },
        classification: {
          title: "Clasificación de Ramos",
          description: "Ramos separados por área de interés."
        }
      },
      disclaimer: "El planner aún está en desarrollo, por lo que los prerrequisitos o detalles específicos de los ramos pueden ser erróneos. Verifica siempre la información oficial de la universidad.",
      footer: "Hecho con 💖 por <a href=\"https://instagram.com/w1ndtempos\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"color: #8b45ff; text-decoration: none; font-weight: 600;\">Mon 🌸</a> y <a href=\"https://www.instagram.com/fercooncha\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"color: #8b45ff; text-decoration: none; font-weight: 600;\">fña🧙‍♂️</a>",
      courseTypes: {
        fmat: "Matemáticos",
        dcc: "Mínimos Compu",
        major: "Major Compu",
        ofg: "Formación General",
        eti: "Ética",
        opt: "OPT",
        optcomp: "OPT Computación",
        "opt-cien": "OPT Ciencias",
        optcom: "OPT Comunicación",
        "opt-mat": "OPT Matemáticos",
        optlet: "OPT Letras",
        econ: "OPT Economía",
        "opt-ast": "OPT Astronomía",
        optbio: "OPT Biología"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;