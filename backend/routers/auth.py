from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta
import database
import models
from typing import Dict, Any
import os
from jose import jwt

router = APIRouter(tags=["authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, database.SECRET_KEY, algorithms=[database.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = await database.get_user(user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

async def get_current_active_user(current_user: Dict[str, Any] = Depends(get_current_user)):
    return current_user

async def get_organizer_user(current_user: Dict[str, Any] = Depends(get_current_user)):
    if current_user["role"] not in ["organizer", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return current_user

async def get_admin_user(current_user: Dict[str, Any] = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return current_user

@router.post("/auth/register", response_model=models.TokenResponse)
async def register_user(user_data: models.UserCreate):
    user = await database.create_user(user_data)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create access token
    access_token = database.create_access_token(data={"sub": user["id"]})
    
    # Remove password from user data
    user.pop("password", None)
    
    return {"token": access_token, "user": user}

@router.post("/auth/login", response_model=models.TokenResponse)
async def login_for_access_token(form_data: models.UserLogin):
    user = await database.authenticate_user(form_data.email, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token = database.create_access_token(data={"sub": user["id"]})
    
    # Remove password from user data
    user.pop("password", None)
    
    return {"token": access_token, "user": user}

@router.post("/auth/admin-login", response_model=models.TokenResponse)
async def admin_login(form_data: models.AdminLogin):
    # Check admin credentials
    if form_data.username == os.getenv("ADMIN_USERNAME", "admin") and form_data.password == os.getenv("ADMIN_PASSWORD", "workshop123"):
        # Create or get admin user
        admin_email = os.getenv("ADMIN_EMAIL", "admin@example.com")
        admin_user = await database.get_user_by_email(admin_email)
        
        if not admin_user:
            admin_user = await database.create_user(models.UserCreate(
                name="Administrator",
                email=admin_email,
                phone="0000000000",
                password=form_data.password
            ))
            # Set as admin
            admin_user = await database.update_user_role(admin_user["id"], models.UserRole.ADMIN)
        
        # Create access token
        access_token = database.create_access_token(data={"sub": admin_user["id"]})
        
        # Remove password
        admin_user.pop("password", None)
        
        # Return in consistent format
        return {"token": access_token, "user": admin_user}
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect username or password",
        headers={"WWW-Authenticate": "Bearer"},
    )

@router.get("/auth/refresh")
async def refresh_token(current_user: Dict[str, Any] = Depends(get_current_active_user)):
    # Create new access token
    access_token = database.create_access_token(data={"sub": current_user["id"]})
    
    # Remove password from user data
    current_user.pop("password", None)
    
    return {"token": access_token, "user": current_user}

@router.get("/auth/me")
async def get_me(current_user: Dict[str, Any] = Depends(get_current_active_user)):
    # Remove password from user data
    current_user.pop("password", None)
    
    return current_user