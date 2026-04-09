import { useState, useMemo, useEffect } from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import StarRating from '../components/StarRating'
import { useSearchParams } from 'react-router-dom'

const parseSmartSearch = (query, rooms) => {
    const text = (query || '').toLowerCase().trim();
    if (!text) {
        return {
            cities: [],
            roomTypes: [],
            amenities: [],
            maxPrice: null,
            minPrice: null,
            sort: '',
            hasIntent: false,
        };
    }

    const cities = [...new Set(rooms.map((room) => room?.hotel?.city).filter(Boolean))];
    const matchedCities = cities.filter((city) => text.includes(city.toLowerCase()));

    const roomTypeRules = [
        { key: 'single', value: 'Single Bed' },
        { key: 'double', value: 'Double Bed' },
        { key: 'luxury', value: 'Luxury Room' },
        { key: 'suite', value: 'Family Suite' },
        { key: 'family', value: 'Family Suite' },
    ];

    const matchedRoomTypes = [...new Set(
        roomTypeRules.filter((rule) => text.includes(rule.key)).map((rule) => rule.value)
    )];

    const amenityRules = [
        { key: 'wifi', value: 'Free WiFi' },
        { key: 'breakfast', value: 'Free Breakfast' },
        { key: 'room service', value: 'Room Service' },
        { key: 'mountain', value: 'Mountain View' },
        { key: 'pool', value: 'Pool Access' },
    ];

    const matchedAmenities = [...new Set(
        amenityRules.filter((rule) => text.includes(rule.key)).map((rule) => rule.value)
    )];

    const numbers = [...text.matchAll(/\d{2,5}/g)].map((match) => Number(match[0]));
    let maxPrice = null;
    let minPrice = null;

    if (text.includes('under') || text.includes('below') || text.includes('max')) {
        maxPrice = numbers[0] || null;
    } else if (text.includes('above') || text.includes('over') || text.includes('minimum')) {
        minPrice = numbers[0] || null;
    } else if (text.includes('between') && numbers.length >= 2) {
        minPrice = Math.min(numbers[0], numbers[1]);
        maxPrice = Math.max(numbers[0], numbers[1]);
    }

    let sort = '';
    if (text.includes('cheap') || text.includes('budget') || text.includes('lowest')) {
        sort = 'Price Low to High';
    } else if (text.includes('premium') || text.includes('expensive') || text.includes('highest')) {
        sort = 'Price High to Low';
    } else if (text.includes('new')) {
        sort = 'Newest First';
    }

    return {
        cities: matchedCities,
        roomTypes: matchedRoomTypes,
        amenities: matchedAmenities,
        maxPrice,
        minPrice,
        sort,
        hasIntent: true,
    };
};

const getSmartMatchScore = (room, parsed) => {
    if (!parsed.hasIntent) return 0;

    let score = 0;
    if (parsed.cities.length && parsed.cities.includes(room?.hotel?.city)) score += 3;
    if (parsed.roomTypes.length && parsed.roomTypes.includes(room.roomType)) score += 2;

    if (parsed.amenities.length) {
        const amenityMatches = parsed.amenities.filter((item) => room.amenities.includes(item)).length;
        score += amenityMatches;
    }

    if (parsed.maxPrice !== null && room.pricePerNight <= parsed.maxPrice) score += 1;
    if (parsed.minPrice !== null && room.pricePerNight >= parsed.minPrice) score += 1;

    return score;
};

const buildMatchReasons = (room, criteria, currency) => {
    const reasons = [];

    if (criteria?.cities?.length && criteria.cities.includes(room?.hotel?.city)) {
        reasons.push(`City match: ${room.hotel.city}`);
    }

    if (criteria?.roomTypes?.length && criteria.roomTypes.includes(room.roomType)) {
        reasons.push(`Room type fit: ${room.roomType}`);
    }

    if (criteria?.amenities?.length) {
        const amenityMatches = criteria.amenities.filter((item) => room.amenities.includes(item));
        if (amenityMatches.length) {
            reasons.push(`Amenities: ${amenityMatches.join(', ')}`);
        }
    }

    if (criteria?.maxPrice !== null && criteria?.maxPrice !== undefined && room.pricePerNight <= criteria.maxPrice) {
        reasons.push(`Within budget: ${currency}${room.pricePerNight} <= ${currency}${criteria.maxPrice}`);
    }

    if (criteria?.minPrice !== null && criteria?.minPrice !== undefined && room.pricePerNight >= criteria.minPrice) {
        reasons.push(`Meets min budget: ${currency}${room.pricePerNight}`);
    }

    if (reasons.length === 0) {
        reasons.push('Strong overall relevance based on your query.');
    }

    return reasons.slice(0, 3);
};

