from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List, Dict, Any, Union
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    USER = "user"
    ORGANIZER = "organizer"
    ADMIN = "admin"
    
class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: str
    role: UserRole = UserRole.USER
    created_at: datetime = Field(default_factory=datetime.now)

class TokenData(BaseModel):
    token: str
    token_type: str = "bearer"
    user_id: str
    user_role: UserRole

class WorkshopBase(BaseModel):
    title: str
    description: str
    date: str
    time: str
    location: str
    audience: str
    duration: str
    fee: Optional[float] = None
    registrationDeadline: str
    eligibility: Dict[str, int] = {"minStd": 8, "maxStd": 10}
    capacity: int
    learningOutcomes: List[str]
    paymentDetails: Optional[str] = None
    images: Optional[List[str]] = None
    status: str = "upcoming"  # "upcoming", "ongoing", "completed"

class WorkshopCreate(WorkshopBase):
    pass

class Workshop(WorkshopBase):
    id: str
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

class RegistrationBase(BaseModel):
    name: str
    email: EmailStr
    phone: str
    age: Optional[str] = None
    workshopInterest: str
    message: Optional[str] = None
    agreeToTerms: bool = True
    studentName: str
    schoolName: str
    std: str
    mobileNumber: str
    alternateNumber: Optional[str] = None
    address: str
    isPuneResident: bool
    referralSource: str
    paymentStatus: str = "pending"  # "pending", "completed", "failed"
    paymentProofUrl: Optional[str] = None
    registrationStatus: str = "pending"  # "pending", "approved", "rejected"

    @validator('std')
    def validate_std(cls, std):
        try:
            std_int = int(std)
            if std_int < 8 or std_int > 10:
                raise ValueError("Standard must be between 8 and 10")
        except ValueError:
            raise ValueError("Standard must be a number between 8 and 10")
        return std

class RegistrationCreate(RegistrationBase):
    workshopId: str

class Registration(RegistrationBase):
    id: str
    workshopId: str
    userId: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

class AdminLogin(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    token: str
    user: Dict[str, Any]

class DashboardStats(BaseModel):
    totalRegistrations: int
    recentRegistrations: int
    upcomingWorkshops: List[Workshop]
    nextWorkshopDate: str
    workshopInterestBreakdown: dict
    mostPopularWorkshop: str
    popularWorkshopRegistrations: int
    recentRegistrationsList: List[Registration]

class TestimonialBase(BaseModel):
    name: str
    testimonial: str
    workshopId: str
    year: int
    isVisible: bool = True

class TestimonialCreate(TestimonialBase):
    pass

class Testimonial(TestimonialBase):
    id: str