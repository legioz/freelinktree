from fastapi import FastAPI, Request, Form, status, HTTPException, Query
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware
from deta import Deta
from pydantic import BaseModel
from typing import Optional
import hashlib
import config


app = FastAPI(
    debug=config.DEBUG, 
    title=config.TITLE,
    openapi_url=config.OPENAPI,
)

app.add_middleware(SessionMiddleware, secret_key=config.SECRET_KEY)
deta = Deta(config.SECRET_KEY)
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

users = deta.Base("users")
db_links = deta.Base("user_links")

def get_current_user(request: Request):
    if not request.session.get("user"):
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            f"Invalid Credentials, please login: {request.url_for('login')}",
        )
    else:
        return request.session.get("user")


@app.get("terms_of_use", response_class=HTMLResponse)
async def terms_of_use(request: Request):
    return templates.TemplateResponse("terms_of_use.html", {"request": request})


@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    if request.session:
        return RedirectResponse("links")
    return RedirectResponse("login")


@app.post("/register")
@app.get("/register", response_class=HTMLResponse)
async def register(request: Request, email: str=Form(None), password: str=Form(None)):
    context = {"request": request, "error": False}
    if request.method == "POST":
        if email and password:
            try:
                data = {
                    "email": email,
                    "password": hashlib.sha256(password.encode('utf-8')).hexdigest(),
                }
                users.insert(data)
                return RedirectResponse("login", status.HTTP_302_FOUND)
            except:
                context.update({"error": True})
    return templates.TemplateResponse("register.html", context)


@app.post("/login")
@app.get("/login", response_class=HTMLResponse)
async def login(request: Request, email: str=Form(None), password: str=Form(None)):
    context = {"request": request, "error": False}
    if request.method == "POST":
        if email and password:
            query = {
                "email": email,
                "password":  hashlib.sha256(password.encode('utf-8')).hexdigest()
            }
            result = users.fetch(query, limit=1)
            if result.count >= 1:
                current_user = result.items[0].get("key")
                request.session.update({"user": current_user})
                return RedirectResponse("links", status.HTTP_302_FOUND)
        context.update({"error": True})
    return templates.TemplateResponse("login.html", context)


@app.get("/logout")
def logout(request: Request):
    request.session.clear()
    return RedirectResponse("login")


@app.post("/update_password")
@app.get("/update_password", response_class=HTMLResponse)
async def update_password(request: Request, password: str=Form(None)):
    context = {"request": request}
    if request.method == "POST":
        pass
    return templates.TemplateResponse("update_password.html", context)


@app.post("/recovery")
@app.get("/recovery")
async def recovery(request: Request, email: str=Form(None)):
    context = {"request": request}
    if request.method == "POST":
        # TODO sendmail and shit
        return RedirectResponse(request.url_for("index"))
    return templates.TemplateResponse("recovery.html", context)


@app.get("/links", response_class=HTMLResponse)
@app.get("/links/{other_user}", response_class=HTMLResponse)
async def links(request: Request, other_user: str=None):
    context = {"request": request, "links": []}
    if not other_user:
        user = get_current_user(request)
    else:
        user = other_user
    user_links_list = db_links.fetch({"user": user})
    context.update({"links": user_links_list.items})
    return templates.TemplateResponse("links.html", context)


@app.get("/links/delete/{id}")
async def delete_links(request: Request, id: str):
    if not request.session:
        return RedirectResponse(request.url_for("index"))
    else:
        db_links.delete(id)
        return RedirectResponse(request.url_for("links"), status.HTTP_302_FOUND)


@app.post("/links/create")
async def create_links(request: Request, new_link: str=Form(...), description: str=Form(...)):
    user = get_current_user(request)
    if "http" not in new_link:
        new_link = f"http://{new_link}"
    data = {
        "user": user,
        "description": description.strip(),
        "link": new_link.strip(),
    }
    db_links.put(data)
    return RedirectResponse(request.url_for("links"), status.HTTP_302_FOUND)
