# Python Script to format into JSON

name = input("Prof Name: ")
email = input("Email: ")
depts = input("Departments: ")
accepting = input("Is faculty currently accepting? [Yes/No] ")
studentYears = input("studentYears: ")
requirements = input("requirements: ")
students = input("students: ")
opportunities = input("Input faculty opportunities: ")



with open("facultyformat.txt", "a") as file:
	file.write("\n{")
	file.write('\n  "name":"{}"'.format(name))
	file.write(',\n  "email":"{}"'.format(email))
	deptsNames = depts.split(', ')
	file.write(',\n  "depts":["' + '", "'.join(deptsNames) + '"]')
	file.write(',\n  "accepting":"{}"'.format(accepting))
	file.write(',\n  "studentYears":"{}"'.format(studentYears))
	file.write(',\n  "requirements":"{}"'.format(requirements))
	studNames = students.split(', ')
	file.write(',\n  "students":["' + '", "'.join(studNames) + '"]')
	file.write(',\n  "opportunities":"{}"'.format(opportunities))
	file.write("\n},")

