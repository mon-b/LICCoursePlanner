const jsonData = [
    {
        "sem": 1,
        "courses": [
            {
                "id": "IIC1103",
                "name": "INTRODUCCI\u00d3N A LA PROGRAMACI\u00d3N",
                "prereq": null,
                "cred": "10",
                "hide": false,
                "parity": "both",
                "type": "dcc",
                "name_stylized": "Introducci\u00f3n a la Programaci\u00f3n"
            },
            {
                "id": "IIC1001",
                "name": "ALGORITMOS Y SISTEMAS COMPUTACIONALES",
                "prereq": null,
                "cred": "5",
                "hide": false,
                "parity": "odd",
                "type": "dcc",
                "name_stylized": "Algoritmos y Sistemas Computacionales"
            },
            {
                "id": "MAT1107",
                "name": "INTRODUCCI\u00d3N AL C\u00c1LCULO",
                "prereq": null,
                "cred": "10",
                "hide": false,
                "parity": "both",
                "type": "fmat",
                "name_stylized": "Introducci\u00f3n al C\u00e1lculo"
            },
            {
                "id": "MAT1207",
                "name": "INTRODUCCI\u00d3N AL \u00c1LGEBRA Y GEOMETR\u00cdA",
                "prereq": null,
                "cred": "10",
                "hide": false,
                "parity": "both",
                "type": "fmat",
                "name_stylized": "Introducci\u00f3n al \u00c1lgebra y Geometr\u00eda"
            },
            {
                "id": "FIL2001",
                "name": "FILOSOF\u00cdA: \u00bfPARA QU\u00c9?",
                "prereq": null,
                "cred": "10",
                "hide": false,
                "parity": "both",
                "type": "ofg",
                "name_stylized": "Filosof\u00eda: \u00bfPara Qu\u00e9?"
            },
            {
                "id": "VRA100C",
                "name": "EXAMEN DE COMUNICACI\u00d3N ESCRITA",
                "prereq": null,
                "cred": "0",
                "hide": true,
                "parity": "both",
                "type": "general",
                "name_stylized": "Examen de Comunicación Escrita"
            }
        ]
    },
    {
        "sem": 2,
        "courses": [
            {
                "id": "IIC1253",
                "name": "MATEM\u00c1TICAS DISCRETAS",
                "prereq": "MAT1203 o (IIC1001 y MAT1207)",
                "cred": "10",
                "hide": false,
                "parity": "both",
                "type": "dcc",
                "name_stylized": "Matem\u00e1ticas Discretas"
            },
            {
                "id": "IIC2233",
                "name": "PROGRAMACI\u00d3N AVANZADA",
                "prereq": "IIC1103",
                "cred": "10",
                "hide": false,
                "parity": "both",
                "type": "dcc",
                "name_stylized": "Programaci\u00f3n Avanzada"
            },
            {
                "id": "IIC2343",
                "name": "ARQUITECTURA DE COMPUTADORES",
                "prereq": "IIC2233(c)",
                "cred": "10",
                "hide": false,
                "parity": "both",
                "type": "dcc",
                "name_stylized": "Arquitectura de Computadores"
            },
            {
                "id": "MAT1610",
                "name": "C\u00c1LCULO I",
                "prereq": "MAT1107",
                "cred": "10",
                "hide": false,
                "parity": "both",
                "type": "fmat",
                "name_stylized": "C\u00e1lculo I"
            },
            {
                "id": "TEO123",
                "name": "FORMACI\u00d3N TEOL\u00d3GICA",
                "prereq": null,
                "cred": "10",
                "hide": false,
                "parity": "both",
                "type": "ofg",
                "name_stylized": "Formaci\u00f3n Teol\u00f3gica"
            },
            {
                "id": "VRA3010",
                "name": "ENGLISH TEST ALTE 3",
                "prereq": null,
                "cred": "0",
                "hide": true,
                "parity": "both",
                "type": "general",
                "name_stylized": "English Test ALTE 3"
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
                "name_stylized": "Estructuras de Datos y Algoritmos"
            },
            {
                "id": "IIC2413",
                "name": "BASES DE DATOS",
                "prereq": "IIC2233",
                "cred": "10",
                "hide": false,
                "parity": "both",
                "type": "dcc",
                "name_stylized": "Bases de Datos"
            },
            {
                "id": "MAT1620",
                "name": "C\u00c1LCULO II",
                "prereq": "MAT1610",
                "cred": "10",
                "hide": false,
                "parity": "both",
                "type": "fmat",
                "name_stylized": "C\u00e1lculo II"
            },
            {
                "id": "MAT1203",
                "name": "\u00c1LGEBRA LINEAL",
                "prereq": "MAT1207",
                "cred": "10",
                "hide": false,
                "parity": "both",
                "type": "fmat",
                "name_stylized": "\u00c1lgebra Lineal"
            },
            {
                "id": "OFG1",
                "name": "OFG",
                "prereq": null,
                "cred": "10",
                "hide": false,
                "parity": null,
                "type": "ofg",
                "name_stylized": "OFG"
            }
        ]
    },
    {
        "sem": 4,
        "courses": [
            {
                "id": "EYP1050",
                "name": "MODELOS PROBABIL\u00cdSTICOS",
                "prereq": null,
                "cred": "10",
                "hide": false,
                "parity": "even",
                "type": "fmat",
                "name_stylized": "Modelos Probabil\u00edsticos"
            },
            {
                "id": "IIC2143",
                "name": "INGENIER\u00cdA DE SOFTWARE",
                "prereq": "IIC2233",
                "cred": "10",
                "hide": false,
                "parity": "both",
                "type": "dcc",
                "name_stylized": "Ingenier\u00eda de Software"
            },
            {
                "id": "IIC2224",
                "name": "AUT\u00d3MATAS Y COMPILADORES",
                "prereq": "IIC1253 y IIC2133",
                "cred": "10",
                "hide": false,
                "parity": "even",
                "type": "dcc",
                "name_stylized": "Aut\u00f3matas y Compiladores"
            },
            {
                "id": "IIC2333",
                "name": "SISTEMAS OPERATIVOS Y REDES",
                "prereq": "IIC2343",
                "cred": "10",
                "hide": false,
                "parity": "both",
                "type": "dcc",
                "name_stylized": "Sistemas Operativos y Redes"
            },
            {
                "id": "OFG2",
                "name": "OFG",
                "prereq": null,
                "cred": "10",
                "hide": false,
                "parity": null,
                "type": "ofg",
                "name_stylized": "OFG"
            }
        ]
    },
    {
        "sem": 5,
        "courses": [
            {
                "id": "IIC2560",
                "name": "FUNDAMENTOS DE LENGUAJES DE PROGRAMACI\u00d3N",
                "prereq": "IIC2343 y IIC2224",
                "cred": "10",
                "hide": false,
                "parity": "odd",
                "type": "dcc",
                "name_stylized": "Fundamentos de Lenguajes de Programaci\u00f3n"
            },
            {
                "id": "IIC2214",
                "name": "TEOR\u00cdA DE LA COMPUTACI\u00d3N",
                "prereq": "IIC1253",
                "cred": "10",
                "hide": false,
                "parity": "odd",
                "type": "dcc",
                "name_stylized": "Teor\u00eda de la Computaci\u00f3n"
            },
            {
                "id": "IIC2513",
                "name": "TECNOLOG\u00cdAS Y APLICACIONES WEB",
                "prereq": "IIC2413",
                "cred": "10",
                "hide": false,
                "parity": "both",
                "type": "dcc",
                "name_stylized": "Tecnolog\u00edas y Aplicaciones Web"
            },
            {
                "id": "OPTC1",
                "name": "OPTATIVO DE CIENCIAS",
                "prereq": null,
                "cred": "10",
                "hide": false,
                "parity": null,
                "type": "opt",
                "name_stylized": "Optativo de Ciencias"
            },
            {
                "id": "OFG3",
                "name": "OFG",
                "prereq": null,
                "cred": "10",
                "hide": false,
                "parity": null,
                "type": "ofg",
                "name_stylized": "OFG"
            },
            {
                "id": "IIC2001",
                "name": "PR\u00c1CTICA DE CIENCIA DE LA COMPUTACI\u00d3N",
                "prereq": "IIC2143 o IIC2142",
                "cred": "5",
                "hide": false,
                "parity": null,
                "type": "dcc",
                "name_stylized": "Pr\u00e1ctica de Ciencia de la Computaci\u00f3n"
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
                "type": "dcc",
                "name_stylized": "Inteligencia Artificial"
            },
            {
                "id": "IIC2283",
                "name": "DISE\u00d1O Y AN\u00c1LISIS DE ALGORITMOS",
                "prereq": "IIC2133",
                "cred": "10",
                "hide": false,
                "parity": "even",
                "type": "dcc",
                "name_stylized": "Dise\u00f1o y An\u00e1lisis de Algoritmos"
            },
            {
                "id": "IIC2531",
                "name": "SEGURIDAD COMPUTACIONAL",
                "prereq": "IIC2333",
                "cred": "10",
                "hide": false,
                "parity": "even",
                "type": "dcc",
                "name_stylized": "Seguridad Computacional"
            },
            {
                "id": "ETI1001",
                "name": "\u00c9TICA PARA LA CS DE LA COMPUTACI\u00d3N",
                "prereq": null,
                "cred": "10",
                "hide": false,
                "parity": "even",
                "type": "eti",
                "name_stylized": "\u00c9tica para la Cs de la Computaci\u00f3n"
            },
            {
                "id": "OFG4",
                "name": "OFG",
                "prereq": null,
                "cred": "10",
                "hide": false,
                "parity": null,
                "type": "ofg",
                "name_stylized": "OFG"
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
                "type": "dcc",
                "name_stylized": "Sistemas Distribuidos"
            },
            {
                "id": "IIC2182",
                "name": "INTERFACES Y EXPERIENCIA DE USUARIO",
                "prereq": "IIC2513",
                "cred": "10",
                "hide": false,
                "parity": "odd",
                "type": "dcc",
                "name_stylized": "Interfaces y Experiencia de Usuario"
            },
            {
                "id": "OPT01",
                "name": "OPT",
                "prereq": null,
                "cred": "10",
                "hide": false,
                "parity": null,
                "type": "opt",
                "name_stylized": "OPT"
            },
            {
                "id": "OPT02",
                "name": "OPT",
                "prereq": null,
                "cred": "10",
                "hide": false,
                "parity": null,
                "type": "opt",
                "name_stylized": "OPT"
            },
            {
                "id": "OFG5",
                "name": "OFG",
                "prereq": null,
                "cred": "10",
                "hide": false,
                "parity": null,
                "type": "ofg",
                "name_stylized": "OFG"
            }
        ]
    },
    {
        "sem": 8,
        "courses": [
            {
                "id": "IIC2164",
                "name": "PROYECTO DE INNOVACI\u00d3N Y COMPUTACI\u00d3N",
                "prereq": "ETI1001 y IIC2182 y IIC2531",
                "cred": "10",
                "hide": false,
                "parity": "even",
                "type": "dcc",
                "name_stylized": "Proyecto de Innovaci\u00f3n y Computaci\u00f3n"
            },
            {
                "id": "OPT04",
                "name": "OPT",
                "prereq": null,
                "cred": "10",
                "hide": false,
                "parity": null,
                "type": "opt",
                "name_stylized": "OPT"
            },
            {
                "id": "OPT05",
                "name": "OPT",
                "prereq": null,
                "cred": "10",
                "hide": false,
                "parity": null,
                "type": "opt",
                "name_stylized": "OPT"
            },
            {
                "id": "OPT06",
                "name": "OPT",
                "prereq": null,
                "cred": "10",
                "hide": false,
                "parity": null,
                "type": "opt",
                "name_stylized": "OPT"
            },
            {
                "id": "OFG6",
                "name": "OFG",
                "prereq": null,
                "cred": "10",
                "hide": false,
                "parity": null,
                "type": "ofg",
                "name_stylized": "OFG"
            }
        ]
    }
]

export default jsonData