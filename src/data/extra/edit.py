import json

# This script enhances our JSON course data by mapping each course to a corresponding type based on its ID prefix and creating a 'name_stylized' attribute with lowercase versions of course names.
# The primary goal of this mapping is to assign a cute color to each course :D.
# Note: If you decide to run this script, please ensure to update default_data.js accordingly, as the changes made to the JSON file will need to be reflected in our main data source.

with open('src/data/cursos.txt', 'r', encoding='utf-8') as cursos_file:
    cursos = [line.strip() for line in cursos_file.readlines() if line.strip()]

with open('src/data/data.json', 'r') as file:
    data = json.load(file)

prefix_to_type = {
    'IIC': 'dcc',
    'MAT': 'fmat',
    'FIL': 'ofg',
    'OFG': 'ofg',
    'TE': 'ofg',
    'EYP1050': 'fmat',
    'OPT': 'opt',
    'ETI': 'eti',
    'VRA': 'general'
}

name_mapping = {curso.upper(): curso for curso in cursos}

for semester in data:
    for course in semester['courses']:
        course_id = course['id']
        for prefix, course_type in prefix_to_type.items():
            if course_id.startswith(prefix):
                course['type'] = course_type
                break
        
        course['name_stylized'] = name_mapping.get(course['name'].upper(), course['name'])  # Use mapping or default to original name

with open('src/data/data.json', 'w') as file:
    json.dump(data, file, indent=4)
