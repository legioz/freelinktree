from dotenv import load_dotenv
import os


load_dotenv(".env", override=True)
SECRET_KEY = os.getenv("SECRET_KEY", "")
DEBUG = os.getenv("DEBUG", False)
TITLE = "FreeLinktree"
OPENAPI = "/openapi.json" if DEBUG else None