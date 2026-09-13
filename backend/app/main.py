
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import auth, complaints

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "healthy"}


app.include_router(auth.router, prefix="/auth")
app.include_router(complaints.router, prefix="/complaints")