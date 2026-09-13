from pydantic import BaseModel, field_validator

class EmailRequest(BaseModel):
    email: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, value):
        value = value.strip().lower()

        if not value.endswith("@krce.ac.in"):
            raise ValueError("Email must be from the domain krce.ac.in")

        return value

class OTPRequest(BaseModel):
    email: str
    otp: int

