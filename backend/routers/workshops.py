from fastapi import APIRouter, HTTPException, status, Depends, Query, Form, File, UploadFile
from typing import List, Dict, Any, Optional
import database
import models
from routers.auth import get_admin_user, get_organizer_user, get_current_active_user

router = APIRouter(tags=["workshops"])

@router.get("/workshops", response_model=List[models.Workshop])
async def get_all_workshops():
    """
    Get all available workshops.
    """
    try:
        return await database.get_all_workshops()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Failed to retrieve workshops: {str(e)}"
        )

@router.get("/workshops/{workshop_id}", response_model=models.Workshop)
async def get_workshop_by_id(workshop_id: str):
    """
    Get a specific workshop by ID
    """
    workshop = await database.get_workshop(workshop_id)
    if not workshop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workshop not found"
        )
    return workshop

@router.post("/workshops", response_model=models.Workshop)
async def create_workshop(workshop: models.WorkshopCreate, current_user: Dict[str, Any] = Depends(get_admin_user)):
    """
    Create a new workshop. Only for admins.
    """
    try:
        return await database.create_workshop(workshop.dict())
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Failed to create workshop: {str(e)}"
        )

@router.put("/workshops/{workshop_id}", response_model=models.Workshop)
async def update_workshop(
    workshop_id: str, 
    workshop: models.WorkshopCreate, 
    current_user: Dict[str, Any] = Depends(get_admin_user)
):
    """
    Update a workshop. Only for admins.
    """
    existing = await database.get_workshop(workshop_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workshop not found"
        )
        
    try:
        return await database.update_workshop(workshop_id, workshop.dict())
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Failed to update workshop: {str(e)}"
        )

@router.delete("/workshops/{workshop_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_workshop(workshop_id: str, current_user: Dict[str, Any] = Depends(get_admin_user)):
    """
    Delete a workshop. Only for admins.
    """
    existing = await database.get_workshop(workshop_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workshop not found"
        )
        
    result = await database.delete_workshop(workshop_id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete workshop"
        )
    return None

@router.post("/workshops/register", response_model=models.Registration)
async def register_for_workshop(registration: models.RegistrationCreate):
    """
    Register for a workshop.
    """
    try:
        # Verify workshop exists
        workshop = await database.get_workshop(registration.workshopId)
        if not workshop:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Workshop not found"
            )
            
        return await database.register_for_workshop(registration.dict())
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Failed to register: {str(e)}"
        )

@router.post("/workshops/register/with-account", response_model=models.Registration)
async def register_with_account(
    registration: models.RegistrationCreate, 
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    """
    Register for a workshop with an account.
    """
    try:
        # Verify workshop exists
        workshop = await database.get_workshop(registration.workshopId)
        if not workshop:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Workshop not found"
            )
            
        # Add user ID to registration
        registration_data = registration.dict()
        registration_data["userId"] = current_user["id"]
            
        return await database.register_for_workshop(registration_data)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Failed to register: {str(e)}"
        )