from typing import Optional

from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client

from models.matcha import MatchaCreate

url: str = "https://atrclhpmlapmfjbfwmtz.supabase.co"
key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0cmNsaHBtbGFwbWZqYmZ3bXR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwNTA2MDgsImV4cCI6MjA2MTYyNjYwOH0.QNNEdHHc2jhW8v-z2_opkYw_VH_xntLJ5KqC2lWlbe4"
supabase: Client = create_client(url, key)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class UserCreate(BaseModel):
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


@app.post("/auth/signup")
async def sign_up(user: UserCreate):
    try:
        print(f"Received signup request with email: {user.email}")  # Debug print
        response = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password
        })
        return {
            "token": response.session.access_token,
            "userId": response.user.id,
            "email": response.user.email,
            "createdAt": response.user.created_at
        }
    except Exception as e:
        print(f"Signup error: {str(e)}")  # Debug print
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/auth/login")
async def sign_in(user: UserLogin):
    try:
        response = supabase.auth.sign_in_with_password({
            "email": user.email,
            "password": user.password
        })
        return {
            "token": response.session.access_token,
            "userId": response.user.id,
            "email": response.user.email,
            "createdAt": response.user.created_at
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/auth/signout")
async def sign_out():
    try:
        supabase.auth.sign_out()
        return {"message": "Signed out successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# Protected route example
async def get_current_user(token: Optional[str] = Depends()):
    try:
        user = supabase.auth.get_user(token)
        return user
    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


@app.get("/protected")
async def protected_route(user=Depends(get_current_user)):
    return {"message": "This is a protected route", "user_email": user.user.email}


# Your existing endpoints
@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/matchas/")
def get_matchas(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")

    token = authorization.split(" ")[1]
    try:
        user = supabase.auth.get_user(token)
        response = supabase.table("matchas").select("*").eq("user_id", user.user.id).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/matchas/")
def create_matcha(matcha: MatchaCreate, authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")

    token = authorization.split(" ")[1]

    try:
        user = supabase.auth.get_user(token)
        matcha_dict = matcha.model_dump()
        matcha_dict["user_id"] = user.user.id

        response = supabase.table("matchas").insert(matcha_dict).execute()
        inserted = response.data[0] if response.data else None

        if not inserted:
            raise HTTPException(status_code=500, detail="Insert succeeded but no data returned")

        return inserted
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.put("/matchas/{matcha_id}")
def update_matcha(matcha_id: str, matcha: MatchaCreate):
    matcha_dict = matcha.model_dump()
    response = supabase.table("matchas").update(matcha_dict).eq("id", matcha_id).execute()
    return response.data


@app.delete("/matchas/{matcha_id}")
def delete_matcha(matcha_id: str):
    response = supabase.table("matchas").delete().eq("id", matcha_id).execute()
    return response.data


@app.get("/matchas/stats")
def get_matcha_stats(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")

    token = authorization.split(" ")[1]
    user = supabase.auth.get_user(token)
    user_id = user.user.id

    response = supabase.table("matchas").select("rating").eq("user_id", user_id).execute()
    matchas = response.data

    if not matchas:
        return {"count": 0, "averageRating": 0}

    count = len(matchas)
    average_rating = sum(m["rating"] for m in matchas) / count

    return {
        "count": count,
        "averageRating": round(average_rating, 1)
    }
