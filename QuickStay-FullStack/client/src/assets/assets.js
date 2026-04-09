import logo from './logo.svg'
import searchIcon from './searchIcon.svg'
import userIcon from './userIcon.svg'
import calenderIcon from './calenderIcon.svg'
import locationIcon from './locationIcon.svg'
import starIconFilled from './starIconFilled.svg'
import arrowIcon from './arrowIcon.svg'
import starIconOutlined from './starIconOutlined.svg'
import instagramIcon from './instagramIcon.svg'
import facebookIcon from './facebookIcon.svg'
import twitterIcon from './twitterIcon.svg'
import linkendinIcon from './linkendinIcon.svg'
import freeWifiIcon from './freeWifiIcon.svg'
import freeBreakfastIcon from './freeBreakfastIcon.svg'
import roomServiceIcon from './roomServiceIcon.svg'
import mountainIcon from './mountainIcon.svg'
import poolIcon from './poolIcon.svg'
import homeIcon from './homeIcon.svg'
import closeIcon from './closeIcon.svg'
import locationFilledIcon from './locationFilledIcon.svg'
import heartIcon from './heartIcon.svg'
import badgeIcon from './badgeIcon.svg'
import menuIcon from './menuIcon.svg'
import closeMenu from './closeMenu.svg'
import guestsIcon from './guestsIcon.svg'
import roomImg1 from './roomImg1.png'
import roomImg2 from './roomImg2.png'
import roomImg3 from './roomImg3.png'
import roomImg4 from './roomImg4.png'
import regImage from './regImage.png'
import exclusiveOfferCardImg1 from "./exclusiveOfferCardImg1.png";
import exclusiveOfferCardImg2 from "./exclusiveOfferCardImg2.png";
import exclusiveOfferCardImg3 from "./exclusiveOfferCardImg3.png";
import addIcon from "./addIcon.svg";
import dashboardIcon from "./dashboardIcon.svg";
import listIcon from "./listIcon.svg";
import uploadArea from "./uploadArea.svg";
import totalBookingIcon from "./totalBookingIcon.svg";
import totalRevenueIcon from "./totalRevenueIcon.svg";


export const assets = {
    logo,
    searchIcon,
    userIcon,
    calenderIcon,
    locationIcon,
    starIconFilled,
    arrowIcon,
    starIconOutlined,
    instagramIcon,
    facebookIcon,
    twitterIcon,
    linkendinIcon,
    freeWifiIcon,
    freeBreakfastIcon,
    roomServiceIcon,
    mountainIcon,
    poolIcon,
    closeIcon,
    homeIcon,
    locationFilledIcon,
    heartIcon,
    badgeIcon,
    menuIcon,
    closeMenu,
    guestsIcon,
    roomImg1,
    roomImg2,
    roomImg3,
    roomImg4,
    regImage,
    addIcon,
    dashboardIcon,
    listIcon,
    uploadArea,
    totalBookingIcon,
    totalRevenueIcon,
}

export const cities = [
    "Dubai",
    "Singapore",
    "New York",
    "London",
];

// Exclusive Offers Dummy Data
export const exclusiveOffers = [
    { _id: 1, title: "Summer Escape Package", description: "Enjoy a complimentary night and daily breakfast", priceOff: 25, expiryDate: "Aug 31", image: exclusiveOfferCardImg1 },
    { _id: 2, title: "Romantic Getaway", description: "Special couples package including spa treatment", priceOff: 20, expiryDate: "Sep 20", image: exclusiveOfferCardImg2 },
    { _id: 3, title: "Luxury Retreat", description: "Book 60 days in advance and save on your stay at any of our luxury properties worldwide.", priceOff: 30, expiryDate: "Sep 25", image: exclusiveOfferCardImg3 },
]

