import os
import numpy as np
import pandas as pd

responses = pd.read_csv('./FacultyResponses.csv') # download this csv from Google form responses
# UPDATE THE FOLLOWING IF YOU CHANGED THE QUESTIONS
responses = responses.rename({
    'Which years of students are you willing to have in your lab?':'studentYears',
    'What requirements do you have for undergraduates joining your group? (i.e. courses taken, skills, previous experience, etc.)': 'requirements',
    'If possible, please provide the name(s) of undergraduates in your lab (currently working or recently worked (e.g. SURF)):': 'students',
    'In what settings can students find opportunities in your lab? (Please choose all that apply.)': 'remote',
    'Short description of duties/research opportunities:': 'opportunities',
    'Please include a lab website, if applicable.': 'website'
}, axis='columns')

# might need to check if links changed 
# also update if you changed the departments on the form
# dept_links: department full name -> department website
dept_links = { 
    'Biology and Biological Engineering': 'bbe.caltech.edu',
    'Chemistry and Chemical Engineering': 'cce.caltech.edu',
    'Engineering and Applied Science': 'eas.caltech.edu',
    'Geological and Planetary Sciences': 'gps.caltech.edu',
    'Humanities and Social Sciences': 'hss.caltech.edu',
    'Physics, Mathematics, and Astronomy': 'pma.caltech.edu'
}
# depts: department abbreviation -> dict of {subdepartment full name -> subdepartment website}
# matches checkbox options on Google form
depts = { 
    'BBE': {
        'Biochemistry, Biophysics, and Molecular Biology': 'https://www.bbe.caltech.edu/research/molecular-biology-biochemistry-biophysics',
        'Biological Engineering': 'https://www.bbe.caltech.edu/research/biological-engineering',
        'Neuroscience': 'https://www.bbe.caltech.edu/research/neuroscience',
        'Cellular and Developmental Biology': 'https://www.bbe.caltech.edu/research/developmental-biology-and-genetics',
        'Microbiology': 'https://www.bbe.caltech.edu/research/microbiology-and-immunology',
        'Evolutionary and Organismal Biology': 'https://www.bbe.caltech.edu/research/evolutionary-and-organismal-biology'
    },
    'CCE': {
        'Biochemistry and Molecular Biophysics': 'https://www.cce.caltech.edu/research/biochemistry-molecular-biophysics',
        'Chemistry': 'https://www.cce.caltech.edu/research/chemistry',
        'Chemical Engineering': 'https://www.cce.caltech.edu/research/chemical-engineering'
    },
    'EAS': {
        'Aerospace': 'http://galcit.caltech.edu/',
        'Applied Physics and Material Science': 'http://www.aphms.caltech.edu/',
        'Computing and Mathematical Science': 'http://www.cms.caltech.edu/',
        'Electrical Engineering': 'http://ee.caltech.edu/',
        'Environmental Science and Engineering': 'http://www.ese.caltech.edu/',
        'Mechanical and Civil Engineering': 'http://www.mce.caltech.edu/',
        'Medical Engineering': 'http://www.mede.caltech.edu/'
    },
    'GPS': {
        'Geology': 'https://www.gps.caltech.edu/gps-research/research-programs/geology-research-option',
        'Geobiology': 'https://www.gps.caltech.edu/gps-research/research-programs/geobiology-research-option',
        'Geochemistry': 'https://www.gps.caltech.edu/gps-research/research-programs/geochemistry-research-option',
        'Geophysics': 'http://www.seismolab.caltech.edu/research.html',
        'Planetary Science': 'https://www.gps.caltech.edu/gps-research/research-programs/planetary-research-option',
        'Environmental Science and Engineering': 'http://www.ese.caltech.edu/'
    },
    'HSS': {
        'Humanities': 'https://www.hss.caltech.edu/research/humanities-research', 
        'Social Sciences': 'https://www.hss.caltech.edu/research/social-sciences-research'
    },
    'PMA': {
        'Physics': 'https://pma.caltech.edu/research-and-academics/physics',
        'Mathematics': 'https://pma.caltech.edu/research-and-academics/mathematics',
        'Astronomy': 'http://www.astro.caltech.edu/'
    }
}

def tab(no):
    return '    ' * no

def stringify(given):
    if type(given) == str: return given
    return ''

def subdepartment(dept_responses, dept_abbrev, subdept_name, subdiv_no):
    # header
    print(tab(2) + '{')
    print(tab(3) + '"name": "' + subdept_name + '",')
    print(tab(3) + '"link:" "' + depts[dept_abbrev][subdept_name] + '",')
    # iterate through faculty
    print(tab(3) + '"faculty": [')
    
    is_in_subdiv = [subdept_name in i for i in dept_responses['Subdivision{}'.format(subdiv_no)]]
    subdiv_faculty = dept_responses[is_in_subdiv]
    
    for index, row in subdiv_faculty.iterrows():
        print(tab(3) + '{')
        time = row.Timestamp.split(' ')
        print(tab(4) + '"lastupdate": "' + stringify(time[0]) + '",')
        print(tab(4) + '"name": "' + stringify(row.Name) + '",')
        print(tab(4) + '"email": "' + stringify(row.Email) + '",')
        # TODO: print(tab(4) + '"depts": "' + time[0] + '"') 
        print(tab(4) + '"accepting": "Yes",')
        print(tab(4) + '"studentYears": "' + stringify(row.studentYears) + '",')
        print(tab(4) + '"requirements": "' + stringify(row.requirements) + '",')
        print(tab(4) + '"students": "' + stringify(row.students) + '",')
        print(tab(4) + '"opportunities": "' + stringify(row.opportunities) + '",')
        print(tab(4) + '"website": "' + stringify(row.website) + '",')
        print(tab(3) + '}')
    
    print(tab(3) + ']')
    # footer
    print(tab(2) + '}')

def department(dept_abbrev, dept_name, subdiv_no):
    # header - name, link
    print('{')
    print(tab(1) + '"name": "' + dept_name + '",')
    print(tab(1) + '"link": "' + dept_links[dept_name] + '",')
    # find subdepartments
    subdepts = list(depts[dept_abbrev].keys())
    print(tab(1) + '"departments": [')
    dept_responses = responses[responses.Departments == dept_abbrev]
    for s in subdepts: 
        subdepartment(dept_responses, dept_abbrev, s, subdiv_no)
    print(tab(1) + ']')
    # footer
    print('}')

def all_departments():
    print('[')
    department('BBE','Biology and Biological Engineering', '')
    department('CCE','Chemistry and Chemical Engineering', '.1')
    department('EAS','Engineering and Applied Science', '.2')
    department('GPS','Geological and Planetary Sciences', '.3')
    department('HSS','Humanities and Social Sciences','.4')
    department('PMA','Physics, Mathematics, and Astronomy','.5')
    print(']')

all_departments()
