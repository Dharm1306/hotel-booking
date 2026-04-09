import { useAuth, useUser } from "@clerk/clerk-react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'react-hot-toast'
import { useNavigate } from "react-router-dom";
import { assets, roomsDummyData } from "../assets/assets";

const rawBackendUrl = import.meta.env.VITE_BACKEND_URL;
const backendUrl = typeof rawBackendUrl === "string" && rawBackendUrl.trim().length > 0 ? rawBackendUrl.trim() : "";
axios.defaults.baseURL = backendUrl;
axios.defaults.withCredentials = true;

console.log("[AppContext] Axios baseURL:", backendUrl || "(relative)");

const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const currency = import.meta.env.VITE_CURRENCY || "$";
    const navigate = useNavigate();
    const { user } = useUser();
    const { getToken, isSignedIn, isLoaded } = useAuth();

    const [isOwner, setIsOwner] = useState(false);
    const [showHotelReg, setShowHotelReg] = useState(false);
    const [rooms, setRooms] = useState(roomsDummyData);
    const [searchedCities, setSearchedCities] = useState([]); // max 3 recent searched cities

    const facilityIcons = {
        "Free WiFi": assets.freeWifiIcon,
        "Free Breakfast": assets.freeBreakfastIcon,
        "Room Service": assets.roomServiceIcon,
        "Mountain View": assets.mountainIcon,
        "Pool Access": assets.poolIcon,
    };

    const fetchUser = useCallback(async () => {
        try {
            const token = await getToken().catch(() => null)

            if (!token) {
                setTimeout(fetchUser, 1000)
                return
            }

            const { data } = await axios.get('/api/user', { headers: { Authorization: `Bearer ${token}` } })
            if (data.success) {
                setIsOwner(data.role === "hotelOwner");
                setSearchedCities(data.recentSearchedCities)
            } else {
                setTimeout(() => {
                    fetchUser();
                }, 2000);
            }
        } catch (error) {
            console.error("[AppContext] fetchUser error", error?.response || error);
            if (error?.response?.status === 401) {
                toast.error("You are not authenticated. Please sign in again.");
                return;
            }
            if (error?.code === "ERR_NETWORK") {
                toast.error("Network error: backend is unreachable. Start the server on port 3000.");
                return;
            }
            // Avoid noisy raw API status toasts during background profile bootstrap.
            setIsOwner(false);
        }
    }, [getToken])

    const fetchRooms = useCallback(async () => {
        try {
            const { data } = await axios.get('/api/rooms')
            if (data.success) {
                // If API returns rooms, use them; otherwise use dummy data
                setRooms(data.rooms && data.rooms.length > 0 ? data.rooms : roomsDummyData)
            }
            else {
                // Use dummy data if API fails
                setRooms(roomsDummyData)
            }
        } catch (error) {
            console.error("[AppContext] fetchRooms error", error);
            if (error?.code === "ERR_NETWORK") {
                toast.error("Network error: backend is unreachable. Start the server on port 3000.");
            }
            // Use dummy data as fallback
            setRooms(roomsDummyData)
        }
    }, [])

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            fetchUser();
        } else if (isLoaded && !isSignedIn) {
            setIsOwner(false);
            setSearchedCities([]);
        }
    }, [isLoaded, isSignedIn, fetchUser]);

    useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use(async (config) => {
            if (isLoaded && isSignedIn) {
                const token = await getToken().catch(() => null);
                if (token) {
                    config.headers = config.headers || {};
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
            return config;
        }, (error) => Promise.reject(error));

        const responseInterceptor = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const status = error?.response?.status;
                if (status === 401) {
                    console.warn("Received 401 from API", error?.config?.url);
                }
                if (error?.code === "ERR_NETWORK") {
                    toast.error("Network error: check backend / CORS / internet connection.");
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, [isLoaded, isSignedIn, getToken]);

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    const value = {
        currency, navigate,
        user, getToken,
        isOwner, setIsOwner,
        axios,
        showHotelReg, setShowHotelReg,
        facilityIcons,
        rooms, setRooms,
        searchedCities, setSearchedCities
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );

};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => useContext(AppContext);
