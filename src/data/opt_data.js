const optData = [{
    "courses": [
        {
            "id": "COM043",
            "name": "Periodismo de Datos",
            "prereq": "COM117",
            "cred": "10",
            "hide": false,
            "parity": null,
            "type": "optcom",
            "name_stylized": "Periodismo de Datos"
        },
        {
            "id": "COM117",
            "name": "Narración Interactiva",
            "prereq": null,
            "cred": "10",
            "hide": false,
            "parity": null,
            "type": "optcom",
            "name_stylized": "Narración Interactiva"
        },

        {
            "id": "COM819",
            "name": "Taller de Prototipos Mediales",
            "prereq": null,
            "cred": "10",
            "hide": false,
            "parity": null,
            "type": "optcom",
            "name_stylized": "Taller de Prototipos Mediales"
        },
        {
            "id": "COM819",
            "name": "Taller de Prototipos Mediales",
            "prereq": null,
            "cred": "10",
            "hide": false,
            "parity": null,
            "type": "optcom",
            "name_stylized": "Taller de Prototipos Mediales"
        },
        {
            "id": "COM819",
            "name": "Taller de Prototipos Mediales",
            "prereq": null,
            "cred": "10",
            "hide": false,
            "parity": null,
            "type": "optcom",
            "name_stylized": "Taller de Prototipos Mediales"
        },
        {
            "id": "COM813",
            "name": "Taller de Narracion e Industria de Esports",
            "prereq": null,
            "cred": "10",
            "hide": false,
            "parity": null,
            "type": "optcom",
            "name_stylized": "Taller de Narracion e Industria de Esports"
        },
        {
            "id": "IMT2117",
            "name": "Probabilidades y Algoritmos",
            "prereq": "IIC1253",
            "cred": "10",
            "hide": false,
            "parity": null,
            "type": "opt-mat",
            "name_stylized": "Probabilidades y Algoritmos"
        },
        {
            "id": "MAT2225",
            "name": "Teoria de Numeros",
            "prereq": null,
            "cred": "10",
            "hide": false,
            "parity": null,
            "type": "opt-mat",
            "name_stylized": "Teoria de Numeros"
        },
        {
            "id": "MAT2605",
            "name": "Calculo Cientifico I",
            "prereq": null,
            "cred": "10",
            "hide": false,
            "parity": null,
            "type": "opt-mat",
            "name_stylized": "Calculo Cientifico I"
        },
        {
            "id": "MAT2205",
            "name": "Algebra Abstracta I",
            "prereq": null,
            "cred": "10",
            "hide": false,
            "parity": null,
            "type": "opt-mat",
            "name_stylized": "Algebra Abstracta I"
        },
        {
            "id": "LET0121",
            "name": "Grandes Preguntas sobre el Lenguaje",
            "prereq": null,
            "cred": "10",
            "hide": false,
            "parity": null,
            "type": "optlet",
            "name_stylized": "Grandes Preguntas sobre el Lenguaje"
        },
        {
            "id": "LET0131",
            "name": "Gramatica Española I",
            "prereq": null,
            "cred": "10",
            "hide": false,
            "parity": null,
            "type": "optlet",
            "name_stylized": "Gramatica Española I"
        },
        {
            "id": "LET116E",
            "name": "Herramientas Informaticas para Analisis Linguisticos",
            "prereq": null,
            "cred": "10",
            "hide": false,
            "parity": null,
            "type": "optlet",
            "name_stylized": "Herramientas Informaticas para Analisis Linguisticos"
        },
        {
            "id": "LET0129",
            "name": "Linguistica de Corpus y Computacional",
            "prereq": null,
            "cred": "10",
            "hide": false,
            "parity": null,
            "type": "optlet",
            "name_stylized": "Linguistica de Corpus y Computacional"
        },
        {
            "id": "EAE1210",
            "name": "Introduccion a la Macroeconomia",
            "prereq": "EAE1110",
            "cred": "10",
            "hide": false,
            "parity": null,
            "type": "econ",
            "name_stylized": "Introduccion a la Macroeconomia"
        },
        {
            "id": "EAE1110",
            "name": "Introduccion a la Microeconomia",
            "prereq": null,
            "cred": "10",
            "hide": false,
            "parity": null,
            "type": "econ",
            "name_stylized": "Introduccion a la Microeconomia"
        },
        {
            "id": "EAE2510",
            "name": "Econometria",
            "prereq": null,
            "cred": "10",
            "hide": false,
            "parity": null,
            "type": "econ",
            "name_stylized": "Econometria"
        },
        {
            "id": "EAE1220",
            "name": "Analisis Economico: la Experiencia Chilena",
            "prereq": null,
            "cred": "10",
            "hide": false,
            "parity": null,
            "type": "econ",
            "name_stylized": "Analisis Economico: la Experiencia Chilena"
        },
        {
            "id": "AST0212",
            "name": "Introduccion al Analisis de Datos",
            "prereq": null,
            "cred": "10",
            "hide": false,
            "parity": null,
            "type": "opt-cien",
            "name_stylized": "Introduccion al Analisis de Datos"
        },
        {
            "id": "AST0222",
            "name": "Taller de Astronomia",
            "prereq": null,
            "cred": "10",
            "hide": false,
            "parity": null,
            "type": "opt-cien",
            "name_stylized": "Taller de Astronomia"
        },
        {
            "id": "AST0111",
            "name": "Astronomia",
            "prereq": null,
            "cred": "10",
            "hide": false,
            "parity": null,
            "type": "opt-cien",
            "name_stylized": "Astronomia"
        },
        {
            "id": "BIO242C",
            "name": "Bioestadistica",
            "prereq": null,
            "cred": "10",
            "hide": false,
            "parity": null,
            "type": "opt-cien",
            "name_stylized": "Bioestadistica"
        },
        {
            "id": "BIO231C",
            "name": "Ecologia",
            "prereq": null,
            "cred": "10",
            "hide": false,
            "parity": null,
            "type": "opt-cien",
            "name_stylized": "Ecologia"
        },
        {
            "id": "BIO298E",
            "name": "Trabajo Experimental en Ecologia",
            "prereq": null,
            "cred": "10",
            "hide": false,
            "parity": null,
            "type": "optbio",
            "name_stylized": "Trabajo Experimental en Ecologia"
        },
        {
            "id": "BIO299L",
            "name": "Laboratorio Fisiologia",
            "prereq": null,
            "cred": "10",
            "hide": false,
            "parity": null,
            "type": "optbio" +
                "",
            "name_stylized": "Laboratorio Fisiologia"
        }
    ]


}
]

export default optData