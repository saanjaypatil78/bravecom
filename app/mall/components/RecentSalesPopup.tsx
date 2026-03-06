"use client";

import { useState, useEffect } from 'react';

const INDIAN_CITIES = [
    "Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata",
    "Surat", "Pune", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane",
    "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara", "Ghaziabad",
    "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Kalyan-Dombivli",
    "Vasai-Virar", "Varanasi", "Srinagar", "Aurangabad", "Dhanbad", "Amritsar",
    "Navi Mumbai", "Allahabad", "Ranchi", "Howrah", "Coimbatore", "Jabalpur",
    "Gwalior", "Vijayawada", "Jodhpur", "Madurai", "Raipur", "Kota", "Guwahati",
    "Chandigarh", "Solapur", "Hubli-Dharwad", "Mysuru", "Tiruchirappalli", "Bareilly",
    "Aligarh", "Tiruppur", "Gurgaon", "Moradabad", "Jalandhar", "Bhubaneswar", "Salem",
    "Warangal", "Guntur", "Bhiwandi", "Saharanpur", "Gorakhpur", "Bikaner", "Amravati",
    "Noida", "Jamshedpur", "Bhilai", "Cuttack", "Firozabad", "Kochi", "Nellore",
    "Bhavnagar", "Dehradun", "Durgapur", "Asansol", "Rourkela", "Nanded", "Kolhapur",
    "Ajmer", "Akola", "Gulbarga", "Jamnagar", "Ujjain", "Loni", "Siliguri", "Jhansi",
    "Ulhasnagar", "Jammu", "Sangli-Miraj & Kupwad", "Mangalore", "Erode", "Belgaum",
    "Ambattur", "Tirunelveli", "Malegaon", "Gaya", "Jalgaon", "Udaipur", "Maheshtala"
];

const CUSTOMER_NAMES = [
    "Rahul", "Priya", "Amit", "Neha", "Vikram", "Anjali", "Rohan", "Sneha", "Karan", "Pooja",
    "Raj", "Deepa", "Suresh", "Kavita", "Arjun", "Meera", "Aarav", "Tanya", "Vivek", "Rina",
    "Aditya", "Riya", "Kunal", "Simran", "Nitin", "Jyoti", "Harsh", "Shruti", "Manish", "Preeti"
];

interface Product {
    id: string;
    name: string;
    image: string;
}

export function RecentSalesPopup() {
    const [products, setProducts] = useState<Product[]>([]);
    const [visible, setVisible] = useState(false);
    const [currentPopup, setCurrentPopup] = useState<{ name: string, city: string, product: Product, time: number, qty: number } | null>(null);

    useEffect(() => {
        // Fetch all products once to use for random popups
        fetch('/api/mall/products?limit=100')
            .then(r => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.text();
            })
            .then(text => {
                if (!text) return;
                const data = JSON.parse(text);
                if (data.products && data.products.length > 0) {
                    setProducts(data.products);
                }
            })
            .catch(err => console.error("Could not fetch products for popup", err));
    }, []);

    useEffect(() => {
        if (products.length === 0) return;

        // Schedule random popups
        const triggerPopup = () => {
            const product = products[Math.floor(Math.random() * products.length)];
            const city = INDIAN_CITIES[Math.floor(Math.random() * INDIAN_CITIES.length)];
            const name = CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)];
            const time = Math.floor(Math.random() * 59) + 1; // 1 to 59 mins ago
            const isBulk = Math.random() > 0.8;
            const qty = isBulk ? Math.floor(Math.random() * 5) + 2 : 1; // 1 or 2-6

            setCurrentPopup({ name, city, product, time, qty });
            setVisible(true);

            // Hide after 5 seconds
            setTimeout(() => {
                setVisible(false);
            }, 6000);
        };

        // Initial delay 3-5 seconds
        const initialDelay = setTimeout(triggerPopup, 3000 + Math.random() * 2000);

        // Then repeating every 12-25 seconds
        const interval = setInterval(() => {
            triggerPopup();
        }, 12000 + Math.random() * 13000);

        return () => {
            clearTimeout(initialDelay);
            clearInterval(interval);
        };
    }, [products]);

    if (!currentPopup) return null;

    return (
        <div style={{ zIndex: 999999 }} className={`fixed bottom-6 left-6 max-w-sm bg-white dark:bg-[#1e293b] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${visible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95'}`}>
            <div className="relative w-16 h-16 shrink-0 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                <img src={currentPopup.product.image} alt={currentPopup.product.name} className="w-full h-full object-cover" />
                {currentPopup.qty > 1 && (
                    <div className="absolute top-0 right-0 bg-[#0ea5e9] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-bl-lg">
                        x{currentPopup.qty}
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white capitalize truncate">{currentPopup.name} from {currentPopup.city}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug line-clamp-2">
                    Purchased <strong className="text-slate-900 dark:text-slate-200">{currentPopup.product.name}</strong>
                </p>
                <div className="flex items-center gap-1 mt-1.5">
                    <span className="material-symbols-outlined text-[14px] text-green-500">check_circle</span>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Verified Buyer • {currentPopup.time} {currentPopup.time === 1 ? 'min' : 'mins'} ago</span>
                </div>
            </div>

            <button onClick={() => setVisible(false)} className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
        </div>
    );
}
