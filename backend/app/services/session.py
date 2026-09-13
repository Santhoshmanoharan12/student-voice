import secrets
import time

verified_sessions = {}
SESSION_TTL = 15 * 60  # 15 min to submit a complaint after verifying

def create_session(email: str) -> str:
    token = secrets.token_urlsafe(32)
    verified_sessions[token] = {"email": email, "expires_at": time.time() + SESSION_TTL}
    return token

def validate_session(token: str) -> bool:
    data = verified_sessions.get(token)
    if not data:
        return False
    if time.time() > data["expires_at"]:
        del verified_sessions[token]
        return False
    return True

def consume_session(token: str):
    verified_sessions.pop(token, None)