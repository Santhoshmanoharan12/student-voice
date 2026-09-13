from pydantic import BaseModel


class ComplaintRequest(BaseModel):
    subject: str
    concern: str
    category: str

