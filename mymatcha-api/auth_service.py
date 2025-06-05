from sqlmodel import SQLModel, Field, Session, select
from typing import Optional
from utils import hash_password, verify_password, create_access_token
from service import engine


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str
    hashed_password: str

def create_user(email: str, password: str) -> User:
    with Session(engine) as session:
        hashed = hash_password(password)
        user = User(email=email, hashed_password=hashed)
        session.add(user)
        session.commit()
        session.refresh(user)
        return user

def authenticate_user(email: str, password: str) -> Optional[User]:
    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == email)).first()
        if user and verify_password(password, user.hashed_password):
            return user
    return None