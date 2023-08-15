import boto3
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import create_engine

s3 = boto3.client('s3',
                  aws_access_key_id="ASK FOR KEY",
                  aws_secret_access_key="ASK FOR KEY")

engine = create_engine("postgresql://postgres:postgrespw@localhost:32768", echo=True)

Base = declarative_base()

SessionLocal = sessionmaker(bind=engine)
