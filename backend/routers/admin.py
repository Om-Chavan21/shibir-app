from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import List
from datetime import datetime, timedelta
from jose import JWTError, jwt
import os
from dotenv import load_dotenv
import database
from models import AdminLogin, TokenResponse, Registration

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "a_very_secret_key_for_jwt_tokens")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# Hard-coded admin credentials (in a real app, store securely)
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "workshop123")

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="admin/login")

def create_access_token(data: dict, expires_delta: timedelta = None):
    """
    Create a JWT token for authentication.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_admin(token: str = Depends(oauth2_scheme)):
    """
    Dependency to validate admin JWT token.
    """
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


@router.post("/admin/login", response_model=TokenResponse)
async def admin_login(form_data: AdminLogin):
    """
    Admin login endpoint.
    """
    # Verify username and password
    if form_data.username != ADMIN_USERNAME or form_data.password != ADMIN_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token with expiration
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )
    
    return {"token": access_token}


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