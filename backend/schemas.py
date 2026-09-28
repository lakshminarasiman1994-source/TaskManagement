from pydantic import BaseModel, ConfigDict
from datetime import datetime


# CREATE
class TaskCreate(BaseModel):
    title: str
    description: str | None = None
    status: str = "pending"


# UPDATE
class TaskUpdate(BaseModel):
    title: str
    description: str | None = None
    status: str


# RESPONSE
class TaskResponse(BaseModel):
    id: int
    title: str
    description: str | None
    status: str
    created_at: datetime
    updated_at: datetime | None

    model_config = ConfigDict(
        from_attributes=True
    )