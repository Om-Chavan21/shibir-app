from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routers import workshops, admin, auth, registrations, users
import uvicorn

# Initialize FastAPI app
app = FastAPI(
    title="Vijnana Dals Workshop API",
    description="API for managing Jnana Prabodhini's science workshop registrations",
    version="1.0.0",
    openapi_url="/api/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
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
app.include_router(auth.router)
app.include_router(workshops.router)
app.include_router(registrations.router)
app.include_router(users.router)
app.include_router(admin.router, tags=["admin"])

@app.get("/", tags=["root"])
async def root():
    """
    Root endpoint returning API information.
    """
    return JSONResponse(content={
        "message": "Welcome to the Vijnana Dals Workshops API",
        "documentation": "/docs",
        "version": "1.0.0"
    })

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)