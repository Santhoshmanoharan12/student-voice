import os
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv()

SENDER_EMAIL = os.getenv("SENDER_EMAIL")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD")
RECEIVER_EMAIL = os.getenv("RECEIVER_EMAIL")  

def _send_email(to_email: str, subject: str, body: str):
    message = EmailMessage()
    message["From"] = SENDER_EMAIL
    message["To"] = to_email
    message["Subject"] = subject
    message.set_content(body)

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp_server:
        smtp_server.login(SENDER_EMAIL, SENDER_PASSWORD)
        smtp_server.send_message(message)

def send_otp_email(email: str, otp: int):
    _send_email(
        to_email=email,
        subject="Your Student Voice OTP",
        body=f"Your OTP is {otp}. It expires in 5 minutes.\n\nIf you didn't request this, ignore this email. \n\nIMPORTANT NOTE : After OTP verification and Complaint submission, Please Delete this email for your own security."
    )

def send_complaint_email(subject: str, concern: str, category: str):
    _send_email(
        to_email=RECEIVER_EMAIL,
        subject=f"Student Complaint: {subject}",
        body=f"Category: {category}\n\nStudent Concern:\n{concern}"
    )