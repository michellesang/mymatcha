from typing import Optional

from pydantic import BaseModel
from sqlmodel import SQLModel, Field


# model for database
class Matcha(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    brand: str
    name: str
    rating: float
    price: float
    notes: Optional[str] = ''


class MatchaCreate(BaseModel):
    brand: str
    name: str
    price: float
    rating: float
    notes: str | None = None
