from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routers import workshops, admin
import uvicorn

# Initialize FastAPI app
app = FastAPI(
    title="Science Workshop API",
    description="API for managing science workshop registrations",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include routers
app.include_router(workshops.router, tags=["workshops"])
app.include_router(admin.router, tags=["admin"])

@app.get("/", tags=["root"])
async def root():
    """
    Root endpoint returning API information.
    """
    return JSONResponse(content={
        "message": "Welcome to the Science Workshops API",
        "documentation": "/docs",
        "version": "1.0.0"
    })

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)