from fastapi import APIRouter, HTTPException, status
from typing import List
import database
from models import Workshop, WorkshopCreate, RegistrationCreate, Registration

router = APIRouter()

@router.get("/workshops", response_model=List[Workshop])
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


@router.post("/workshops", response_model=Workshop)
async def create_workshop(workshop: WorkshopCreate):
    """
    Create a new workshop.
    """
    try:
        return await database.create_workshop(workshop.dict())
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Failed to create workshop: {str(e)}"
        )


@router.post("/workshops/register", response_model=Registration)
async def register_for_workshop(registration: RegistrationCreate):
    """
    Register interest for a workshop.
    """
    try:
        return await database.register_for_workshop(registration.dict())
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Failed to register: {str(e)}"
        )