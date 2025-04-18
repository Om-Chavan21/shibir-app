from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Dict, Any
import database
import models
from routers.auth import get_admin_user, get_current_active_user

router = APIRouter(tags=["users"])

@router.get("/users", response_model=List[models.User])
async def get_all_users(current_user: Dict[str, Any] = Depends(get_admin_user)):
    """
    Get all users. Only for admins.
    """
    users = await database.users_collection.find().to_list(length=1000)
    users = database.serialize_list(users)
    
    # Remove passwords
    for user in users:
        user.pop("password", None)
        
    return users

@router.get("/users/me", response_model=models.User)
async def get_current_user(current_user: Dict[str, Any] = Depends(get_current_active_user)):
    """
    Get current logged in user.
    """
    # Remove password
    current_user.pop("password", None)
    return current_user

@router.put("/users/me", response_model=models.User)
async def update_current_user(
    user_update: Dict[str, Any],
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    """
    Update current user profile.
    """
    # Don't allow updating role
    if "role" in user_update:
        del user_update["role"]
        
    # Hash password if provided
    if "password" in user_update and user_update["password"]:
        user_update["password"] = database.get_password_hash(user_update["password"])
    elif "password" in user_update:
        del user_update["password"]
        
    await database.users_collection.update_one(
        {"_id": database.get_object_id(current_user["id"])},
        {"$set": user_update}
    )
    
    updated_user = await database.get_user(current_user["id"])
    updated_user.pop("password", None)
    return updated_user

@router.put("/users/{user_id}/role", response_model=models.User)
async def update_user_role(
    user_id: str,
    role: str,
    current_user: Dict[str, Any] = Depends(get_admin_user)
):
    """
    Update user role. Only for admins.
    """
    if role not in ["user", "organizer", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role. Must be one of: user, organizer, admin"
        )
        
    updated_user = await database.update_user_role(user_id, role)
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
        
    updated_user.pop("password", None)
    return updated_user

@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: str,
    current_user: Dict[str, Any] = Depends(get_admin_user)
):
    """
    Delete a user. Only for admins.
    """
    # Don't allow deleting self
    if user_id == current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account"
        )
        
    result = await database.users_collection.delete_one({"_id": database.get_object_id(user_id)})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return None