import { Semester } from '../types/course';

export const defaultData: Semester[] = [
  {
    "sem": 1,
    "courses": [
      {
        "id": "IIC1103",
        "name": "INTRODUCCIÓN A LA PROGRAMACIÓN",
        "name_english": "Introduction to Programming",
        "prereq": "null",
        "cred": "10",
        "hide": false,
        "parity": "both",
        "type": "dcc",
        "name_stylized": "Introducción a la Programación",
        "number": 1
      },
      {
        "id": "IIC1001",
        "name": "ALGORITMOS Y SISTEMAS COMPUTACIONALES",
        "name_english": "Algorithms and Computer Systems",
        "prereq": "null",
        "cred": "5",
        "hide": false,
        "parity": "odd",
        "type": "dcc",
        "name_stylized": "Algoritmos y Sistemas Computacionales",
        "number": 2
      },
      {
        "id": "MAT1107",
        "name": "INTRODUCCIÓN AL CÁLCULO",
        "name_english": "Introduction to Calculus",
        "prereq": "null",
        "cred": "10",
        "hide": false,
        "parity": "both",
        "type": "fmat",
        "name_stylized": "Introducción al Cálculo",
        "number": 3
      },
      {
        "id": "MAT1207",
        "name": "INTRODUCCIÓN AL ÁLGEBRA Y GEOMETRÍA",
        "name_english": "Introduction to Algebra and Geometry",
        "prereq": "null",
        "cred": "10",
        "hide": false,
        "parity": "both",
        "type": "fmat",
        "name_stylized": "Introducción al Álgebra y Geometría",
        "number": 4
      },
      {
        "id": "FIL2001",
        "name": "FILOSOFÍA: ¿PARA QUÉ?",
        "name_english": "Philosophy: What For?",
        "prereq": "null",
        "cred": "10",
        "hide": false,
        "parity": "both",
        "type": "ofg",
        "name_stylized": "Filosofía: ¿Para Qué?",
        "number": 5
      }
    ]
  },
  {
    "sem": 2,
    "courses": [
      {
        "id": "IIC1253",
        "name": "MATEMÁTICAS DISCRETAS",
        "name_english": "Discrete Mathematics",
        "prereq": "MAT1203 o IMT2210 o (IIC1001 y MAT1207)",
        "cred": "10",
        "hide": false,
        "parity": "both",
        "type": "dcc",
        "name_stylized": "Matemáticas Discretas",
        "number": 7
      },
      {
        "id": "IIC2233",
        "name": "PROGRAMACIÓN AVANZADA",
        "name_english": "Advanced Programming",
        "prereq": "IIC1103 o IIC1102",
        "cred": "10",
        "hide": false,
        "parity": "both",
        "type": "dcc",
        "name_stylized": "Programación Avanzada",
        "number": 8
      },
      {
        "id": "IIC2343",
        "name": "ARQUITECTURA DE COMPUTADORES",
        "name_english": "Computer Architecture",
        "prereq": "IIC2233(c)",
        "cred": "10",
        "hide": false,
        "parity": "both",
        "type": "dcc",
        "name_stylized": "Arquitectura de Computadores",
        "number": 9
      },
      {
        "id": "MAT1610",
        "name": "CÁLCULO I",
        "name_english": "Calculus I",
        "prereq": "MAT1000 o MAT1107",
        "cred": "10",
        "hide": false,
        "parity": "both",
        "type": "fmat",
        "name_stylized": "Cálculo I",
        "number": 10
      },
      {
        "id": "TEO123",
        "name": "FORMACIÓN TEOLÓGICA",
        "name_english": "Theological Formation",
        "prereq": "null",
        "cred": "10",
        "hide": false,
        "parity": "both",
        "type": "ofg",
        "name_stylized": "Formación Teológica",
        "number": 11
      }
    ]
  },
  {
    "sem": 3,
    "courses": [
      {
        "id": "IIC2133",
        "name": "ESTRUCTURAS DE DATOS Y ALGORITMOS",
        "name_english": "Data Structures and Algorithms",
        "prereq": "(IIC1253 y IIC2233) o ICS2122 o IRB2002 o IDI2025 o IBM2123 o IIC2154",
        "cred": "10",
        "hide": false,
        "parity": "both",
        "type": "dcc",
        "name_stylized": "Estructuras de Datos y Algoritmos",
        "number": 13
      },
      {
        "id": "IIC2413",
        "name": "BASES DE DATOS",
        "name_english": "Databases",
        "prereq": "IIC2233 o (IIC1222 y IIC2252) o ICS2122 o IRB2002 o IDI2025 o IBM2123",
        "cred": "10",
        "hide": false,
        "parity": "both",
        "type": "dcc",
        "name_stylized": "Bases de Datos",
        "number": 14
      },
      {
        "id": "MAT1620",
        "name": "CÁLCULO II",
        "name_english": "Calculus II",
        "prereq": "MAT1610",
        "cred": "10",
        "hide": false,
        "parity": "both",
        "type": "fmat",
        "name_stylized": "Cálculo II",
        "number": 15
      },
      {
        "id": "MAT1203",
        "name": "ÁLGEBRA LINEAL",
        "name_english": "Linear Algebra",
        "prereq": "MAT1600 o MAT1207",
        "cred": "10",
        "hide": false,
        "parity": "both",
        "type": "fmat",
        "name_stylized": "Álgebra Lineal",
        "number": 16
      },
      {
        "id": "OFG1",
        "name": "OFG",
        "name_english": "General Training Course",
        "prereq": "null",
        "cred": "10",
        "hide": false,
        "parity": null,
        "type": "ofg",
        "name_stylized": "OFG",
        "number": 17
      }
    ]
  },
  {
    "sem": 4,
    "courses": [
      {
        "id": "EYP1025",
        "name": "MODELOS PROBABILÍSTICOS",
        "name_english": "Probabilistic Models",
        "prereq": "(EYP1015 y MAT1135) o (EYP1015 y MAT1630) o (IMT2220 y IMT2230) o (IIC1253 y MAT1620)",
        "cred": "10",
        "hide": false,
        "parity": "both",
        "type": "fmat",
        "name_stylized": "Modelos Probabilísticos",
        "number": 18
      },
      {
        "id": "IIC2143",
        "name": "INGENIERÍA DE SOFTWARE",
        "name_english": "Software Engineering",
        "prereq": "IIC2413 o ICS2122 o IRB2002 o IDI2025 o IBM2123",
        "cred": "10",
        "hide": false,
        "parity": "both",
        "type": "dcc",
        "name_stylized": "Ingeniería de Software",
        "number": 19
      },
      {
        "id": "IIC2224",
        "name": "AUTÓMATAS Y COMPILADORES",
        "name_english": "Automata and Compilers",
        "prereq": "(IIC1253 o IIC2252) y (IIC2133 o IIC2132)",
        "cred": "10",
        "hide": false,
        "parity": "both",
        "type": "major",
        "name_stylized": "Autómatas y Compiladores",
        "number": 20
      },
      {
        "id": "IIC2333",
        "name": "SISTEMAS OPERATIVOS Y REDES",
        "name_english": "Operating Systems and Networks",
        "prereq": "IIC2343",
        "cred": "10",
        "hide": false,
        "parity": "both",
        "type": "major",
        "name_stylized": "Sistemas Operativos y Redes",
        "number": 21
      },
      {
        "id": "OFG2",
        "name": "OFG",
        "name_english": "General Training Course",
        "prereq": "null",
        "cred": "10",
        "hide": false,
        "parity": null,
        "type": "ofg",
        "name_stylized": "OFG",
        "number": 22
      }
    ]
  },
  {
    "sem": 5,
    "courses": [
      {
        "id": "IIC2560",
        "name": "FUNDAMENTOS DE LENGUAJES DE PROGRAMACIÓN",
        "name_english": "Programming Languages Fundamentals",
        "prereq": "(IIC2343 o IIC2342) y (IIC2224 o IIC2223)",
        "cred": "10",
        "hide": false,
        "parity": "odd",
        "type": "major",
        "name_stylized": "Fundamentos de Lenguajes de Programación",
        "number": 23
      },
      {
        "id": "IIC2214",
        "name": "TEORÍA DE LA COMPUTACIÓN",
        "name_english": "Theory of Computation",
        "prereq": "IIC1253 o IIC2252",
        "cred": "10",
        "hide": false,
        "parity": "odd",
        "type": "major",
        "name_stylized": "Teoría de la Computación",
        "number": 24
      },
      {
        "id": "IIC2513",
        "name": "TECNOLOGÍAS Y APLICACIONES WEB",
        "name_english": "Web Technologies and Applications",
        "prereq": "IIC2143 o ICS2122 o IRB2002 o IDI2025 o IBM2123",
        "cred": "10",
        "hide": false,
        "parity": "both",
        "type": "major",
        "name_stylized": "Tecnologías y Aplicaciones Web",
        "number": 25
      },
      {
        "id": "OPTC1",
        "name": "OPTATIVO DE CIENCIAS",
        "name_english": "Science Elective",
        "prereq": "null",
        "cred": "10",
        "hide": false,
        "parity": null,
        "type": "opt",
        "name_stylized": "Optativo de Ciencias",
        "number": 26
      },
      {
        "id": "OFG3",
        "name": "OFG",
        "name_english": "General Training Course",
        "prereq": "null",
        "cred": "10",
        "hide": false,
        "parity": null,
        "type": "ofg",
        "name_stylized": "OFG",
        "number": 27
      }
    ]
  },
  {
    "sem": 6,
    "courses": [
      {
        "id": "IIC2613",
        "name": "INTELIGENCIA ARTIFICIAL",
        "name_english": "Artificial Intelligence",
        "prereq": "(EYP1113 y IIC2233) o (EYP1025 y IIC2233) o (AST0212 y IIC2233) o ICS2122 o IRB2002 o IDI2025 o IBM2123",
        "cred": "10",
        "hide": false,
        "parity": "both",
        "type": "major",
        "name_stylized": "Inteligencia Artificial",
        "number": 29
      },
      {
        "id": "IIC2283",
        "name": "DISEÑO Y ANÁLISIS DE ALGORITMOS",
        "name_english": "Algorithm Design and Analysis",
        "prereq": "IIC2133 o (IIC2132 y IIC2212) o ICS2122 o IRB2002 o IDI2025 o IBM2123",
        "cred": "10",
        "hide": false,
        "parity": "even",
        "type": "major",
        "name_stylized": "Diseño y Análisis de Algoritmos",
        "number": 30
      },
      {
        "id": "IIC2531",
        "name": "SEGURIDAD COMPUTACIONAL",
        "name_english": "Computer Security",
        "prereq": "(IIC2333 o IIC2512) o (IIC2133 o IIC2132)",
        "cred": "10",
        "hide": false,
        "parity": "even",
        "type": "major",
        "name_stylized": "Seguridad Computacional",
        "number": 31
      },
      {
        "id": "ETI1001",
        "name": "ÉTICA PARA LA CS DE LA COMPUTACIÓN",
        "name_english": "Ethics for Computer Science",
        "prereq": "(IIC2143 o IIC2142) y IIC2513",
        "cred": "10",
        "hide": false,
        "parity": "even",
        "type": "eti",
        "name_stylized": "Ética para la Cs de la Computación",
        "number": 32
      },
      {
        "id": "OFG4",
        "name": "OFG",
        "name_english": "General Training Course",
        "prereq": "null",
        "cred": "10",
        "hide": false,
        "parity": null,
        "type": "ofg",
        "name_stylized": "OFG",
        "number": 33
      }
    ]
  },
  {
    "sem": 7,
    "courses": [
      {
        "id": "IIC2523",
        "name": "SISTEMAS DISTRIBUIDOS",
        "name_english": "Distributed Systems",
        "prereq": "IIC2333 o (IIC1222 y IIC2342) o ICS2122 o IRB2002 o IDI2025 o IBM2123 o IIC2154",
        "cred": "10",
        "hide": false,
        "parity": "both",
        "type": "major",
        "name_stylized": "Sistemas Distribuidos",
        "number": 34
      },
      {
        "id": "IIC2182",
        "name": "INTERFACES Y EXPERIENCIA DE USUARIO",
        "name_english": "User Interfaces and Experience",
        "prereq": "IIC2513",
        "cred": "10",
        "hide": false,
        "parity": "odd",
        "type": "major",
        "name_stylized": "Interfaces y Experiencia de Usuario",
        "number": 35
      },
      {
        "id": "OPT01",
        "name": "OPT",
        "name_english": "Elective Course",
        "prereq": "null",
        "cred": "10",
        "hide": false,
        "parity": null,
        "type": "opt",
        "name_stylized": "OPT",
        "number": 36
      },
      {
        "id": "OPT02",
        "name": "OPT",
        "name_english": "Elective Course",
        "prereq": "null",
        "cred": "10",
        "hide": false,
        "parity": null,
        "type": "opt",
        "name_stylized": "OPT",
        "number": 37
      },
      {
        "id": "OFG5",
        "name": "OFG",
        "name_english": "General Training Course",
        "prereq": "null",
        "cred": "10",
        "hide": false,
        "parity": null,
        "type": "ofg",
        "name_stylized": "OFG",
        "number": 38
      },
      {
        "id": "IIC2002",
        "name": "PRÁCTICA DE CIENCIA DE LA COMPUTACIÓN",
        "name_english": "Computer Science Internship",
        "prereq": "(IIC2513 o IIC2531 o IIC2613 o IIC2612) y ETI1001",
        "cred": "5",
        "hide": false,
        "parity": null,
        "type": "dcc",
        "name_stylized": "Práctica de Ciencia de la Computación",
        "number": 28
      }
    ]
  },
  {
    "sem": 8,
    "courses": [
      {
        "id": "IIC2164",
        "name": "PROYECTO DE INNOVACIÓN Y COMPUTACIÓN",
        "name_english": "Innovation and Computing Project",
        "prereq": "ETI1001 y IIC2182 y IIC2531",
        "cred": "10",
        "hide": false,
        "parity": "even",
        "type": "dcc",
        "name_stylized": "Proyecto de Innovación y Computación",
        "number": 39
      },
      {
        "id": "OPT04",
        "name": "OPT",
        "name_english": "Elective Course",
        "prereq": "null",
        "cred": "10",
        "hide": false,
        "parity": null,
        "type": "opt",
        "name_stylized": "OPT",
        "number": 40
      },
      {
        "id": "OPT05",
        "name": "OPT",
        "name_english": "Elective Course",
        "prereq": "null",
        "cred": "10",
        "hide": false,
        "parity": null,
        "type": "opt",
        "name_stylized": "OPT",
        "number": 41
      },
      {
        "id": "OPT06",
        "name": "OPT",
        "name_english": "Elective Course",
        "prereq": "null",
        "cred": "10",
        "hide": false,
        "parity": null,
        "type": "opt",
        "name_stylized": "OPT",
        "number": 42
      },
      {
        "id": "OFG6",
        "name": "OFG",
        "name_english": "General Training Course",
        "prereq": "null",
        "cred": "10",
        "hide": false,
        "parity": null,
        "type": "ofg",
        "name_stylized": "OFG",
        "number": 43
      }
    ]
  }
];
