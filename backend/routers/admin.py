from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import List, Optional
from datetime import datetime, timedelta
from jose import JWTError, jwt
import os
from dotenv import load_dotenv
import database
from models import AdminLogin, TokenResponse, Registration
from database import SECRET_KEY, ALGORITHM

load_dotenv()

ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

ADMIN_USERNAME = os.getenv("ADMIN_USERNAME")
if not ADMIN_USERNAME:
    raise EnvironmentError("ADMIN_USERNAME environment variable must be set")
    
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")
if not ADMIN_PASSWORD:
    raise EnvironmentError("ADMIN_PASSWORD environment variable must be set")
router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/admin/swagger/login")

async def get_current_admin(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None or username != ADMIN_USERNAME:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    return username

@router.post("/admin/swagger/login")
async def admin_swagger_login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Verify username and password
    if form_data.username != os.getenv("ADMIN_USERNAME", "admin") or form_data.password != os.getenv("ADMIN_PASSWORD", "workshop123"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token with expiration
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = database.create_access_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )
    
    # Return the token in the format expected by Swagger UI
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/admin/registrations", response_model=List[Registration])
async def get_all_registrations(current_user: str = Depends(get_current_admin)):
    """
    Get all workshop registrations (admin only).
    """
    try:
        return await database.get_all_registrations()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Failed to retrieve registrations: {str(e)}"
        )


@router.get("/admin/dashboard")
async def get_dashboard_stats(current_user: str = Depends(get_current_admin)):
    """
    Get dashboard statistics (admin only).
    """
    try:
        return await database.get_dashboard_stats()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Failed to retrieve dashboard stats: {str(e)}"
        )