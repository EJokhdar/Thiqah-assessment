from database import Base
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Enum
from app_enums import level_enums, program_enums, division_enums


class Student(Base):
    __tablename__ = "student"
    student_id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, unique=True, index=True, nullable=False)
    last_name = Column(String, unique=True, index=True, nullable=False)
    birthdate = Column(DateTime, default=datetime.utcnow)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    level = Column(Enum(level_enums), nullable=False, default=level_enums.bachelors)
    program = Column(Enum(program_enums), nullable=False, default=program_enums.compsci)
    division = Column(Enum(division_enums), nullable=False, default=division_enums.info)
    profile_picture = Column(String)

    def verify_password(self, password):
        return self.password == password
