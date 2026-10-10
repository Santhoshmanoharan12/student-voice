"""
Removes a just-sent OTP email from the sending Gmail account so no record of
which student received an OTP remains (Sent, All Mail, or Trash).
 
This only touches the SENDER account's mailbox. The copy delivered to the
student's own inbox is a separate message and is never affected.

"""



import imaplib
import os
import re

_LIST_RE = re.compile(r'\((?P<flags>.*?)\) "(?P<delim>.*?)" (?P<name>.*)')
 
 
def _connect():
    imap = imaplib.IMAP4_SSL("imap.gmail.com")
    imap.login(os.getenv("SENDER_EMAIL"), os.getenv("SENDER_PASSWORD"))
    return imap
 
def _find_folder(imap, special_use: str):
    """Find a Gmail folder by its special-use flag (\\All, \\Trash).
    More reliable than hardcoding names, which vary by account language."""
    status, folders = imap.list()
    if status != "OK":
        return None
    for raw in folders:
        match = _LIST_RE.match(raw.decode())
        if match and special_use in match.group("flags"):
            return match.group("name")
    return None
 

def _search(imap, folder: str, subject: str):
    status, _ = imap.select(folder)
    if status != "OK":
        return []
    status, data = imap.search(None, f'(SUBJECT "{subject}")')
    if status != "OK" or not data or not data[0]:
        return []
    return data[0].split()
 
 
def delete_from_sent(subject_keyword: str) -> bool:
    """Permanently deletes every copy of the message from the sender account.
    Never raises: a cleanup failure must not break the OTP-sending flow."""
    try:
        imap = _connect()
        try:
            all_mail = _find_folder(imap, "\\All")
            trash = _find_folder(imap, "\\Trash")
            if not all_mail or not trash:
                print("[email_cleanup] Could not locate All Mail / Trash folders.")
                return False
 
            # 1) Move every copy to Trash (working from All Mail covers Sent too)
            for msg_id in _search(imap, all_mail, subject_keyword):
                imap.store(msg_id, "+X-GM-LABELS", "\\Trash")
 
            # 2) Permanently delete from Trash
            for msg_id in _search(imap, trash, subject_keyword):
                imap.store(msg_id, "+FLAGS", "\\Deleted")
            imap.expunge()
            return True
        finally:
            imap.logout()
    except Exception as e:
        print(f"[email_cleanup] Failed to delete sent OTP email: {e}")
        return False
 