const getSuitabilityScore = (room, criteria) => {
    if (!room) return 0;

    let score = 0;
    score += room.amenities.length * 0.2;
    score += Math.max(0, 3000 - room.pricePerNight) / 3000;

    if (!criteria) {
        return score;
    }

    score += getSmartMatchScore(room, {
        ...criteria,
        hasIntent: true,
    });

    if (criteria.sort === 'Price Low to High') {
        score += Math.max(0, 3500 - room.pricePerNight) / 3500;
    } else if (criteria.sort === 'Price High to Low') {
        score += room.pricePerNight / 5000;
    }

    return score;
};

const CheckBox = ({ label, selected = true, onChange = () => { } }) => {
    return (
        <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
            <input type="checkbox" checked={selected} onChange={(e) => onChange(e.target.checked, label)} />
            <span className='font-light select-none'>{label}</span>
        </label>
    )
}

const RadioButton = ({ label, selected = true, onChange = () => { } }) => {
    return (
        <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
            <input type="radio" name="sortOption" checked={selected} onChange={() => onChange(label)} />
            <span className="font-light select-none">{label}</span>
        </label>
    );
}

const AllRooms = () => {

    const [searchParams, setSearchParams] = useSearchParams();

    const { facilityIcons, navigate, rooms, currency, axios } = useAppContext();
    const [openFilters, setOpenFilters] = useState(false);

    // State for managing the selected filters
    const [selectedFilters, setSelectedFilters] = useState({
        roomType: [],
        priceRange: [],
    });
    const [selectedSort, setSelectedSort] = useState('');
    const [smartQuery, setSmartQuery] = useState('');
    const [comparisonIds, setComparisonIds] = useState([]);
    const [aiRoomOrder, setAiRoomOrder] = useState([]);
    const [aiSource, setAiSource] = useState('');
    const [aiCriteria, setAiCriteria] = useState(null);
    const [isAiSearching, setIsAiSearching] = useState(false);

    const roomTypes = [
        "Single Bed",
        "Double Bed",
        "Luxury Room",
        "Family Suite",
    ];

    const priceRanges = [
        '500 to 1000',
        '1000 to 2000',
        '2000 to 3000',
        '3000 to 5000',
    ];

    const sortOptions = [
        "Price Low to High",
        "Price High to Low",
        "Newest First"
    ];


    // Handle changes for filters and sorting
    const handleFilterChange = (checked, value, type) => {
        setSelectedFilters((prevFilters) => {
            const updatedFilters = { ...prevFilters };
            if (checked) {
                updatedFilters[type].push(value);
            } else {
                updatedFilters[type] = updatedFilters[type].filter(item => item !== value);
            }
            return updatedFilters;
        });
    }

    const handleSortChange = (sortOption) => {
        setSelectedSort(sortOption);
    }

    const openDirections = (room) => {
        if (!room?.hotel?.address) return;

        const destination = encodeURIComponent(`${room.hotel.name}, ${room.hotel.address}`);

        const openMap = (origin) => {
            const baseUrl = 'https://www.google.com/maps/dir/?api=1';
            const mapUrl = origin
                ? `${baseUrl}&origin=${origin}&destination=${destination}&travelmode=driving`
                : `${baseUrl}&destination=${destination}&travelmode=driving`;
            window.open(mapUrl, '_blank', 'noopener,noreferrer');
        };

        if (!navigator.geolocation) {
            openMap('');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const origin = `${position.coords.latitude},${position.coords.longitude}`;
                openMap(encodeURIComponent(origin));
            },
            () => {
                openMap('');
            },
            { timeout: 7000 }
        );
    }

    const toggleComparison = (roomId) => {
        setComparisonIds((prev) => {
            if (prev.includes(roomId)) {
                return prev.filter((id) => id !== roomId);
            }
            if (prev.length >= 3) {
                return prev;
            }
            return [...prev, roomId];
        });
    }

    const parsedSmartSearch = useMemo(() => parseSmartSearch(smartQuery, rooms), [smartQuery, rooms]);

    const aiRankMap = useMemo(() => {
        return new Map(aiRoomOrder.map((id, index) => [id, index]));
    }, [aiRoomOrder]);

    const comparisonRooms = useMemo(() => {
        const idSet = new Set(comparisonIds);
        return rooms.filter((room) => idSet.has(room._id));
    }, [rooms, comparisonIds]);

    const activeCriteria = useMemo(() => {
        if (aiCriteria) {
            return aiCriteria;
        }
        return parsedSmartSearch?.hasIntent ? parsedSmartSearch : null;
    }, [aiCriteria, parsedSmartSearch]);

    const comparisonRecommendation = useMemo(() => {
        if (comparisonRooms.length < 2) return null;

        const ranked = [...comparisonRooms]
            .map((room) => ({
                room,
                score: getSuitabilityScore(room, activeCriteria),
            }))
            .sort((a, b) => b.score - a.score);

        const winner = ranked[0]?.room;
        if (!winner) return null;

        return {
            winner,
            reasons: buildMatchReasons(winner, activeCriteria, currency),
        };
    }, [comparisonRooms, activeCriteria, currency]);

    useEffect(() => {
        const query = smartQuery.trim();

        if (!query) {
            setAiRoomOrder([]);
            setAiSource('');
            setAiCriteria(null);
            setIsAiSearching(false);
            return;
        }

        let isCancelled = false;
        setIsAiSearching(true);

        const timeoutId = setTimeout(async () => {
            try {
                const { data } = await axios.post('/api/rooms/ai-search', { query });

                if (!isCancelled && data?.success) {
                    setAiRoomOrder(Array.isArray(data.roomIds) ? data.roomIds : []);
                    setAiSource(data.source || 'heuristic');
                    setAiCriteria(data.criteria || null);
                }
            } catch {
                if (!isCancelled) {
                    setAiRoomOrder([]);
                    setAiSource('fallback');
                    setAiCriteria(null);
                }
            } finally {
                if (!isCancelled) {
                    setIsAiSearching(false);
                }
            }
        }, 450);

        return () => {
            isCancelled = true;
            clearTimeout(timeoutId);
        };
    }, [smartQuery, axios]);

    // Filter and sort rooms based on the selected filters and sort option
    const filteredRooms = useMemo(() => {
        const destination = searchParams.get('destination');

        const matchesRoomType = (room) => {
            return selectedFilters.roomType.length === 0 || selectedFilters.roomType.includes(room.roomType);
        };

        const matchesPriceRange = (room) => {
            return selectedFilters.priceRange.length === 0 || selectedFilters.priceRange.some(range => {
                const [min, max] = range.split(' to ').map(Number);
                return room.pricePerNight >= min && room.pricePerNight <= max;
            });
        };

        const filterDestination = (room) => {
            if (!destination) return true;
            return room.hotel.city.toLowerCase().includes(destination.toLowerCase());
        };

        const matchesSmartSearch = (room) => {
            if (!parsedSmartSearch.hasIntent || !smartQuery.trim()) return true;

            if (aiRoomOrder.length > 0) {
                return aiRankMap.has(room._id);
            }

            const cityMatch =
                parsedSmartSearch.cities.length === 0 ||
                parsedSmartSearch.cities.includes(room?.hotel?.city);

            const roomTypeMatch =
                parsedSmartSearch.roomTypes.length === 0 ||
                parsedSmartSearch.roomTypes.includes(room.roomType);

            const amenityMatch =
                parsedSmartSearch.amenities.length === 0 ||
                parsedSmartSearch.amenities.every((amenity) => room.amenities.includes(amenity));

            const maxPriceMatch =
                parsedSmartSearch.maxPrice === null || room.pricePerNight <= parsedSmartSearch.maxPrice;

            const minPriceMatch =
                parsedSmartSearch.minPrice === null || room.pricePerNight >= parsedSmartSearch.minPrice;

            return cityMatch && roomTypeMatch && amenityMatch && maxPriceMatch && minPriceMatch;
        };

        const sortRooms = (a, b) => {
            const activeSort = selectedSort || parsedSmartSearch.sort;

            if (aiRoomOrder.length > 0) {
                const rankA = aiRankMap.has(a._id) ? aiRankMap.get(a._id) : Number.MAX_SAFE_INTEGER;
                const rankB = aiRankMap.has(b._id) ? aiRankMap.get(b._id) : Number.MAX_SAFE_INTEGER;
                if (rankA !== rankB) return rankA - rankB;
            }

            if (!selectedSort && !parsedSmartSearch.sort && smartQuery.trim()) {
                const scoreA = getSmartMatchScore(a, parsedSmartSearch);
                const scoreB = getSmartMatchScore(b, parsedSmartSearch);
                if (scoreA !== scoreB) return scoreB - scoreA;
            }

            if (activeSort === 'Price Low to High') {
                return a.pricePerNight - b.pricePerNight;
            }
            if (activeSort === 'Price High to Low') {
                return b.pricePerNight - a.pricePerNight;
            }
            if (activeSort === 'Newest First') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
            return 0;
        };

        return rooms
            .filter(room => matchesRoomType(room) && matchesPriceRange(room) && filterDestination(room) && matchesSmartSearch(room))
            .sort(sortRooms);
    }, [rooms, selectedFilters, selectedSort, searchParams, parsedSmartSearch, smartQuery, aiRoomOrder, aiRankMap]);

    const destinationQuery = searchParams.get('destination') || '';

    const suggestedCities = useMemo(() => {
        return [...new Set(rooms.map((room) => room?.hotel?.city).filter(Boolean))].slice(0, 6);
    }, [rooms]);

    const topExplainedMatches = useMemo(() => {
        if (!smartQuery.trim()) return [];
        return filteredRooms.slice(0, 3).map((room) => ({
            room,
            reasons: buildMatchReasons(room, activeCriteria, currency),
        }));
    }, [filteredRooms, smartQuery, activeCriteria, currency]);

    // Clear all filters
    const clearFilters = () => {
        setSelectedFilters({
            roomType: [],
            priceRange: [],
        });
        setSelectedSort('')
        setSearchParams({});
        setSmartQuery('');
        setAiRoomOrder([]);
        setAiSource('');
        setAiCriteria(null);
    }

    return (
        <div className='flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32'>
            <div>
                {/* Main Title */}
                <div className="flex flex-col items-start text-left">
                    <h1 className='font-playfair text-4xl md:text-[40px]'>Hotel Rooms</h1>
                    <p className='text-sm md:text-base text-gray-500/90 mt-2 max-w-174'>Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories.</p>
                </div>

                <div className='mt-6 rounded-2xl border border-slate-200 bg-[linear-gradient(120deg,#f8fafc,#eef2ff)] p-4 md:p-5'>
                    <div className='flex items-center justify-between gap-4 flex-wrap'>
                        <div>
                            <p className='text-sm font-semibold text-slate-800'>Smart AI Search</p>
                            <p className='text-xs text-slate-500 mt-1'>Try: "Luxury room in Tokyo under 350 with pool and breakfast"</p>
                        </div>
                        {smartQuery.trim() && (
                            <button
                                type='button'
                                onClick={() => setSmartQuery('')}
                                className='text-xs text-slate-600 border border-slate-300 rounded-full px-3 py-1 hover:bg-white'
                            >
                                Clear Smart Search
                            </button>
                        )}
                    </div>
                    <input
                        type='text'
                        value={smartQuery}
                        onChange={(e) => setSmartQuery(e.target.value)}
                        placeholder='Describe your ideal hotel stay...'
                        className='mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-400'
                    />
                    {smartQuery.trim() && (
                        <p className='mt-2 text-xs text-slate-500'>
                            {isAiSearching ? 'AI is analyzing your request...' : `${filteredRooms.length} smart matches found${aiSource ? ` (${aiSource})` : ''}.`}
                        </p>
                    )}
                </div>

                {topExplainedMatches.length > 0 && (
                    <div className='mt-4 rounded-2xl border border-slate-200 bg-white p-4 md:p-5'>
                        <div className='flex items-center justify-between gap-3 flex-wrap'>
                            <h2 className='font-playfair text-2xl text-slate-900'>AI Match Explanations</h2>
                            <p className='text-xs text-slate-500'>Top results and why they fit</p>
                        </div>

                        <div className='mt-4 grid grid-cols-1 md:grid-cols-3 gap-4'>
                            {topExplainedMatches.map(({ room, reasons }) => (
                                <div key={`explain-${room._id}`} className='rounded-xl border border-slate-200 bg-slate-50 p-4'>
                                    <p className='font-semibold text-slate-900'>{room.hotel.name}</p>
                                    <p className='text-xs text-slate-500 mt-0.5'>{room.hotel.city} • {currency}{room.pricePerNight}/night</p>
                                    <ul className='mt-3 space-y-2 text-xs text-slate-600'>
                                        {reasons.map((reason, idx) => (
                                            <li key={idx} className='flex gap-2'>
                                                <span className='text-blue-600'>•</span>
                                                <span>{reason}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {comparisonRooms.length > 0 && (
                    <div className='mt-6 rounded-2xl border border-slate-200 bg-white p-4 md:p-5'>
                        <div className='flex items-center justify-between gap-4 flex-wrap'>
                            <h2 className='font-playfair text-2xl text-slate-900'>Hotel Comparison</h2>
                            <button
                                type='button'
                                onClick={() => setComparisonIds([])}
                                className='text-xs text-slate-600 border border-slate-300 rounded-full px-3 py-1 hover:bg-slate-50'
                            >
                                Clear Comparison
                            </button>
                        </div>

                        <div className='mt-4 grid grid-cols-1 md:grid-cols-3 gap-4'>
                            {comparisonRooms.map((room) => (
                                <div key={room._id} className='rounded-xl border border-slate-200 p-3 bg-slate-50'>
                                    <img
                                        src={room?.images?.[0] || assets.roomImg1}
                                        onError={(e) => { e.currentTarget.src = assets.roomImg1 }}
                                        alt='comparison-room'
                                        className='h-32 w-full object-cover rounded-lg'
                                    />
                                    <p className='mt-2 font-semibold text-slate-900'>{room.hotel.name}</p>
                                    <p className='text-xs text-slate-500'>{room.hotel.city}</p>
                                </div>
                            ))}
                        </div>

                        <div className='mt-4 overflow-x-auto'>
                            <table className='w-full text-sm'>
                                <tbody>
                                    <tr className='border-b border-slate-200'>
                                        <td className='py-2 font-medium text-slate-600'>Room Type</td>
                                        {comparisonRooms.map((room) => <td key={`type-${room._id}`} className='py-2 text-slate-800'>{room.roomType}</td>)}
                                    </tr>
                                    <tr className='border-b border-slate-200'>
                                        <td className='py-2 font-medium text-slate-600'>Price / Night</td>
                                        {comparisonRooms.map((room) => <td key={`price-${room._id}`} className='py-2 text-slate-800'>{currency}{room.pricePerNight}</td>)}
                                    </tr>
                                    <tr className='border-b border-slate-200'>
                                        <td className='py-2 font-medium text-slate-600'>Amenities</td>
                                        {comparisonRooms.map((room) => <td key={`amenity-${room._id}`} className='py-2 text-slate-800'>{room.amenities.join(', ')}</td>)}
                                    </tr>
                                    <tr>
                                        <td className='py-2 font-medium text-slate-600'>Action</td>
                                        {comparisonRooms.map((room) => (
                                            <td key={`action-${room._id}`} className='py-2'>
                                                <button
                                                    onClick={() => { navigate(`/rooms/${room._id}`); scrollTo(0, 0) }}
                                                    className='text-xs px-3 py-1.5 border border-slate-300 rounded-full hover:bg-slate-100'
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {comparisonRecommendation && (
                            <div className='mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4'>
                                <p className='text-sm font-semibold text-emerald-800'>Most Suitable Likely Option: {comparisonRecommendation.winner.hotel.name}</p>
                                <p className='text-xs text-emerald-700 mt-1'>Room: {comparisonRecommendation.winner.roomType} • Price: {currency}{comparisonRecommendation.winner.pricePerNight}/night</p>
                                <ul className='mt-2 text-xs text-emerald-800 space-y-1'>
                                    {comparisonRecommendation.reasons.map((reason, idx) => (
                                        <li key={idx}>• {reason}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {filteredRooms.length === 0 ? (
                    <div className='mt-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm'>
                        <h3 className='font-playfair text-3xl text-slate-900'>No hotels found</h3>
                        <p className='mt-2 text-slate-600'>
                            {destinationQuery
                                ? `We could not find rooms for "${destinationQuery}" with your current filters.`
                                : 'No rooms match your current filters.'}
                        </p>
                        <div className='mt-5 flex flex-wrap gap-2'>
                            {suggestedCities.map((city) => (
                                <button
                                    key={city}
                                    type='button'
                                    onClick={() => setSearchParams({ destination: city })}
                                    className='px-3 py-1.5 text-sm rounded-full border border-slate-300 hover:bg-slate-100'
                                >
                                    Try {city}
                                </button>
                            ))}
                        </div>
                        <button
                            type='button'
                            onClick={clearFilters}
                            className='mt-6 px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800'
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : filteredRooms.map((room) => (
                    <div key={room._id} className='flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-30 last:border-0'>
                        {/* Room Image */}
                        <img
                            title='View Room Details'
                            onClick={() => { navigate(`/rooms/${room._id}`); scrollTo(0, 0) }}
                            src={room?.images?.[0] || assets.roomImg1}
                            onError={(e) => { e.currentTarget.src = assets.roomImg1 }}
                            alt="hotel-img"
                            className='max-h-65 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer'
                        />
                        <div className='md:w-1/2 flex flex-col gap-2'>
                            <div className='flex items-center justify-between gap-3'>
                                <p className='text-gray-500'>{room.hotel.city}</p>
                                <button
                                    type='button'
                                    onClick={() => toggleComparison(room._id)}
                                    className={`text-xs px-3 py-1 rounded-full border ${comparisonIds.includes(room._id)
                                        ? 'bg-slate-900 text-white border-slate-900'
                                        : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                                        }`}
                                >
                                    {comparisonIds.includes(room._id) ? 'Added' : 'Compare'}
                                </button>
                            </div>
                            <p onClick={() => { navigate(`/rooms/${room._id}`); scrollTo(0, 0) }} className='text-gray-800 text-3xl font-playfair cursor-pointer' title='View Room Details'>{room.hotel.name}</p>
                            <div className='flex items-center'>
                                <StarRating />
                                <p className='ml-2'>200+ reviews</p>
                            </div>
                            <div className='flex items-center gap-1 text-gray-500 mt-2 text-sm'>
                                <img src={assets.locationIcon} alt="location-icon" />
                                <span>{room.hotel.address}</span>
                            </div>
                            <button
                                type='button'
                                onClick={() => openDirections(room)}
                                className='mt-2 w-fit text-xs px-3 py-1.5 rounded-full border border-slate-300 text-slate-600 hover:bg-slate-100'
                            >
                                Directions
                            </button>
                            {/* Room Amenities */}
                            <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
                                {room.amenities.map((item, index) => (
                                    <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70'>
                                        <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />
                                        <p className='text-xs'>{item}</p>
                                    </div>
                                ))}
                            </div>
                            {/* Room Price per Night */}
                            <p className='text-xl font-medium text-gray-700'>{currency}{room.pricePerNight} /night</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 min-lg:mt-16">
                <div className={`flex items-center justify-between px-5 py-2.5 min-lg:border-b border-gray-300 ${openFilters && "border-b"}`}>
                    <p className='text-base font-medium text-gray-800'>FILTERS</p>
                    <div className='text-xs cursor-pointer'>
                        <span onClick={() => setOpenFilters(!openFilters)} className='lg:hidden'>
                            {openFilters ? "HIDE" : "SHOW"}
                        </span>
                        <span onClick={clearFilters} className='hidden lg:block'>CLEAR</span>
                    </div>
                </div>
                <div className={`${openFilters ? "h-auto" : "h-0 lg:h-auto"} overflow-hidden transition-all duration-700`}>
                    <div className='px-5 pt-5'>
                        <p className='font-medium text-gray-800 pb-2'>Popular filters</p>
                        {roomTypes.map((room, index) => (
                            <CheckBox key={index} label={room} selected={selectedFilters.roomType.includes(room)} onChange={(checked) => handleFilterChange(checked, room, 'roomType')} />
                        ))}
                    </div>
                    <div className='px-5 pt-5'>
                        <p className='font-medium text-gray-800 pb-2'>Price Range</p>
                        {priceRanges.map((range, index) => (
                            <CheckBox key={index} label={`${currency} ${range}`} selected={selectedFilters.priceRange.includes(range)} onChange={(checked) => handleFilterChange(checked, range, 'priceRange')} />
                        ))}</div>
                    <div className="px-5 pt-5 pb-7">
                        <p className="font-medium text-gray-800 pb-2">Sort By</p>
                        {sortOptions.map((option, index) => (
                            <RadioButton key={index} label={option} selected={selectedSort === option} onChange={() => handleSortChange(option)} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AllRooms;