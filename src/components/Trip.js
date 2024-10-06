import "./TripStyles.css";
import TripData from "./TripData";
import Trip1 from "../assets/20.jpg";
import Trip2 from "../assets/8.jpg"; 
import Trip3 from "../assets/21.jpg"; 
import Trip4 from "../assets/22.jpg"; 
import Trip5 from "../assets/23.jpg"; 
import Trip6 from "../assets/24.png"; 
import Trip7 from "../assets/25.jpg"; 
import Trip8 from "../assets/26.jpg"; 
import { useEffect, useRef } from "react";

const tripDataArray = [
    {
        image: Trip1,
        heading: "Trip in Sri Lanka",
        text: "Experience the beauty of Sri Lanka on an unforgettable trip with our expertly curated tours. Explore lush tea plantations, pristine beaches, and ancient temples while indulging in authentic cuisine. Book your adventure today and immerse yourself in this tropical paradise.",
        price: "₹99,000",
        days: 7
    },
    {
        image: Trip2,
        heading: "Trip in Maldives",
        text: "Escape to paradise with a trip to the Maldives! Discover pristine beaches, crystal-clear waters, and luxurious overwater bungalows. Let us plan your dream getaway, where adventure and relaxation await. Book now for the ultimate travel experience!",
        price: "₹2,00,000",
        days: 5
    },
    {
        image: Trip3,
        heading: "Trip in Ladakh",
        text: "Experience the breathtaking beauty of Ladakh on an unforgettable trip! Explore the serene landscapes, pristine lakes, and ancient monasteries with our expertly crafted tours. Book now for an adventure of a lifetime!",
        price: "₹1,25,000",
        days: 10
    },
    {
        image: Trip4,
        heading: "Trip in Bali",
        text: "Discover the enchanting beauty of Bali, where lush jungles meet pristine beaches. Join us for a perfect blend of adventure and relaxation, including thrilling activities and serene spa experiences.",
        price: "₹1,50,000",
        days: 8
    },
    {
        image: Trip5,
        heading: "Trip in Japan",
        text: "Experience the vibrant culture and stunning landscapes of Japan. From the bustling streets of Tokyo to the serene temples of Kyoto, embark on a journey filled with unforgettable experiences.",
        price: "₹1,80,000",
        days: 12
    },
    {
        image: Trip6,
        heading: "Trip in Italy",
        text: "Indulge in the rich history, art, and cuisine of Italy. Explore the romantic canals of Venice, the majestic architecture of Rome, and the stunning landscapes of Tuscany. Join us for a trip of a lifetime!",
        price: "₹1,65,000",
        days: 9
    },
    {
        image: Trip7,
        heading: "Trip in Greece",
        text: "Explore the stunning islands and rich history of Greece. From the ancient ruins of Athens to the beautiful beaches of Santorini, this trip promises breathtaking views and unforgettable experiences.",
        price: "₹1,90,000",
        days: 11
    },
    {
        image: Trip8,
        heading: "Trip in Australia",
        text: "Discover the diverse landscapes of Australia, from the Great Barrier Reef to the outback. Enjoy a perfect mix of adventure and relaxation while exploring the unique wildlife and vibrant cities.",
        price: "₹2,20,000",
        days: 14
    }
];

function Trip() {
    const tripCardRef = useRef(null);

    useEffect(() => {
        const scrollInterval = setInterval(() => {
            if (tripCardRef.current) {
                tripCardRef.current.scrollBy({ 
                    left: tripCardRef.current.clientWidth * 0.33, // Adjust the scroll amount as needed
                    behavior: 'smooth'
                });
            }
        }, 3000); // Scroll every 3 seconds

        return () => clearInterval(scrollInterval); // Cleanup on component unmount
    }, []);

    const scrollLeft = () => {
        if (tripCardRef.current) {
            tripCardRef.current.scrollBy({ 
                left: -tripCardRef.current.clientWidth * 0.33, // Scroll left by 1/3 of the width
                behavior: 'smooth'
            });
        }
    };

    const scrollRight = () => {
        if (tripCardRef.current) {
            tripCardRef.current.scrollBy({ 
                left: tripCardRef.current.clientWidth * 0.33, // Scroll right by 1/3 of the width
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="trip">
            <h1>Recent Trips</h1>
            <p>You can discover unique destinations using Google Maps.</p>
            <div className="tripcard" ref={tripCardRef}>
                {tripDataArray.map((trip, index) => (
                    <TripData className="t-card"
                        key={index}
                        image={trip.image}
                        heading={trip.heading}
                        text={trip.text}
                        price={trip.price}
                        days={trip.days} // Pass days to TripData
                    />
                ))}
            </div>
        </div>
    );
};

export default Trip;
