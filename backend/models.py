from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


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
    learningOutcomes: List[str]


class WorkshopCreate(WorkshopBase):
    pass


class Workshop(WorkshopBase):
    id: str


class RegistrationBase(BaseModel):
    name: str
    email: EmailStr
    phone: str
    age: str
    workshopInterest: str
    message: Optional[str] = None
    agreeToTerms: bool = True


class RegistrationCreate(RegistrationBase):
    pass


class Registration(RegistrationBase):
    id: str
    registrationDate: datetime = Field(default_factory=datetime.now)


class AdminLogin(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    token: str


class DashboardStats(BaseModel):
    totalRegistrations: int
    recentRegistrations: int
    upcomingWorkshops: List[Workshop]
    nextWorkshopDate: str
    workshopInterestBreakdown: dict
    mostPopularWorkshop: str
    popularWorkshopRegistrations: int
    recentRegistrationsList: List[Registration]