import secrets
import time

otp_storage = {}

def generate_otp() -> int:
    return secrets.randbelow(900000) + 100000

def store_otp(email: str, otp: int):
    otp_storage[email] = {
        "otp": otp,
        "expires_at": time.time() + 300  # 5 minutes
    }

def verify_otp(email: str, entered_otp: int):
    stored_data = otp_storage.get(email)

    if stored_data is None:
        return False, "No OTP found for this email. Please request a new one."

    if time.time() > stored_data["expires_at"]:
        del otp_storage[email]
        return False, "OTP has expired. Please request a new one."

    if stored_data["otp"] != entered_otp:
        return False, "Invalid OTP."

    del otp_storage[email]
    return True, "OTP verified successfully."