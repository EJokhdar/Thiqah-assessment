from enum import Enum

class level_enums(str, Enum):
    bachelors = "Bachelor's"
    masters = "Master's"

class program_enums(str, Enum):
    compsci = "Computer Science"
    se = "Software Engineer"
    it = "Information Technology"
    cyb = "Cyber Security"
    ai = "Artificial Intelligence"

class division_enums(str, Enum):
    info = "Information"
    data_analytics ="Data Analytics"
    ui_ux = "UI & UX"
    software_engineering = "Software Engineer"

