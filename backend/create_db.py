from database import Base,engine
from model import Student

print("Done")

Base.metadata.create_all(engine)