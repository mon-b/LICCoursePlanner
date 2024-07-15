const jsonData = [
    {
        "sem": 1,
        "courses": [
            {
                "id": "IIC1103",
                "name": "INTRODUCCIÓN A LA PROGRAMACIÓN",
                "prereq": null,
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
                "prereq": null,
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
                "prereq": null,
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
                "prereq": null,
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
                "prereq": null,
                "cred": "10",
                "hide": false,
                "parity": "both",
                "type": "ofg",
                "name_stylized": "Filosofía: ¿Para Qué?",
                "number": 5
            },
            {
                "id": "VRA100C",
                "name": "EXAMEN DE COMUNICACIÓN ESCRITA",
                "prereq": null,
                "cred": "0",
                "hide": true,
                "parity": "both",
                "type": "general",
                "name_stylized": "Examen de Comunicación Escrita",
                "number": 6
            }
        ]
    },
    {
        "sem": 2,
        "courses": [
            {
                "id": "IIC1253",
                "name": "MATEMÁTICAS DISCRETAS",
                "prereq": "MAT1203 o (IIC1001 y MAT1207)",
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
                "prereq": "IIC1103",
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
                "prereq": "MAT1107",
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
                "prereq": null,
                "cred": "10",
                "hide": false,
                "parity": "both",
                "type": "ofg",
                "name_stylized": "Formación Teológica",
                "number": 11
            },
            {
                "id": "VRA3010",
                "name": "ENGLISH TEST ALTE 3",
                "prereq": null,
                "cred": "0",
                "hide": true,
                "parity": "both",
                "type": "general",
                "name_stylized": "English Test ALTE 3",
                "number": 12
            }
        ]
    },
    {
        "sem": 3,
        "courses": [
            {
                "id": "IIC2133",
                "name": "ESTRUCTURAS DE DATOS Y ALGORITMOS",
                "prereq": "IIC1253 y IIC2233",
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
                "prereq": "IIC2233",
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
                "prereq": "MAT1207",
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
                "prereq": null,
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
                "id": "EYP1050",
                "name": "MODELOS PROBABILÍSTICOS",
                "prereq": null,
                "cred": "10",
                "hide": false,
                "parity": "even",
                "type": "fmat",
                "name_stylized": "Modelos Probabilísticos",
                "number": 18
            },
            {
                "id": "IIC2143",
                "name": "INGENIERÍA DE SOFTWARE",
                "prereq": "IIC2233",
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
                "prereq": "IIC1253 y IIC2133",
                "cred": "10",
                "hide": false,
                "parity": "even",
                "type": "major",
                "name_stylized": "Autómatas y Compiladores",
                "number": 20
            },
            {
                "id": "IIC2333",
                "name": "SISTEMAS OPERATIVOS Y REDES",
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
                "prereq": null,
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
                "prereq": "IIC2343 y IIC2224",
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
                "prereq": "IIC1253",
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
                "prereq": "IIC2413",
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
                "prereq": null,
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
                "prereq": null,
                "cred": "10",
                "hide": false,
                "parity": null,
                "type": "ofg",
                "name_stylized": "OFG",
                "number": 27
            },
            {
                "id": "IIC2001",
                "name": "PRÁCTICA DE CIENCIA DE LA COMPUTACIÓN",
                "prereq": "IIC2143 o IIC2142",
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
        "sem": 6,
        "courses": [
            {
                "id": "IIC2613",
                "name": "INTELIGENCIA ARTIFICIAL",
                "prereq": "(EYP1113 y IIC2233) o (EYP1025 y IIC2233) o (AST0212 y IIC2233)",
                "cred": "10",
                "hide": false,
                "type": "major",
                "name_stylized": "Inteligencia Artificial",
                "number": 29
            },
            {
                "id": "IIC2283",
                "name": "DISEÑO Y ANÁLISIS DE ALGORITMOS",
                "prereq": "IIC2133",
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
                "prereq": "IIC2333",
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
                "prereq": null,
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
                "prereq": null,
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
                "prereq": "IIC2333",
                "cred": "10",
                "hide": false,
                "parity": "odd",
                "type": "major",
                "name_stylized": "Sistemas Distribuidos",
                "number": 34
            },
            {
                "id": "IIC2182",
                "name": "INTERFACES Y EXPERIENCIA DE USUARIO",
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
                "prereq": null,
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
                "prereq": null,
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
                "prereq": null,
                "cred": "10",
                "hide": false,
                "parity": null,
                "type": "ofg",
                "name_stylized": "OFG",
                "number": 38
            }
        ]
    },
    {
        "sem": 8,
        "courses": [
            {
                "id": "IIC2164",
                "name": "PROYECTO DE INNOVACIÓN Y COMPUTACIÓN",
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
                "prereq": null,
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
                "prereq": null,
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
                "prereq": null,
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
                "prereq": null,
                "cred": "10",
                "hide": false,
                "parity": null,
                "type": "ofg",
                "name_stylized": "OFG",
                "number": 43
            }
        ]
    }
]

export default jsonData