// Testimonials Dummy Data
export const testimonials = [
    { id: 1, name: "Emma Rodriguez", address: "Barcelona, Spain", image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200", rating: 5, review: "I've used many booking platforms before, but none compare to the personalized experience and attention to detail that QuickStay provides. Their curated selection of hotels is unmatched." },
    { id: 2, name: "Liam Johnson", address: "New York, USA", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200", rating: 4, review: "QuickStay exceeded my expectations. The booking process was seamless, and the hotels were absolutely top-notch. Highly recommended!" },
    { id: 3, name: "Sophia Lee", address: "Seoul, South Korea", image: "https://images.unsplash.com/photo-1701615004837-40d8573b6652?q=80&w=200", rating: 5, review: "Amazing service! I always find the best luxury accommodations through QuickStay. Their recommendations never disappoint!" }
];

// Hotel Reviews Dummy Data
export const hotelReviewsByHotelId = {
    "67f76393197ac559e4089b72": [
        { id: "rvw-ny-1", name: "Noah Carter", address: "Chicago, USA", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200", rating: 5, review: "The staff were incredibly helpful and the rooms were spotless. Great value for the location." },
        { id: "rvw-ny-2", name: "Mia Thompson", address: "Boston, USA", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200", rating: 4, review: "Loved the breakfast and fast check-in experience. I would definitely book this hotel again." }
    ],
    "67f76393197ac559e4089b73": [
        { id: "rvw-db-1", name: "Ethan Walker", address: "Doha, Qatar", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200", rating: 5, review: "Premium service from start to finish. The pool area and room interiors felt truly luxurious." },
        { id: "rvw-db-2", name: "Ava Davis", address: "Abu Dhabi, UAE", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200", rating: 4, review: "Excellent location and very comfortable family suite. The concierge team was wonderful." }
    ],
    "67f76393197ac559e4089b74": [
        { id: "rvw-sg-1", name: "Lucas Brown", address: "Sydney, Australia", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200", rating: 5, review: "Perfect for business travel. Quiet room, reliable WiFi, and quick access to nearby transit." },
        { id: "rvw-sg-2", name: "Isabella Martin", address: "Kuala Lumpur, Malaysia", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200", rating: 4, review: "Very clean rooms and lovely city views. The check-out process was smooth and fast." }
    ],
    "67f76393197ac559e4089b75": [
        { id: "rvw-ln-1", name: "Oliver Scott", address: "Manchester, UK", image: "https://images.unsplash.com/photo-1504593811423-6dd665756598?q=80&w=200", rating: 5, review: "Elegant property with excellent hospitality. The room service quality was top tier." },
        { id: "rvw-ln-2", name: "Charlotte Evans", address: "Edinburgh, UK", image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=200", rating: 4, review: "Spacious room and fantastic location for sightseeing. Great overall hotel experience." }
    ]
};

// Facility Icon
export const facilityIcons = {
    "Free WiFi": assets.freeWifiIcon,
    "Free Breakfast": assets.freeBreakfastIcon,
    "Room Service": assets.roomServiceIcon,
    "Mountain View": assets.mountainIcon,
    "Pool Access": assets.poolIcon,
};

// For Room Details Page
export const roomCommonData = [
    { icon: assets.homeIcon, title: "Clean & Safe Stay", description: "A well-maintained and hygienic space just for you." },
    { icon: assets.badgeIcon, title: "Enhanced Cleaning", description: "This host follows Staybnb's strict cleaning standards." },
    { icon: assets.locationFilledIcon, title: "Excellent Location", description: "90% of guests rated the location 5 stars." },
    { icon: assets.heartIcon, title: "Smooth Check-In", description: "100% of guests gave check-in a 5-star rating." },
];

// Hotels Dummy Data
export const hotelDummyData = {
    "_id": "67f76393197ac559e4089b72",
    "name": "Urbanza Suites",
    "address": "Main Road 123 Street, 23 Colony",
    "contact": "+0123456789",
    "ownerContact": "+0123456789",
    "owner": "user_2unqyL4diJFP1E3pIBnasc7w8hP",
    "city": "New York",
    "createdAt": "2025-04-10T06:22:11.663Z",
    "updatedAt": "2025-04-10T06:22:11.663Z",
    "__v": 0
}

export const hotels = [
    {
        "_id": "67f76393197ac559e4089b72",
        "name": "Urbanza Suites",
        "address": "Main Road 123 Street, 23 Colony",
        "contact": "+0123456789",
        "ownerContact": "+0123456789",
        "owner": "user_2unqyL4diJFP1E3pIBnasc7w8hP",
        "city": "New York",
        "createdAt": "2025-04-10T06:22:11.663Z",
        "updatedAt": "2025-04-10T06:22:11.663Z",
        "__v": 0
    },
    {
        "_id": "67f76393197ac559e4089b73",
        "name": "Luxury Haven Hotel",
        "address": "Downtown Avenue 456, Business District",
        "contact": "+0123456790",
        "ownerContact": "+0123456790",
        "owner": "user_2unqyL4diJFP1E3pIBnasc7w8hP",
        "city": "Dubai",
        "createdAt": "2025-04-10T06:22:11.663Z",
        "updatedAt": "2025-04-10T06:22:11.663Z",
        "__v": 0
    },
    {
        "_id": "67f76393197ac559e4089b74",
        "name": "Marina Bay Residences",
        "address": "Bay Street 789, Marina District",
        "contact": "+0123456791",
        "ownerContact": "+0123456791",
        "owner": "user_2unqyL4diJFP1E3pIBnasc7w8hP",
        "city": "Singapore",
        "createdAt": "2025-04-10T06:22:11.663Z",
        "updatedAt": "2025-04-10T06:22:11.663Z",
        "__v": 0
    },
    {
        "_id": "67f76393197ac559e4089b75",
        "name": "Royal Thames Hotel",
        "address": "Westminster Lane 321, Central London",
        "contact": "+0123456792",
        "ownerContact": "+0123456792",
        "owner": "user_2unqyL4diJFP1E3pIBnasc7w8hP",
        "city": "London",
        "createdAt": "2025-04-10T06:22:11.663Z",
        "updatedAt": "2025-04-10T06:22:11.663Z",
        "__v": 0
    }
]

// Rooms Dummy Data
export const roomsDummyData = [
    {
        "_id": "67f7647c197ac559e4089b96",
        "hotel": hotels[0],
        "roomType": "Luxury Room",
        "pricePerNight": 500,
        "amenities": ["Free WiFi", "Free Breakfast", "Room Service", "Mountain View", "Pool Access"],
        "images": [roomImg1, roomImg2, roomImg3, roomImg4],
        "isAvailable": true,
        "createdAt": "2025-04-10T06:26:04.013Z",
        "updatedAt": "2025-04-10T06:26:04.013Z",
        "__v": 0
    },
    {
        "_id": "67f76452197ac559e4089b8e",
        "hotel": hotels[0],
        "roomType": "Double Bed",
        "pricePerNight": 700,
        "amenities": ["Room Service", "Mountain View", "Pool Access"],
        "images": [roomImg2, roomImg3, roomImg4, roomImg1],
        "isAvailable": true,
        "createdAt": "2025-04-10T06:25:22.593Z",
        "updatedAt": "2025-04-10T06:25:22.593Z",
        "__v": 0
    },
    {
        "_id": "67f76406197ac559e4089b82",
        "hotel": hotels[0],
        "roomType": "Double Bed",
        "pricePerNight": 900,
        "amenities": ["Free WiFi", "Free Breakfast", "Room Service"],
        "images": [roomImg3, roomImg4, roomImg1, roomImg2],
        "isAvailable": true,
        "createdAt": "2025-04-10T06:24:06.285Z",
        "updatedAt": "2025-04-10T06:24:06.285Z",
        "__v": 0
    },
    {
        "_id": "67f763d8197ac559e4089b7a",
        "hotel": hotels[0],
        "roomType": "Single Bed",
        "pricePerNight": 1100,
        "amenities": ["Free WiFi", "Room Service", "Pool Access"],
        "images": [roomImg4, roomImg1, roomImg2, roomImg3],
        "isAvailable": true,
        "createdAt": "2025-04-10T06:23:20.252Z",
        "updatedAt": "2025-04-10T06:23:20.252Z",
        "__v": 0
    },
    {
        "_id": "67f7647c197ac559e4089b97",
        "hotel": hotels[1],
        "roomType": "Family Suite",
        "pricePerNight": 1300,
        "amenities": ["Free WiFi", "Free Breakfast", "Room Service", "Mountain View", "Pool Access"],
        "images": [roomImg1, roomImg2, roomImg3, roomImg4],
        "isAvailable": true,
        "createdAt": "2025-04-10T06:26:04.013Z",
        "updatedAt": "2025-04-10T06:26:04.013Z",
        "__v": 0
    },
    {
        "_id": "67f76452197ac559e4089b8f",
        "hotel": hotels[1],
        "roomType": "Luxury Room",
        "pricePerNight": 1500,
        "amenities": ["Room Service", "Mountain View", "Pool Access"],
        "images": [roomImg2, roomImg3, roomImg4, roomImg1],
        "isAvailable": true,
        "createdAt": "2025-04-10T06:25:22.593Z",
        "updatedAt": "2025-04-10T06:25:22.593Z",
        "__v": 0
    },
    {
        "_id": "67f76406197ac559e4089b83",
        "hotel": hotels[1],
        "roomType": "Double Bed",
        "pricePerNight": 1700,
        "amenities": ["Free WiFi", "Free Breakfast", "Room Service"],
        "images": [roomImg3, roomImg4, roomImg1, roomImg2],
        "isAvailable": true,
        "createdAt": "2025-04-10T06:24:06.285Z",
        "updatedAt": "2025-04-10T06:24:06.285Z",
        "__v": 0
    },
    {
        "_id": "67f763d8197ac559e4089b7b",
        "hotel": hotels[2],
        "roomType": "Single Bed",
        "pricePerNight": 1900,
        "amenities": ["Free WiFi", "Room Service", "Pool Access"],
        "images": [roomImg4, roomImg1, roomImg2, roomImg3],
        "isAvailable": true,
        "createdAt": "2025-04-10T06:23:20.252Z",
        "updatedAt": "2025-04-10T06:23:20.252Z",
        "__v": 0
    },
    {
        "_id": "67f7647c197ac559e4089b98",
        "hotel": hotels[2],
        "roomType": "Luxury Room",
        "pricePerNight": 2100,
        "amenities": ["Free WiFi", "Free Breakfast", "Room Service", "Mountain View", "Pool Access"],
        "images": [roomImg1, roomImg2, roomImg3, roomImg4],
        "isAvailable": true,
        "createdAt": "2025-04-10T06:26:04.013Z",
        "updatedAt": "2025-04-10T06:26:04.013Z",
        "__v": 0
    },
    {
        "_id": "67f76452197ac559e4089b90",
        "hotel": hotels[2],
        "roomType": "Family Suite",
        "pricePerNight": 2300,
        "amenities": ["Room Service", "Mountain View", "Pool Access"],
        "images": [roomImg2, roomImg3, roomImg4, roomImg1],
        "isAvailable": true,
        "createdAt": "2025-04-10T06:25:22.593Z",
        "updatedAt": "2025-04-10T06:25:22.593Z",
        "__v": 0
    },
    {
        "_id": "67f76406197ac559e4089b84",
        "hotel": hotels[3],
        "roomType": "Double Bed",
        "pricePerNight": 2500,
        "amenities": ["Free WiFi", "Free Breakfast", "Room Service"],
        "images": [roomImg3, roomImg4, roomImg1, roomImg2],
        "isAvailable": true,
        "createdAt": "2025-04-10T06:24:06.285Z",
        "updatedAt": "2025-04-10T06:24:06.285Z",
        "__v": 0
    },
    {
        "_id": "67f763d8197ac559e4089b7c",
        "hotel": hotels[3],
        "roomType": "Luxury Room",
        "pricePerNight": 2700,
        "amenities": ["Free WiFi", "Room Service", "Pool Access"],
        "images": [roomImg4, roomImg1, roomImg2, roomImg3],
        "isAvailable": true,
        "createdAt": "2025-04-10T06:23:20.252Z",
        "updatedAt": "2025-04-10T06:23:20.252Z",
        "__v": 0
    },
    {
        "_id": "67f7647c197ac559e4089b99",
        "hotel": hotels[3],
        "roomType": "Family Suite",
        "pricePerNight": 2900,
        "amenities": ["Free WiFi", "Free Breakfast", "Room Service", "Mountain View", "Pool Access"],
        "images": [roomImg1, roomImg2, roomImg3, roomImg4],
        "isAvailable": true,
        "createdAt": "2025-04-10T06:26:04.013Z",
        "updatedAt": "2025-04-10T06:26:04.013Z",
        "__v": 0
    }
]

// User Dummy Data
export const userDummyData = {
    "_id": "user_2unqyL4diJFP1E3pIBnasc7w8hP",
    "username": "Great Stack",
    "email": "user.greatstack@gmail.com",
    "image": "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJ2N2c5YVpSSEFVYVUxbmVYZ2JkSVVuWnFzWSJ9",
    "role": "hotelOwner",
    "createdAt": "2025-03-25T09:29:16.367Z",
    "updatedAt": "2025-04-10T06:34:48.719Z",
    "__v": 1,
    "recentSearchedCities": [
        "New York"
    ]
}

// User Bookings Dummy Data
export const userBookingsDummyData = [
    {
        "_id": "67f76839994a731e97d3b8ce",
        "user": userDummyData,
        "room": roomsDummyData[1],
        "hotel": hotels[0],
        "checkInDate": "2025-04-30T00:00:00.000Z",
        "checkOutDate": "2025-05-01T00:00:00.000Z",
        "totalPrice": 700,
        "guests": 1,
        "status": "pending",
        "paymentMethod": "Razorpay",
        "isPaid": true,
        "createdAt": "2025-04-10T06:42:01.529Z",
        "updatedAt": "2025-04-10T06:43:54.520Z",
        "__v": 0
    },
    {
        "_id": "67f76829994a731e97d3b8c3",
        "user": userDummyData,
        "room": roomsDummyData[0],
        "hotel": hotels[0],
        "checkInDate": "2025-04-27T00:00:00.000Z",
        "checkOutDate": "2025-04-28T00:00:00.000Z",
        "totalPrice": 500,
        "guests": 1,
        "status": "pending",
        "paymentMethod": "Pay At Hotel",
        "isPaid": false,
        "createdAt": "2025-04-10T06:41:45.873Z",
        "updatedAt": "2025-04-10T06:41:45.873Z",
        "__v": 0
    },
    {
        "_id": "67f76810994a731e97d3b8b4",
        "user": userDummyData,
        "room": roomsDummyData[3],
        "hotel": hotels[0],
        "checkInDate": "2025-04-11T00:00:00.000Z",
        "checkOutDate": "2025-04-12T00:00:00.000Z",
        "totalPrice": 1100,
        "guests": 1,
        "status": "pending",
        "paymentMethod": "Pay At Hotel",
        "isPaid": false,
        "createdAt": "2025-04-10T06:41:20.501Z",
        "updatedAt": "2025-04-10T06:41:20.501Z",
        "__v": 0
    }
]

// Dashboard Dummy Data
export const dashboardDummyData = {
    "totalBookings": 3,
    "totalRevenue": 2300,
    "bookings": userBookingsDummyData
}