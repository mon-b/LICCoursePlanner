import json

# This script is designed to enhance our JSON course data by mapping each course to a corresponding type based on its ID prefix.
# The primary goal of this mapping is to assign a cute color to each course :D.
# Although this script is currently focused on adding the 'type' attribute, it is structured to be easily extensible for future modifications or additional attributes.
# Note: If you decide to run this script, please ensure to update data.js accordingly, as the changes made to the JSON file will need to be reflected in our main data source.

with open('data.json', 'r') as file:
    data = json.load(file)

prefix_to_type = {
    'IIC': 'dcc',
    'MAT': 'fmat',
    'FIL': 'ofg',
    'OFG': 'ofg',
    'TE': 'ofg',
    'EYP1050': 'fmat',
    'OPT': 'opt'
}

for semester in data:
    for course in semester['courses']:
        course_id = course['id']
        for prefix, course_type in prefix_to_type.items():
            if course_id.startswith(prefix):
                course['type'] = course_type
                break

with open('data.json', 'w') as file:
    json.dump(data, file, indent=4)


