import { Course } from "../types/course";

export const engData: Array<{ courses: Course[] }> = [{
  "courses": [
    {
      "id": "VRA2010",
      "name": "English Placement Test Alte 3",
      "name_english": "English Placement Test Alte 3",
      "prereq": "RII4000 o RII4001 o RII4010 o EUC4000",
      "cred": "0",
      "hide": false,
      "parity": "both",
      "type": "engdiag",
      "name_stylized": "English Placement Test Alte 3",
      "number": 89
    },
    {
      "id": "VRA3010",
      "name": "English Test (Sufficiency Alte 3)",
      "name_english": "English Test (Sufficiency Alte 3)",
      "prereq": "RII6000 o RII6001 o EUC6000 o VRA2010 o VRA2000",
      "cred": "0",
      "hide": false,
      "parity": "both",
      "type": "engdiag",
      "name_stylized": "English Test (Sufficiency Alte 3)",
      "number": 90
    },
    {
      "id": "EUC1000",
      "name": "Pre Intermediate English I",
      "name_english": "Pre Intermediate English I",
      "prereq": "null",
      "cred": "5",
      "hide": false,
      "parity": "both",
      "type": "engcour",
      "name_stylized": "Pre Intermediate English I",
      "number": 91
    },
    {
      "id": "EUC2000",
      "name": "Pre Intermediate English II",
      "name_english": "Pre Intermediate English II",
      "prereq": "null",
      "cred": "5",
      "hide": false,
      "parity": "both",
      "type": "engcour",
      "name_stylized": "Pre Intermediate English II",
      "number": 92

    },
    {
      "id": "EUC3000",
      "name": "Lower Intermediate English I",
      "name_english": "Lower Intermediate English I",
      "prereq": "null",
      "cred": "5",
      "hide": false,
      "parity": "both",
      "type": "engcour",
      "name_stylized": "Lower Intermediate English I",
      "number": 93
    },
    {
      "id": "EUC4000",
      "name": "Lower Intermediate English II",
      "name_english": "Lower Intermediate English II",
      "prereq": "null",
      "cred": "5",
      "hide": false,
      "parity": "both",
      "type": "engcour",
      "name_stylized": "Lower Intermediate English II",
      "number": 94
    },
    {
      "id": "EUC5000",
      "name": "Upper Intermediate English I",
      "name_english": "Upper Intermediate English I",
      "prereq": "null",
      "cred": "5",
      "hide": false,
      "parity": "both",
      "type": "engcour",
      "name_stylized": "Upper Intermediate English I",
      "number": 95
    },
    {
      "id": "EUC6000",
      "name": "Upper Intermediate English II",
      "name_english": "Upper Intermediate English II",
      "prereq": "null",
      "cred": "5",
      "hide": false,
      "parity": "both",
      "type": "engcour",
      "name_stylized": "Upper Intermediate English II",
      "number": 96
    },
    {
      "id": "EUC7000",
      "name": "Exit English B2: Upper Intermediate",
      "name_english": "Exit English B2: Upper Intermediate",
      "prereq": "EUC6000 o RII6000 o RII6001",
      "cred": "5",
      "hide": false,
      "parity": "both",
      "type": "engcour",
      "name_stylized": "Exit English B2: Upper Intermediate",
      "number": 97
    }
  ]
}
];