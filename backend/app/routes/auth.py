from fastapi import APIRouter, HTTPException

from app.schemas.auther import EmailRequest, OTPRequest
from app.services.otp import generate_otp, store_otp, verify_otp
from app.services.email_service import send_otp_email
from app.services.session import create_session

router = APIRouter()

@router.post("/request-otp")
def request_otp(data: EmailRequest):
    otp = generate_otp()
    store_otp(data.email, otp)

    try:
        send_otp_email(data.email, otp)
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to send OTP email. Please try again.")

    return {"message": "OTP sent to your college email."}

@router.post("/verify-otp")
def verify_student_otp(data: OTPRequest):
    success, message = verify_otp(data.email, data.otp)

    if not success:
        raise HTTPException(status_code=400, detail=message)

    token = create_session(data.email)
    return {"message": message, "token": token}