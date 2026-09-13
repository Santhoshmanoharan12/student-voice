from fastapi import APIRouter, Header, HTTPException

from app.schemas.complaint import ComplaintRequest
from app.services.email_service import send_complaint_email
from app.services.session import validate_session, consume_session

router = APIRouter()

@router.post("/submit")
def submit_complaint(data: ComplaintRequest, x_session_token: str = Header(...)):
    if not validate_session(x_session_token):
        raise HTTPException(status_code=401, detail="Session expired or invalid. Please verify your email again.")

    try:
        send_complaint_email(data.subject, data.concern, data.category)
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to submit complaint. Please try again.")

    consume_session(x_session_token)  # one-shot token
    return {"message": "Complaint submitted successfully."}