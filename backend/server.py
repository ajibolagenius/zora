from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header, Response, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import httpx
import stripe

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'zora_market')]

# Stripe configuration (placeholder keys - replace with actual keys)
stripe.api_key = os.environ.get('STRIPE_SECRET_KEY', 'sk_test_placeholder')
STRIPE_PUBLISHABLE_KEY = os.environ.get('STRIPE_PUBLISHABLE_KEY', 'pk_test_placeholder')

app = FastAPI(title="Zora African Market API")
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ===================== MODELS =====================

# User Models
class User(BaseModel):
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    phone: Optional[str] = None
    membership_tier: str = "bronze"
    zora_credits: float = 0.0
    loyalty_points: int = 0
    referral_code: Optional[str] = None
    cultural_interests: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserUpdate(BaseModel):
    phone: Optional[str] = None
    cultural_interests: Optional[List[str]] = None

# Address Models
class Address(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    label: str = "Home"
    line1: str
    line2: Optional[str] = None
    city: str
    postcode: str
    country: str = "United Kingdom"
    is_default: bool = False
    instructions: Optional[str] = None

class AddressCreate(BaseModel):
    label: str = "Home"
    line1: str
    line2: Optional[str] = None
    city: str
    postcode: str
    instructions: Optional[str] = None

# Vendor Models
class OpeningHours(BaseModel):
    day: str
    open: str
    close: str
    is_closed: bool = False

class Vendor(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    cover_image: str
    logo_url: str
    category: str
    regions: List[str]
    rating: float = 4.5
    review_count: int = 0
    is_verified: bool = True
    tag: Optional[str] = None
    distance: Optional[str] = None
    delivery_time: str = "20-30 min"
    delivery_fee: float = 2.99
    min_order: float = 10.0
    address: Optional[str] = None
    opening_hours: List[OpeningHours] = []
    is_open: bool = True

# Product Models
class NutritionInfo(BaseModel):
    serving_size: Optional[str] = None
    calories: Optional[int] = None
    protein: Optional[str] = None
    carbs: Optional[str] = None
    fat: Optional[str] = None
    fiber: Optional[str] = None
    sodium: Optional[str] = None

class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    vendor_id: str
    name: str
    description: str
    price: float
    original_price: Optional[float] = None
    currency: str = "GBP"
    image_url: str
    images: List[str] = []
    category: str
    subcategory: Optional[str] = None
    region: str
    weight: Optional[str] = None
    unit: Optional[str] = None
    badge: Optional[str] = None
    rating: float = 4.5
    review_count: int = 0
    in_stock: bool = True
    stock_quantity: int = 100
    attributes: Dict[str, str] = {}
    nutrition_info: Optional[NutritionInfo] = None
    origin: Optional[str] = None
    certifications: List[str] = []

# Order Models
class OrderItem(BaseModel):
    product_id: str
    vendor_id: str
    name: str
    image_url: str
    price: float
    quantity: int
    variant: Optional[str] = None

class OrderCreate(BaseModel):
    items: List[OrderItem]
    delivery_address: Optional[Address] = None
    delivery_option: str = "delivery"
    payment_method: str = "card"
    promo_code: Optional[str] = None

class Order(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    order_number: str = Field(default_factory=lambda: f"ZM-{uuid.uuid4().hex[:8].upper()}")
    status: str = "pending"
    items: List[OrderItem]
    subtotal: float
    delivery_fee: float = 2.99
    service_fee: float = 0.50
    discount: float = 0.0
    total: float
    currency: str = "GBP"
    delivery_address: Optional[Dict] = None
    delivery_option: str = "delivery"
    payment_method: str = "card"
    payment_intent_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    estimated_delivery: Optional[datetime] = None
    delivered_at: Optional[datetime] = None

# Cart Models
class CartItem(BaseModel):
    product_id: str
    vendor_id: str
    quantity: int
    variant: Optional[str] = None

class CartUpdate(BaseModel):
    items: List[CartItem]

# Review Models
class Review(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    user_name: str
    user_picture: Optional[str] = None
    product_id: Optional[str] = None
    vendor_id: Optional[str] = None
    rating: int
    comment: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ReviewCreate(BaseModel):
    product_id: Optional[str] = None
    vendor_id: Optional[str] = None
    rating: int
    comment: str

# Region Model
class Region(BaseModel):
    id: str
    name: str
    image_url: str
    description: Optional[str] = None

# Banner Model
class Banner(BaseModel):
    id: str
    title: str
    subtitle: str
    image_url: str
    cta_text: str
    cta_link: str
    badge: Optional[str] = None

# Session Models
class SessionDataResponse(BaseModel):
    id: str
    email: str
    name: str
    picture: Optional[str] = None
    session_token: str

# ===================== AUTH HELPERS =====================

async def get_current_user(authorization: Optional[str] = Header(None), request: Request = None) -> Optional[User]:
    session_token = None
    
    # Check cookie first
    if request and request.cookies.get("session_token"):
        session_token = request.cookies.get("session_token")
    # Then check Authorization header
    elif authorization and authorization.startswith("Bearer "):
        session_token = authorization.replace("Bearer ", "")
    
    if not session_token:
        return None
    
    session = await db.user_sessions.find_one({"session_token": session_token}, {"_id": 0})
    if not session:
        return None
    
    # Check expiry with timezone awareness
    expires_at = session.get("expires_at")
    if expires_at:
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        if expires_at < datetime.now(timezone.utc):
            return None
    
    user_doc = await db.users.find_one({"user_id": session["user_id"]}, {"_id": 0})
    if user_doc:
        return User(**user_doc)
    return None

async def require_auth(authorization: Optional[str] = Header(None), request: Request = None) -> User:
    user = await get_current_user(authorization, request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user

# ===================== AUTH ROUTES =====================

@api_router.post("/auth/session")
async def exchange_session(request: Request, response: Response):
    """Exchange session_id for session_token"""
    body = await request.json()
    session_id = body.get("session_id")
    
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id required")
    
    # Call Emergent Auth API
    async with httpx.AsyncClient() as client:
        try:
            auth_response = await client.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers={"X-Session-ID": session_id}
            )
            if auth_response.status_code != 200:
                raise HTTPException(status_code=401, detail="Invalid session")
            
            user_data = auth_response.json()
        except Exception as e:
            logger.error(f"Auth error: {e}")
            raise HTTPException(status_code=500, detail="Authentication failed")
    
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data["email"]}, {"_id": 0})
    
    if existing_user:
        user_id = existing_user["user_id"]
    else:
        # Create new user
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        referral_code = f"ZORA{uuid.uuid4().hex[:6].upper()}"
        
        new_user = {
            "user_id": user_id,
            "email": user_data["email"],
            "name": user_data["name"],
            "picture": user_data.get("picture"),
            "membership_tier": "bronze",
            "zora_credits": 5.0,  # Welcome bonus
            "loyalty_points": 100,
            "referral_code": referral_code,
            "cultural_interests": [],
            "created_at": datetime.now(timezone.utc)
        }
        await db.users.insert_one(new_user)
    
    # Store session
    session_token = user_data["session_token"]
    await db.user_sessions.update_one(
        {"user_id": user_id},
        {
            "$set": {
                "user_id": user_id,
                "session_token": session_token,
                "expires_at": datetime.now(timezone.utc) + timedelta(days=7),
                "created_at": datetime.now(timezone.utc)
            }
        },
        upsert=True
    )
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=7 * 24 * 60 * 60,
        path="/"
    )
    
    # Get user data
    user_doc = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    
    return {"user": user_doc, "session_token": session_token}

@api_router.get("/auth/me")
async def get_me(user: User = Depends(require_auth)):
    return user

@api_router.post("/auth/logout")
async def logout(response: Response, user: User = Depends(require_auth)):
    await db.user_sessions.delete_one({"user_id": user.user_id})
    response.delete_cookie("session_token", path="/")
    return {"message": "Logged out"}

@api_router.put("/auth/profile")
async def update_profile(update: UserUpdate, user: User = Depends(require_auth)):
    update_data = {k: v for k, v in update.dict().items() if v is not None}
    if update_data:
        await db.users.update_one({"user_id": user.user_id}, {"$set": update_data})
    updated = await db.users.find_one({"user_id": user.user_id}, {"_id": 0})
    return updated

# ===================== HOME & DISCOVERY ROUTES =====================

@api_router.get("/home")
async def get_home_data():
    """Get home page data including banners, regions, featured vendors, and popular products"""
    
    # Get banners
    banners = await db.banners.find({}, {"_id": 0}).to_list(10)
    if not banners:
        banners = [
            {
                "id": "banner-1",
                "title": "The Perfect Jollof Bundle",
                "subtitle": "Everything you need for an authentic taste of home, delivered in 30 mins.",
                "image_url": "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800",
                "cta_text": "Shop Collection",
                "cta_link": "/collection/jollof",
                "badge": "FEATURED"
            }
        ]
    
    # Get regions
    regions = await db.regions.find({}, {"_id": 0}).to_list(10)
    if not regions:
        regions = [
            {"id": "west-africa", "name": "West Africa", "image_url": "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?w=200"},
            {"id": "east-africa", "name": "East Africa", "image_url": "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=200"},
            {"id": "north-africa", "name": "North Africa", "image_url": "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=200"},
            {"id": "south-africa", "name": "South Africa", "image_url": "https://images.unsplash.com/photo-1484318571209-661cf29a69c3?w=200"},
            {"id": "central-africa", "name": "Central Africa", "image_url": "https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=200"}
        ]
    
    # Get featured vendors
    vendors = await db.vendors.find({}, {"_id": 0}).limit(10).to_list(10)
    if not vendors:
        vendors = await seed_vendors()
    
    # Get popular products
    products = await db.products.find({}, {"_id": 0}).limit(20).to_list(20)
    if not products:
        products = await seed_products()
    
    return {
        "banners": banners,
        "regions": regions,
        "featured_vendors": vendors[:6],
        "popular_products": products[:12]
    }

@api_router.get("/regions")
async def get_regions():
    regions = await db.regions.find({}, {"_id": 0}).to_list(20)
    if not regions:
        regions = [
            {"id": "west-africa", "name": "West Africa", "image_url": "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?w=200"},
            {"id": "east-africa", "name": "East Africa", "image_url": "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=200"},
            {"id": "north-africa", "name": "North Africa", "image_url": "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=200"},
            {"id": "south-africa", "name": "South Africa", "image_url": "https://images.unsplash.com/photo-1484318571209-661cf29a69c3?w=200"},
            {"id": "central-africa", "name": "Central Africa", "image_url": "https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=200"}
        ]
    return regions

# ===================== VENDOR ROUTES =====================

@api_router.get("/vendors")
async def get_vendors(region: Optional[str] = None, category: Optional[str] = None):
    query = {}
    if region:
        query["regions"] = region
    if category:
        query["category"] = category
    
    vendors = await db.vendors.find(query, {"_id": 0}).to_list(50)
    if not vendors:
        vendors = await seed_vendors()
    return vendors

@api_router.get("/vendors/{vendor_id}")
async def get_vendor(vendor_id: str):
    vendor = await db.vendors.find_one({"id": vendor_id}, {"_id": 0})
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return vendor

@api_router.get("/vendors/{vendor_id}/products")
async def get_vendor_products(vendor_id: str, category: Optional[str] = None):
    query = {"vendor_id": vendor_id}
    if category:
        query["category"] = category
    products = await db.products.find(query, {"_id": 0}).to_list(100)
    return products

@api_router.get("/vendors/{vendor_id}/reviews")
async def get_vendor_reviews(vendor_id: str):
    reviews = await db.reviews.find({"vendor_id": vendor_id}, {"_id": 0}).sort("created_at", -1).to_list(50)
    return reviews

# ===================== PRODUCT ROUTES =====================

@api_router.get("/products")
async def get_products(
    region: Optional[str] = None,
    category: Optional[str] = None,
    search: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    limit: int = 20,
    skip: int = 0
):
    query = {}
    if region:
        query["region"] = region
    if category:
        query["category"] = category
    if min_price is not None:
        query["price"] = {"$gte": min_price}
    if max_price is not None:
        query.setdefault("price", {})["$lte"] = max_price
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"category": {"$regex": search, "$options": "i"}}
        ]
    
    products = await db.products.find(query, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
    if not products and not query:
        products = await seed_products()
    return products

@api_router.get("/products/{product_id}")
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Get vendor info
    vendor = await db.vendors.find_one({"id": product["vendor_id"]}, {"_id": 0})
    product["vendor"] = vendor
    
    return product

@api_router.get("/products/{product_id}/reviews")
async def get_product_reviews(product_id: str):
    reviews = await db.reviews.find({"product_id": product_id}, {"_id": 0}).sort("created_at", -1).to_list(50)
    return reviews

@api_router.get("/products/region/{region}")
async def get_products_by_region(region: str):
    products = await db.products.find({"region": region}, {"_id": 0}).to_list(50)
    return products

@api_router.get("/products/popular")
async def get_popular_products():
    products = await db.products.find({}, {"_id": 0}).sort("rating", -1).limit(20).to_list(20)
    return products

# ===================== CART ROUTES =====================

@api_router.get("/cart")
async def get_cart(user: User = Depends(require_auth)):
    cart = await db.carts.find_one({"user_id": user.user_id}, {"_id": 0})
    if not cart:
        return {"items": [], "subtotal": 0, "delivery_fee": 0, "total": 0}
    
    # Enrich cart items with product details
    enriched_items = []
    vendors_map = {}
    subtotal = 0
    
    for item in cart.get("items", []):
        product = await db.products.find_one({"id": item["product_id"]}, {"_id": 0})
        if product:
            vendor = await db.vendors.find_one({"id": item["vendor_id"]}, {"_id": 0})
            enriched_item = {
                **item,
                "product": product,
                "vendor": vendor
            }
            enriched_items.append(enriched_item)
            subtotal += product["price"] * item["quantity"]
            
            if vendor:
                if vendor["id"] not in vendors_map:
                    vendors_map[vendor["id"]] = {
                        "id": vendor["id"],
                        "name": vendor["name"],
                        "logo_url": vendor["logo_url"],
                        "delivery_time": vendor["delivery_time"],
                        "delivery_fee": vendor["delivery_fee"],
                        "items": [],
                        "subtotal": 0
                    }
                vendors_map[vendor["id"]]["items"].append(enriched_item)
                vendors_map[vendor["id"]]["subtotal"] += product["price"] * item["quantity"]
    
    # Calculate delivery fee (sum of unique vendor fees)
    delivery_fee = sum(v["delivery_fee"] for v in vendors_map.values())
    service_fee = 0.50
    total = subtotal + delivery_fee + service_fee
    
    return {
        "items": enriched_items,
        "vendors": list(vendors_map.values()),
        "subtotal": round(subtotal, 2),
        "delivery_fee": round(delivery_fee, 2),
        "service_fee": service_fee,
        "total": round(total, 2)
    }

@api_router.post("/cart/add")
async def add_to_cart(item: CartItem, user: User = Depends(require_auth)):
    cart = await db.carts.find_one({"user_id": user.user_id})
    
    if not cart:
        cart = {"user_id": user.user_id, "items": []}
    
    # Check if item already in cart
    existing_idx = None
    for idx, existing in enumerate(cart["items"]):
        if existing["product_id"] == item.product_id:
            existing_idx = idx
            break
    
    if existing_idx is not None:
        cart["items"][existing_idx]["quantity"] += item.quantity
    else:
        cart["items"].append(item.dict())
    
    await db.carts.update_one(
        {"user_id": user.user_id},
        {"$set": cart},
        upsert=True
    )
    
    return await get_cart(user)

@api_router.put("/cart/update")
async def update_cart(update: CartUpdate, user: User = Depends(require_auth)):
    await db.carts.update_one(
        {"user_id": user.user_id},
        {"$set": {"items": [item.dict() for item in update.items]}},
        upsert=True
    )
    return await get_cart(user)

@api_router.delete("/cart/item/{product_id}")
async def remove_from_cart(product_id: str, user: User = Depends(require_auth)):
    await db.carts.update_one(
        {"user_id": user.user_id},
        {"$pull": {"items": {"product_id": product_id}}}
    )
    return await get_cart(user)

@api_router.delete("/cart/clear")
async def clear_cart(user: User = Depends(require_auth)):
    await db.carts.delete_one({"user_id": user.user_id})
    return {"items": [], "subtotal": 0, "delivery_fee": 0, "total": 0}

# ===================== ORDER ROUTES =====================

@api_router.post("/orders")
async def create_order(order_input: OrderCreate, user: User = Depends(require_auth)):
    # Calculate totals
    subtotal = 0
    vendor_ids = set()
    
    for item in order_input.items:
        product = await db.products.find_one({"id": item.product_id}, {"_id": 0})
        if product:
            subtotal += product["price"] * item.quantity
            vendor_ids.add(item.vendor_id)
    
    # Get delivery fees
    delivery_fee = 0
    for vendor_id in vendor_ids:
        vendor = await db.vendors.find_one({"id": vendor_id}, {"_id": 0})
        if vendor:
            delivery_fee += vendor.get("delivery_fee", 2.99)
    
    service_fee = 0.50
    total = subtotal + delivery_fee + service_fee
    
    order = Order(
        user_id=user.user_id,
        items=[item.dict() for item in order_input.items],
        subtotal=round(subtotal, 2),
        delivery_fee=round(delivery_fee, 2),
        service_fee=service_fee,
        total=round(total, 2),
        delivery_address=order_input.delivery_address.dict() if order_input.delivery_address else None,
        delivery_option=order_input.delivery_option,
        payment_method=order_input.payment_method,
        estimated_delivery=datetime.now(timezone.utc) + timedelta(minutes=45)
    )
    
    await db.orders.insert_one(order.dict())
    
    # Clear cart after order
    await db.carts.delete_one({"user_id": user.user_id})
    
    return order

@api_router.get("/orders")
async def get_orders(status: Optional[str] = None, user: User = Depends(require_auth)):
    query = {"user_id": user.user_id}
    if status:
        query["status"] = status
    
    orders = await db.orders.find(query, {"_id": 0}).sort("created_at", -1).to_list(50)
    return orders

@api_router.get("/orders/{order_id}")
async def get_order(order_id: str, user: User = Depends(require_auth)):
    order = await db.orders.find_one({"id": order_id, "user_id": user.user_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@api_router.post("/orders/{order_id}/cancel")
async def cancel_order(order_id: str, user: User = Depends(require_auth)):
    order = await db.orders.find_one({"id": order_id, "user_id": user.user_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order["status"] not in ["pending", "confirmed"]:
        raise HTTPException(status_code=400, detail="Cannot cancel order in current status")
    
    await db.orders.update_one(
        {"id": order_id},
        {"$set": {"status": "cancelled"}}
    )
    
    return {"message": "Order cancelled"}

# ===================== PAYMENT ROUTES =====================

@api_router.post("/payments/create-intent")
async def create_payment_intent(request: Request, user: User = Depends(require_auth)):
    body = await request.json()
    amount = body.get("amount", 0)
    order_id = body.get("order_id")
    
    if amount < 0.30:
        raise HTTPException(status_code=400, detail="Amount must be at least £0.30")
    
    try:
        # Create Stripe PaymentIntent
        intent = stripe.PaymentIntent.create(
            amount=int(amount * 100),  # Convert to pence
            currency="gbp",
            metadata={
                "user_id": user.user_id,
                "order_id": order_id or ""
            }
        )
        
        # Update order with payment intent ID
        if order_id:
            await db.orders.update_one(
                {"id": order_id},
                {"$set": {"payment_intent_id": intent.id}}
            )
        
        return {
            "client_secret": intent.client_secret,
            "payment_intent_id": intent.id,
            "publishable_key": STRIPE_PUBLISHABLE_KEY
        }
    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@api_router.post("/payments/confirm")
async def confirm_payment(request: Request, user: User = Depends(require_auth)):
    body = await request.json()
    payment_intent_id = body.get("payment_intent_id")
    
    try:
        intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        
        if intent.status == "succeeded":
            # Update order status
            order_id = intent.metadata.get("order_id")
            if order_id:
                await db.orders.update_one(
                    {"id": order_id},
                    {"$set": {"status": "confirmed"}}
                )
            
            return {"success": True, "status": "succeeded"}
        else:
            return {"success": False, "status": intent.status}
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/payments/config")
async def get_payment_config():
    return {"publishable_key": STRIPE_PUBLISHABLE_KEY}

# ===================== ADDRESS ROUTES =====================

@api_router.get("/addresses")
async def get_addresses(user: User = Depends(require_auth)):
    addresses = await db.addresses.find({"user_id": user.user_id}, {"_id": 0}).to_list(20)
    return addresses

@api_router.post("/addresses")
async def create_address(address: AddressCreate, user: User = Depends(require_auth)):
    new_address = Address(
        user_id=user.user_id,
        **address.dict()
    )
    await db.addresses.insert_one(new_address.dict())
    return new_address

@api_router.put("/addresses/{address_id}")
async def update_address(address_id: str, address: AddressCreate, user: User = Depends(require_auth)):
    await db.addresses.update_one(
        {"id": address_id, "user_id": user.user_id},
        {"$set": address.dict()}
    )
    updated = await db.addresses.find_one({"id": address_id}, {"_id": 0})
    return updated

@api_router.delete("/addresses/{address_id}")
async def delete_address(address_id: str, user: User = Depends(require_auth)):
    await db.addresses.delete_one({"id": address_id, "user_id": user.user_id})
    return {"message": "Address deleted"}

# ===================== REVIEW ROUTES =====================

@api_router.post("/reviews")
async def create_review(review: ReviewCreate, user: User = Depends(require_auth)):
    new_review = Review(
        user_id=user.user_id,
        user_name=user.name,
        user_picture=user.picture,
        **review.dict()
    )
    await db.reviews.insert_one(new_review.dict())
    
    # Update product/vendor rating
    if review.product_id:
        reviews = await db.reviews.find({"product_id": review.product_id}, {"_id": 0}).to_list(1000)
        avg_rating = sum(r["rating"] for r in reviews) / len(reviews) if reviews else 0
        await db.products.update_one(
            {"id": review.product_id},
            {"$set": {"rating": round(avg_rating, 1), "review_count": len(reviews)}}
        )
    
    if review.vendor_id:
        reviews = await db.reviews.find({"vendor_id": review.vendor_id}, {"_id": 0}).to_list(1000)
        avg_rating = sum(r["rating"] for r in reviews) / len(reviews) if reviews else 0
        await db.vendors.update_one(
            {"id": review.vendor_id},
            {"$set": {"rating": round(avg_rating, 1), "review_count": len(reviews)}}
        )
    
    return new_review

# ===================== SEARCH ROUTES =====================

@api_router.get("/search")
async def search(q: str, type: Optional[str] = None):
    results = {"products": [], "vendors": []}
    
    if not type or type == "products":
        products = await db.products.find(
            {"$or": [
                {"name": {"$regex": q, "$options": "i"}},
                {"description": {"$regex": q, "$options": "i"}},
                {"category": {"$regex": q, "$options": "i"}}
            ]},
            {"_id": 0}
        ).limit(20).to_list(20)
        results["products"] = products
    
    if not type or type == "vendors":
        vendors = await db.vendors.find(
            {"$or": [
                {"name": {"$regex": q, "$options": "i"}},
                {"description": {"$regex": q, "$options": "i"}},
                {"category": {"$regex": q, "$options": "i"}}
            ]},
            {"_id": 0}
        ).limit(20).to_list(20)
        results["vendors"] = vendors
    
    return results

# ===================== SEED DATA =====================

async def seed_vendors():
    vendors = [
        {
            "id": "vendor-mama-kitchen",
            "name": "Mama's Kitchen",
            "description": "Authentic West African spices and grains, sourced directly from local farmers.",
            "cover_image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800",
            "logo_url": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
            "category": "Spices & Grains",
            "regions": ["west-africa"],
            "rating": 4.8,
            "review_count": 1247,
            "is_verified": True,
            "tag": "POPULAR",
            "delivery_time": "20-30 min",
            "delivery_fee": 2.99,
            "min_order": 10.0,
            "is_open": True
        },
        {
            "id": "vendor-lagos-fresh",
            "name": "Lagos Fresh",
            "description": "Fresh produce and vegetables, delivered daily from trusted farms.",
            "cover_image": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800",
            "logo_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
            "category": "Fresh Produce",
            "regions": ["west-africa"],
            "rating": 4.6,
            "review_count": 823,
            "is_verified": True,
            "tag": None,
            "delivery_time": "45-55 min",
            "delivery_fee": 3.49,
            "min_order": 15.0,
            "is_open": True
        },
        {
            "id": "vendor-nairobi-textiles",
            "name": "Nairobi Textiles",
            "description": "Beautiful handwoven fabrics and traditional African textiles.",
            "cover_image": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800",
            "logo_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
            "category": "Textiles & Fabrics",
            "regions": ["east-africa"],
            "rating": 4.9,
            "review_count": 456,
            "is_verified": True,
            "tag": "TOP RATED",
            "delivery_time": "2-3 days",
            "delivery_fee": 4.99,
            "min_order": 25.0,
            "is_open": True
        },
        {
            "id": "vendor-cairo-spices",
            "name": "Cairo Spice House",
            "description": "Premium North African spices and aromatic blends.",
            "cover_image": "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=800",
            "logo_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
            "category": "Spices & Seasonings",
            "regions": ["north-africa"],
            "rating": 4.7,
            "review_count": 678,
            "is_verified": True,
            "tag": None,
            "delivery_time": "30-40 min",
            "delivery_fee": 2.49,
            "min_order": 12.0,
            "is_open": True
        },
        {
            "id": "vendor-cape-foods",
            "name": "Cape Town Foods",
            "description": "South African delicacies and biltong specialists.",
            "cover_image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
            "logo_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
            "category": "Meats & Snacks",
            "regions": ["south-africa"],
            "rating": 4.5,
            "review_count": 534,
            "is_verified": True,
            "tag": "NEW",
            "delivery_time": "25-35 min",
            "delivery_fee": 3.99,
            "min_order": 20.0,
            "is_open": True
        }
    ]
    
    for vendor in vendors:
        await db.vendors.update_one({"id": vendor["id"]}, {"$set": vendor}, upsert=True)
    
    return vendors

async def seed_products():
    products = [
        {
            "id": "prod-jollof-seasoning",
            "vendor_id": "vendor-mama-kitchen",
            "name": "Jollof Seasoning",
            "description": "Our signature blend for the perfect Jollof rice. Made with premium tomatoes, peppers, and secret spices.",
            "price": 5.99,
            "currency": "GBP",
            "image_url": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400",
            "images": [],
            "category": "Spices",
            "region": "west-africa",
            "weight": "100g",
            "unit": "Pack",
            "badge": "HOT",
            "rating": 4.9,
            "review_count": 342,
            "in_stock": True,
            "certifications": ["ORGANIC"]
        },
        {
            "id": "prod-suya-spice",
            "vendor_id": "vendor-mama-kitchen",
            "name": "Suya Spice Mix",
            "description": "Authentic Nigerian suya spice blend. Perfect for grilling and BBQ.",
            "price": 12.50,
            "currency": "GBP",
            "image_url": "https://images.unsplash.com/photo-1599909533167-b6dcb tried7c5c6?w=400",
            "images": [],
            "category": "Spices",
            "region": "west-africa",
            "weight": "250g",
            "unit": "Jar",
            "badge": None,
            "rating": 4.8,
            "review_count": 189,
            "in_stock": True,
            "certifications": ["TOP RATED"]
        },
        {
            "id": "prod-berbere-blend",
            "vendor_id": "vendor-mama-kitchen",
            "name": "Berbere Blend",
            "description": "Ethiopian spice blend with chili, fenugreek, and aromatic herbs.",
            "price": 8.99,
            "currency": "GBP",
            "image_url": "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=400",
            "images": [],
            "category": "Spices",
            "region": "east-africa",
            "weight": "150g",
            "unit": "Pack",
            "badge": None,
            "rating": 4.7,
            "review_count": 156,
            "in_stock": True,
            "certifications": []
        },
        {
            "id": "prod-basmati-rice",
            "vendor_id": "vendor-mama-kitchen",
            "name": "Premium Aged Basmati Rice",
            "description": "Our premium aged Basmati rice is carefully selected from the foothills of the Himalayas. Aged for 2 years to enhance its aroma and non-sticky texture, perfectly suited for biryanis and pilafs.",
            "price": 12.50,
            "original_price": 15.00,
            "currency": "GBP",
            "image_url": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
            "images": [],
            "category": "Grains",
            "region": "east-africa",
            "weight": "5kg",
            "unit": "Bag",
            "badge": None,
            "rating": 4.8,
            "review_count": 423,
            "in_stock": True,
            "certifications": ["ORGANIC", "TOP RATED", "ECO-FRIENDLY"]
        },
        {
            "id": "prod-egusi-seeds",
            "vendor_id": "vendor-mama-kitchen",
            "name": "Egusi Seeds",
            "description": "Ground melon seeds for traditional Nigerian egusi soup.",
            "price": 15.00,
            "currency": "GBP",
            "image_url": "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=400",
            "images": [],
            "category": "Seeds & Nuts",
            "region": "west-africa",
            "weight": "500g",
            "unit": "Bulk",
            "badge": "HOT",
            "rating": 4.6,
            "review_count": 267,
            "in_stock": True,
            "certifications": []
        },
        {
            "id": "prod-dried-peppers",
            "vendor_id": "vendor-mama-kitchen",
            "name": "Dried Peppers",
            "description": "Authentic African dried peppers, perfect for stews and soups.",
            "price": 4.50,
            "currency": "GBP",
            "image_url": "https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=400",
            "images": [],
            "category": "Spices",
            "region": "west-africa",
            "weight": "100g",
            "unit": "Bag",
            "badge": None,
            "rating": 4.5,
            "review_count": 134,
            "in_stock": True,
            "certifications": []
        },
        {
            "id": "prod-turmeric-powder",
            "vendor_id": "vendor-mama-kitchen",
            "name": "Turmeric Powder",
            "description": "Premium ground turmeric with high curcumin content.",
            "price": 7.25,
            "currency": "GBP",
            "image_url": "https://images.unsplash.com/photo-1615485500710-aa71d63f5c0c?w=400",
            "images": [],
            "category": "Spices",
            "region": "north-africa",
            "weight": "200g",
            "unit": "Jar",
            "badge": None,
            "rating": 4.7,
            "review_count": 89,
            "in_stock": True,
            "certifications": ["ORGANIC"]
        },
        {
            "id": "prod-kente-cloth",
            "vendor_id": "vendor-nairobi-textiles",
            "name": "Kente Cloth Pattern A",
            "description": "Hand-woven Ghanaian Kente cloth with traditional patterns.",
            "price": 45.00,
            "currency": "GBP",
            "image_url": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400",
            "images": [],
            "category": "Textiles",
            "region": "west-africa",
            "weight": "3 Yards",
            "unit": "Piece",
            "badge": "PREMIUM",
            "rating": 4.9,
            "review_count": 78,
            "in_stock": True,
            "certifications": ["HANDMADE"]
        },
        {
            "id": "prod-dried-okra",
            "vendor_id": "vendor-lagos-fresh",
            "name": "Dried Okra Chips",
            "description": "Crunchy dried okra, perfect for soups and snacking.",
            "price": 8.50,
            "currency": "GBP",
            "image_url": "https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?w=400",
            "images": [],
            "category": "Vegetables",
            "region": "west-africa",
            "weight": "200g",
            "unit": "Pack",
            "badge": None,
            "rating": 4.4,
            "review_count": 156,
            "in_stock": True,
            "certifications": []
        },
        {
            "id": "prod-biltong",
            "vendor_id": "vendor-cape-foods",
            "name": "Traditional Biltong",
            "description": "South African air-dried cured meat, seasoned with traditional spices.",
            "price": 18.99,
            "currency": "GBP",
            "image_url": "https://images.unsplash.com/photo-1558030006-450675393462?w=400",
            "images": [],
            "category": "Meats",
            "region": "south-africa",
            "weight": "250g",
            "unit": "Pack",
            "badge": "BESTSELLER",
            "rating": 4.8,
            "review_count": 312,
            "in_stock": True,
            "certifications": []
        },
        {
            "id": "prod-ras-el-hanout",
            "vendor_id": "vendor-cairo-spices",
            "name": "Ras el Hanout",
            "description": "Classic North African spice blend with over 20 aromatics.",
            "price": 9.99,
            "currency": "GBP",
            "image_url": "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=400",
            "images": [],
            "category": "Spices",
            "region": "north-africa",
            "weight": "100g",
            "unit": "Jar",
            "badge": None,
            "rating": 4.7,
            "review_count": 234,
            "in_stock": True,
            "certifications": ["ARTISANAL"]
        },
        {
            "id": "prod-palm-oil",
            "vendor_id": "vendor-lagos-fresh",
            "name": "Red Palm Oil",
            "description": "Unrefined red palm oil, essential for West African cooking.",
            "price": 11.99,
            "currency": "GBP",
            "image_url": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400",
            "images": [],
            "category": "Oils",
            "region": "west-africa",
            "weight": "500ml",
            "unit": "Bottle",
            "badge": None,
            "rating": 4.6,
            "review_count": 445,
            "in_stock": True,
            "certifications": ["SUSTAINABLE"]
        }
    ]
    
    for product in products:
        await db.products.update_one({"id": product["id"]}, {"$set": product}, upsert=True)
    
    return products

# ===================== HEALTH CHECK =====================

@api_router.get("/")
async def root():
    return {"message": "Zora African Market API", "version": "1.0.0"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy"}

# Include router and configure middleware
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    logger.info("Starting Zora African Market API...")
    # Seed initial data
    await seed_vendors()
    await seed_products()
    logger.info("Database seeded with initial data")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
