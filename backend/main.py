from fastapi import FastAPI, Depends, Header, HTTPException, File, UploadFile
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from model import Student
from jose import jwt, JWTError
from dependencies import get_db_session
from sqlalchemy.orm import Session
from schema import StudentResponse, StudentRegisterRequest, Token, TokenData
from database import s3

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


@app.post("/user", response_model=StudentResponse)
def create_user(user: StudentRegisterRequest, db: Session = Depends(get_db_session)):
    db_user = Student(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@app.post("/token", response_model=Token)
def login_for_access_token(data: TokenData, db: Session = Depends(get_db_session)):
    user = db.query(Student).filter(Student.email == data.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    if not user.verify_password(data.password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


async def verify_token(token: str = Header(None)):
    if token is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_email = payload.get("sub")
        if user_email is None:
            raise HTTPException(status_code=401, detail="Not authenticated")
        return user_email
    except JWTError:
        raise HTTPException(status_code=401, detail="Not authenticated")


@app.get("/users/me")
def read_user_me(
    token: str = Depends(verify_token), db: Session = Depends(get_db_session)
):
    user = db.query(Student).filter(Student.email == token).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "student_id": user.student_id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "level": user.level,
        "program": user.program,
        "division": user.division,
        "profile_picture": user.profile_picture,
    }


@app.post("/uploadfile/")
def create_upload_file(file: UploadFile = File(...)):
    try:
        # Upload file to S3 bucket
        s3.upload_fileobj(file.file, "jesusbuckethat", file.filename)
        # Return success message
        return {"message": f"File '{file.filename}' uploaded successfully."}
    except Exception as e:
        # Return error message if upload fails
        return {"error": str(e)}


@app.get("/student/profile-picture/{student_id}")
async def get_student_profile_picture(student_id: int):
    try:
        # Replace "your_bucket_name" with the actual S3 bucket name
        bucket = "your_bucket_name"
        # Replace "profile_pictures" with the actual folder/path where the pictures are stored
        object_key = f"profile_pictures/{student_id}.jpg"

        # Generate a signed URL with a one-hour expiration time
        signed_url = s3.generate_presigned_url(
            "get_object",
            Params={"Bucket": bucket, "Key": object_key},
            ExpiresIn=3600,
        )

        return JSONResponse(content={"signed_url": signed_url})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
