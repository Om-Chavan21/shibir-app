from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Dict, Any, Optional
import database
import models
from routers.auth import get_admin_user, get_organizer_user, get_current_active_user

router = APIRouter(tags=["registrations"])

@router.get("/registrations", response_model=List[models.Registration])
async def get_all_registrations(
    current_user: Dict[str, Any] = Depends(get_organizer_user),
    workshop_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None)
):
    """
    Get all registrations. Only for organizers and admins.
    """
    try:
        registrations = await database.get_all_registrations()
        
        # Filter by workshop if provided
        if workshop_id:
            registrations = [r for r in registrations if r["workshopId"] == workshop_id]
            
        # Filter by status if provided
        if status:
            registrations = [r for r in registrations if r["registrationStatus"] == status]
            
        return registrations
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Failed to retrieve registrations: {str(e)}"
        )

@router.get("/registrations/user", response_model=List[models.Registration])
async def get_user_registrations(current_user: Dict[str, Any] = Depends(get_current_active_user)):
    """
    Get current user's registrations.
    """
    try:
        return await database.get_user_registrations(current_user["id"])
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Failed to retrieve registrations: {str(e)}"
        )

@router.get("/registrations/{registration_id}", response_model=models.Registration)
async def get_registration_by_id(
    registration_id: str,
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    """
    Get a specific registration by ID. Users can only view their own registrations.
    Admins and organizers can view any registration.
    """
    registration = await database.get_registration(registration_id)
    if not registration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Registration not found"
        )
        
    # Check permissions
    if current_user["role"] not in ["organizer", "admin"] and registration.get("userId") != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this registration"
        )
        
    return registration

@router.put("/registrations/{registration_id}", response_model=models.Registration)
async def update_registration_status(
    registration_id: str,
    status: str,
    current_user: Dict[str, Any] = Depends(get_organizer_user)
):
    """
    Update registration status. Only for organizers and admins.
    """
    registration = await database.get_registration(registration_id)
    if not registration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Registration not found"
        )
        
    if status not in ["pending", "approved", "rejected"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid status. Must be one of: pending, approved, rejected"
        )
        
    try:
        return await database.update_registration_status(registration_id, status)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Failed to update registration status: {str(e)}"
        )

@router.delete("/registrations/{registration_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_registration(
    registration_id: str,
    current_user: Dict[str, Any] = Depends(get_admin_user)
):
    """
    Delete a registration. Only for admins.
    """
    registration = await database.get_registration(registration_id)
    if not registration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Registration not found"
        )
        
    result = await database.delete_registration(registration_id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete registration"
        )
    return None