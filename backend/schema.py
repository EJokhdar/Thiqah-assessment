from pydantic import BaseModel
from datetime import date
from app_enums import level_enums, program_enums, division_enums


class StudentResponse(BaseModel):
    student_id: int
    last_name: str
    email: str


class StudentRegisterRequest(BaseModel):
    email: str
    first_name: str
    last_name: str
    birthdate: date
    password: str
    level: level_enums
    program: program_enums
    division: division_enums
    profile_picture: str

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str = None
    password: str = None
