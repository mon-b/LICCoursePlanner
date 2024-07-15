import json

def add_course_numbers_default(input_file, output_file, start_number):
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    current_number = start_number
    for semester in data:
        for course in semester['courses']:
            course['number'] = current_number
            current_number += 1
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    
    return current_number  # Return the last number used

def add_course_numbers_opt(input_file, output_file, start_number):
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    current_number = start_number
    for course in data['courses']:
        course['number'] = current_number
        current_number += 1
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

last_number = add_course_numbers_default('src/data/default_data.json', 'src/data/default_data.json', 1)
add_course_numbers_opt('src/data/opt_data.json', 'src/data/opt_data.json', last_number)
