import motor.motor_asyncio
from os import environ
import os
from dotenv import load_dotenv
from bson import ObjectId
from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import jwt
from typing import List, Dict, Any, Optional
import models

load_dotenv()

# MongoDB connection
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
SECRET_KEY = os.getenv("SECRET_KEY", "a_secret_key_for_jwt_should_be_in_env")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 day

client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URI)
database = client["science_workshops"]

# Collections
workshops_collection = database.workshops
registrations_collection = database.registrations
users_collection = database.users
testimonials_collection = database.testimonials

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Helper functions
def get_object_id(id_str):
    if isinstance(id_str, str):
        return ObjectId(id_str)
    return id_str

def serialize_doc_id(doc):
    if doc and "_id" in doc:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
    return doc

def serialize_list(docs):
    return [serialize_doc_id(doc) for doc in docs]

# Auth functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# User operations
async def create_user(user_data: models.UserCreate):
    user_dict = user_data.dict()
    user_dict["password"] = get_password_hash(user_dict["password"])
    user_dict["role"] = models.UserRole.USER
    user_dict["created_at"] = datetime.now()
    
    # Check if user already exists
    existing_user = await users_collection.find_one({"email": user_dict["email"]})
    if existing_user:
        return None
    
    result = await users_collection.insert_one(user_dict)
    new_user = await users_collection.find_one({"_id": result.inserted_id})
    return serialize_doc_id(new_user)

async def authenticate_user(email: str, password: str):
    user = await users_collection.find_one({"email": email})
    if not user:
        return None
    if not verify_password(password, user["password"]):
        return None
    return serialize_doc_id(user)

async def get_user(user_id: str):
    user = await users_collection.find_one({"_id": get_object_id(user_id)})
    if user:
        return serialize_doc_id(user)
    return None

async def get_user_by_email(email: str):
    user = await users_collection.find_one({"email": email})
    if user:
        return serialize_doc_id(user)
    return None

async def update_user_role(user_id: str, role: str):
    await users_collection.update_one(
        {"_id": get_object_id(user_id)},
        {"$set": {"role": role}}
    )
    return await get_user(user_id)

# Workshop operations
async def get_all_workshops():
    workshops = await workshops_collection.find().sort("date", 1).to_list(length=100)
    return serialize_list(workshops)

async def get_workshop(workshop_id: str):
    workshop = await workshops_collection.find_one({"_id": get_object_id(workshop_id)})
    if workshop:
        return serialize_doc_id(workshop)
    return None

async def create_workshop(workshop_data: Dict[str, Any]):
    workshop_data["created_at"] = datetime.now()
    workshop_data["updated_at"] = datetime.now()
    result = await workshops_collection.insert_one(workshop_data)
    new_workshop = await workshops_collection.find_one({"_id": result.inserted_id})
    return serialize_doc_id(new_workshop)

async def update_workshop(workshop_id: str, workshop_data: Dict[str, Any]):
    workshop_data["updated_at"] = datetime.now()
    await workshops_collection.update_one(
        {"_id": get_object_id(workshop_id)},
        {"$set": workshop_data}
    )
    return await get_workshop(workshop_id)

async def delete_workshop(workshop_id: str):
    result = await workshops_collection.delete_one({"_id": get_object_id(workshop_id)})
    return result.deleted_count > 0

# Registration operations
async def register_for_workshop(registration_data: Dict[str, Any]):
    registration_data["created_at"] = datetime.now()
    registration_data["updated_at"] = datetime.now()
    result = await registrations_collection.insert_one(registration_data)
    created_registration = await registrations_collection.find_one({"_id": result.inserted_id})
    return serialize_doc_id(created_registration)

async def get_all_registrations():
    registrations = await registrations_collection.find().sort("created_at", -1).to_list(length=1000)
    return serialize_list(registrations)

async def get_user_registrations(user_id: str):
    registrations = await registrations_collection.find({"userId": user_id}).sort("created_at", -1).to_list(length=100)
    return serialize_list(registrations)

async def get_registration(registration_id: str):
    registration = await registrations_collection.find_one({"_id": get_object_id(registration_id)})
    if registration:
        return serialize_doc_id(registration)
    return None

async def update_registration_status(registration_id: str, status: str):
    await registrations_collection.update_one(
        {"_id": get_object_id(registration_id)},
        {"$set": {"registrationStatus": status, "updated_at": datetime.now()}}
    )
    return await get_registration(registration_id)

async def delete_registration(registration_id: str):
    result = await registrations_collection.delete_one({"_id": get_object_id(registration_id)})
    return result.deleted_count > 0

# Testimonial operations
async def create_testimonial(testimonial_data: Dict[str, Any]):
    result = await testimonials_collection.insert_one(testimonial_data)
    new_testimonial = await testimonials_collection.find_one({"_id": result.inserted_id})
    return serialize_doc_id(new_testimonial)

async def get_visible_testimonials():
    testimonials = await testimonials_collection.find({"isVisible": True}).to_list(length=100)
    return serialize_list(testimonials)

async def get_all_testimonials():
    testimonials = await testimonials_collection.find().to_list(length=100)
    return serialize_list(testimonials)

# Dashboard statistics
async def get_dashboard_stats():
    # Total registrations
    total_registrations = await registrations_collection.count_documents({})
    
    # Recent registrations (last 7 days)
    seven_days_ago = datetime.now() - timedelta(days=7)
    recent_count = await registrations_collection.count_documents({"created_at": {"$gte": seven_days_ago}})
    
    # Get upcoming workshops
    workshops = await workshops_collection.find().sort("date", 1).to_list(length=10)
    workshops = serialize_list(workshops)
    upcoming_workshops = [w for w in workshops if datetime.strptime(w["date"], "%Y-%m-%d") > datetime.now()]
    
    # Get next workshop date
    next_workshop_date = "No upcoming workshops" if not upcoming_workshops else upcoming_workshops[0]["date"]
    
    # Workshop interest breakdown
    pipeline = [
        {"$group": {"_id": "$workshopInterest", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    workshop_interest = await registrations_collection.aggregate(pipeline).to_list(length=10)
    
    workshop_interest_breakdown = {}
    most_popular_workshop = "None"
    popular_workshop_registrations = 0
    
    for item in workshop_interest:
        interest = item["_id"]
        count = item["count"]
        workshop_interest_breakdown[interest] = count
        
        if count > popular_workshop_registrations:
            popular_workshop_registrations = count
            most_popular_workshop = interest
    
    # Recent registrations list
    recent_registrations = await registrations_collection.find().sort("created_at", -1).limit(5).to_list(length=5)
    
    return {
        "totalRegistrations": total_registrations,
        "recentRegistrations": recent_count,
        "upcomingWorkshops": upcoming_workshops,
        "nextWorkshopDate": next_workshop_date,
        "workshopInterestBreakdown": workshop_interest_breakdown,
        "mostPopularWorkshop": most_popular_workshop,
        "popularWorkshopRegistrations": popular_workshop_registrations,
        "recentRegistrationsList": serialize_list(recent_registrations)
    }