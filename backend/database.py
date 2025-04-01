import motor.motor_asyncio
from os import environ
import os
from dotenv import load_dotenv
from bson import ObjectId
from datetime import datetime, timedelta

load_dotenv()

# MongoDB connection
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URI)
database = client["science_workshops"]

# Collections
workshops_collection = database.workshops
registrations_collection = database.registrations


# Helper functions to convert between MongoDB ObjectId and string
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


# Initialize workshops data
async def init_workshops():
    count = await workshops_collection.count_documents({})
    if count == 0:
        default_workshops = [
            {
                "title": "Astronomy and Space Exploration",
                "description": "Embark on a cosmic journey through our solar system and beyond. This workshop introduces participants to the wonders of the universe, with hands-on telescope observations, planetarium experiences, and interactive space science activities.",
                "date": "2023-07-15",
                "time": "6:00 PM - 9:00 PM",
                "location": "City Observatory and Science Center",
                "audience": "Ages 10 and above",
                "duration": "3 hours",
                "fee": 25.00,
                "registrationDeadline": "2023-07-10",
                "learningOutcomes": [
                    "Understand basic astronomical concepts and celestial bodies",
                    "Learn how to use telescopes and star charts",
                    "Discover current space missions and exploration technologies",
                    "Identify major constellations visible in the night sky"
                ]
            },
            {
                "title": "Chemistry Lab Experience",
                "description": "Dive into the fascinating world of chemistry with this interactive laboratory workshop. Participants will conduct exciting experiments, learn about chemical reactions, and explore the molecular building blocks that make up our world.",
                "date": "2023-07-22",
                "time": "10:00 AM - 1:00 PM",
                "location": "University Science Building, Lab 103",
                "audience": "Ages 12 and above",
                "duration": "3 hours",
                "fee": 30.00,
                "registrationDeadline": "2023-07-17",
                "learningOutcomes": [
                    "Perform safe and engaging chemistry experiments",
                    "Understand chemical reactions and their applications",
                    "Learn laboratory techniques and safety protocols",
                    "Connect chemistry concepts to everyday phenomena"
                ]
            }
        ]
        await workshops_collection.insert_many(default_workshops)


# Workshop operations
async def get_all_workshops():
    await init_workshops()  # Ensure workshop data exists
    workshops = await workshops_collection.find().to_list(length=100)
    return serialize_list(workshops)


async def create_workshop(workshop_data):
    result = await workshops_collection.insert_one(workshop_data)
    new_workshop = await workshops_collection.find_one({"_id": result.inserted_id})
    return serialize_doc_id(new_workshop)


# Registration operations
async def register_for_workshop(registration_data):
    registration_data["registrationDate"] = datetime.now()
    result = await registrations_collection.insert_one(registration_data)
    created_registration = await registrations_collection.find_one({"_id": result.inserted_id})
    return serialize_doc_id(created_registration)


async def get_all_registrations():
    registrations = await registrations_collection.find().sort("registrationDate", -1).to_list(length=1000)
    return serialize_list(registrations)


# Dashboard statistics
async def get_dashboard_stats():
    # Total registrations
    total_registrations = await registrations_collection.count_documents({})
    
    # Recent registrations (last 7 days)
    seven_days_ago = datetime.now() - timedelta(days=7)
    recent_count = await registrations_collection.count_documents({"registrationDate": {"$gte": seven_days_ago}})
    
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
            if interest == "astronomy":
                most_popular_workshop = "Astronomy and Space Exploration"
            elif interest == "chemistry":
                most_popular_workshop = "Chemistry Lab Experience"
            elif interest == "both":
                most_popular_workshop = "Both Workshops"
            else:
                most_popular_workshop = "Undecided"
    
    # Recent registrations list
    recent_registrations = await registrations_collection.find().sort("registrationDate", -1).limit(5).to_list(length=5)
    
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