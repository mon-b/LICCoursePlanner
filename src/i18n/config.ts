import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
const resources = {
  en: {
    translation: {
      title: "LICCoursePlanner",
      subtitle: "Interactive course planner for UC Chile's Computer Science degree",
      goToPlanner: "Go to Planner",
      semester: "Semester",
      showCoursePool: "Show available courses",
      hideCoursePool: "Hide courses",
      credits: "credits",
      addSemester: "Add Semester",
      deleteSemester: "Delete Semester",
      resetPlanner: "Reset Planner",
      resetPlan: "Reset Planner",
      exportPNG: "Save as PNG",
      confirmAddSemester: "Add a new semester?",
      confirmDeleteSemester: "Delete this semester?",
      confirmReset: "Are you sure you want to reset the planner? All changes will be lost.",
      searchPlaceholder: "Search by name or code",
      createCourse: "Create Course",
      createCustomCourse: "Create Custom Course",
      editCourse: "Edit Course",
      closeEditor: "Close Editor",
      save: "Save",
      courseName: "Course Name",
      courseCode: "Course Code",
      courseCredits: "Credits",
      courseType: "Course Type",
      selectCourseType: "Select course type",
      noPrerequisites: "No prerequisites",
      prerequisitesError: "You cannot take {{course}} because you don't meet the necessary requirements.",
      prerequisiteMultiple: "You need to have taken {{courses}} previously",
      prerequisiteSingle: "You need to have taken {{course}} previously",
      prerequisiteCorequisite: "You need to have taken {{course}} or take it in the same semester",
      prerequisiteCredits: "You need to have accumulated at least {{credits}} credits previously",
      prerequisiteOr: "or",
      parityError: "This course can only be taught in another semester due to its parity",
      availableCourses: "Available Courses",
      noCoursesFound: "No courses found matching your criteria",
      dropCoursesHere: "Drop courses here",
      choosePalette: "Choose color palette",
      palettes: {
        "soft-pastel": "Soft Pastels",
        "original": "Original"
      },
      categories: {
        all: "All Courses",
        core: "Curriculum Courses",
        math: "Mathematics",
        electives: "Electives",
        general: "General",
        english: "English requirements"
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
        edit: {
          title: "Edit Available OPR and OPT",
          description: "Customize the list of elective courses according to your own interests and plan."
        },
        create : {
          title: "Create Custom Courses",
          description: "Add your own custom courses to the planner."
        }
      },
      disclaimer: "The planner is still under development. Prerequisites or specific course details may be incorrect. Always verify official university information.",
      footerText: "Made with 💖 by",
      footerAnd: "&",
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
        optbio: "OPT Biology",
        engdiag: "English Diagnostic Test",
        engcour: "English Courses"
      },
      footer: "Made with 💖 by <a href=\"https://instagram.com/w1ndtempos\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"color: #8b45ff; text-decoration: none; font-weight: 600;\">Mon 🌸</a> and <a href=\"https://www.instagram.com/fercooncha\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"color: #8b45ff; text-decoration: none; font-weight: 600;\">fña🧙‍♂️</a>",
      progress: "Progress: {{percent}}% ({{completed}}/{{total}} credits)"
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
      resetPlan: "Reiniciar Planner",
      exportPNG: "Guardar Como PNG",
      confirmAddSemester: "¿Añadir un nuevo semestre?",
      confirmDeleteSemester: "¿Quieres eliminar este semestre?",
      confirmReset: "¿Estás seguro que quieres reiniciar el planner? Todos los cambios se perderán.",
      searchPlaceholder: "Buscar por nombre o sigla",
      createCourse: "Crear Curso",
      createCustomCourse: "Crear Curso Personalizado",
      editCourse: "Editar Curso",
      closeEditor: "Cerrar Editor",
      save: "Guardar",
      courseName: "Nombre del curso",
      courseCode: "Sigla del curso",
      courseCredits: "Créditos",
      courseType: "Tipo de curso",
      selectCourseType: "Seleccionar tipo de curso",
      noPrerequisites: "Sin prerrequisitos",
      prerequisitesError: "No puedes tomar {{course}} porque no cumples con los requisitos necesarios.",
      prerequisiteMultiple: "Necesitas haber tomado {{courses}} previamente",
      prerequisiteSingle: "Necesitas haber tomado {{course}} previamente",
      prerequisiteCorequisite: "Necesitas haber tomado {{course}} o tomarlo en el mismo semestre",
      prerequisiteCredits: "Necesitas haber acumulado al menos {{credits}} créditos previamente",
      prerequisiteOr: "o",
      parityError: "Este curso solo puede ser dictado en otro semestre debido a su paridad",
      availableCourses: "Cursos Disponibles",
      noCoursesFound: "No se encontraron cursos que coincidan con los criterios",
      dropCoursesHere: "Suelta cursos aquí",
      choosePalette: "Elegir paleta de colores",
      palettes: {
        "soft-pastel": "Soft Pastels",
        "original": "Original"
      },
      categories: {
        all: "Todos los Cursos",
        core: "Cursos Malla",
        math: "Matemáticos",
        electives: "Electivos",
        general: "Formación General",
        english: "Requisito Inglés"
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
        edit: {
          title: "Edita OPR y OPT disponibles",
          description: "Personaliza la lista de ramos optativos según tus propios intereses y plan."
        },
        create : {
          title: "Crear Ramos Personalizados",
          description: "Agrega tus propios ramos personalizados al planner."
        }
      },
      disclaimer: "El planner aún está en desarrollo. Los prerrequisitos o detalles de los ramos pueden ser incorrectos. Verifica siempre la información oficial de la universidad.",
      footer: "Hecho con 💖 por <a href=\"https://instagram.com/w1ndtempos\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"color: #8b45ff; text-decoration: none; font-weight: 600;\">Mon 🌸</a> y <a href=\"https://www.instagram.com/fercooncha\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"color: #8b45ff; text-decoration: none; font-weight: 600;\">fña🧙‍♂️</a>",
      progress: "Progreso: {{percent}}% ({{completed}}/{{total}} créditos)",
      footerText: "Hecho con 💖 por",
      footerAnd: "y",
      courseTypes: {
        fmat: "Matemáticos",
        dcc: "Mínimos Computación",
        major: "Major Computación",
        ofg: "Formación General",
        eti: "Ética",
        opt: "OPT",
        optcomp: "OPR Computación",
        "opt-cien": "OPT Ciencias",
        optcom: "OPR Comunicación",
        "opt-mat": "OPR Matemáticos",
        optlet: "OPR Letras",
        econ: "OPR Economía",
        "opt-ast": "OPR Astronomía",
        optbio: "OPR Biología",
        engdiag: "Diagnóstico Inglés",
        engcour: "Cursos de Inglés",
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