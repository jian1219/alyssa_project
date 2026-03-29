import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Compass, Calendar, Info, User, Star, MapPin, ChevronLeft, Waves, Palmtree, Clock, ShieldCheck, Camera, ChevronRight } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';


import cloud_img1 from './images/cloud9/img1.JPG';
import cloud_img2 from './images/cloud9/img2.PNG';  
import cloud_img3 from './images/cloud9/img3.PNG';

import coconut_img1 from './images/coconut/img1.JPG';
import coconut_img2 from './images/coconut/img2.PNG';
import coconut_img3 from './images/coconut/img3.PNG';

import pacifico_img1 from './images/pacifico/img1.JPG';
import pacifico_img2 from './images/pacifico/img2.JPG';
import pacifico_img3 from './images/pacifico/img3.JPG';

import sugba_img1 from './images/sugba_lagoon/img1.jpeg';
import sugba_img2 from './images/sugba_lagoon/img2.jpeg';
import sugba_img3 from './images/sugba_lagoon/img3.jpeg';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('siargao_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  // Function to save a new booking
  const handleBook = (spotName) => {
    if (!isLoggedIn) {
      setActiveTab('profile'); // Redirect to login if not logged in
      return;
    }

    const newBooking = {
      id: Date.now(),
      spot: spotName,
      date: new Date().toLocaleDateString(),
      status: 'Confirmed',
      user: formData.username
    };

    const updatedBookings = [newBooking, ...bookings];
    setBookings(updatedBookings);
    localStorage.setItem('siargao_bookings', JSON.stringify(updatedBookings));
    
    alert(`Success! ${spotName} has been added to your profile.`);
  };

  // Handle Input Changes
  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Auth Logic using LocalStorage
  const handleAuth = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('siargao_users') || '[]');

    if (isLoginView) {
      // Login Logic
      const user = users.find(u => u.username === formData.username && u.password === formData.password);
      if (user) {
        setIsLoggedIn(true);
        setError('');
      } else {
        setError('Invalid credentials');
      }
    } else {
      // Signup Logic
      if (users.find(u => u.username === formData.username)) {
        setError('User already exists');
      } else {
        users.push(formData);
        localStorage.setItem('siargao_users', JSON.stringify(users));
        setIsLoggedIn(true);
        setError('');
      }
    }
  };

  const renderPage = () => {
    return (
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        {(() => {
          switch (activeTab) {
            case 'home': return <HomeView onBook={handleBook} />;
            case 'explore': 
              return <ExploreView onBook={handleBook} />;
            case 'booking': return <BookingView />;
            case 'info': return <InfoView />;
            case 'profile': 
              return (
                <ProfileView 
                  isLoggedIn={isLoggedIn} 
                  setIsLoggedIn={setIsLoggedIn}
                  isLoginView={isLoginView}
                  setIsLoginView={setIsLoginView}
                  formData={formData}
                  handleInput={handleInput}
                  handleAuth={handleAuth}
                  error={error}
                  bookings={bookings} // Also ensure bookings are passed here
                />
              );
            default: return <HomeView onBook={handleBook} />;
          }
        })()}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] font-sans pb-24 text-slate-900">
      <header className="bg-white/90 backdrop-blur-md px-6 py-4 sticky top-0 z-40 border-b border-emerald-50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <motion.div whileHover={{ rotate: 15 }} className="bg-emerald-500 p-1.5 rounded-xl shadow-lg shadow-emerald-200">
            <Palmtree size={18} className="text-white" />
          </motion.div>
          <h1 className="text-lg font-black text-emerald-950 tracking-tighter uppercase">SiargaoGo</h1>
        </div>
        <div className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full uppercase">Surfers Paradise</div>
      </header>

      <main>
        <AnimatePresence mode="wait">
          {renderPage()}
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-emerald-50 px-2 py-3 flex justify-around items-center z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <NavItem active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Home />} label="Home" />
        <NavItem active={activeTab === 'explore'} onClick={() => setActiveTab('explore')} icon={<Compass />} label="Explore" />
        <NavItem active={activeTab === 'booking'} onClick={() => setActiveTab('booking')} icon={<Calendar />} label="Book" />
        <NavItem active={activeTab === 'info'} onClick={() => setActiveTab('info')} icon={<Info />} label="Info" />
        <NavItem active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<User />} label="Profile" />
      </nav>
    </div>
  );
}

// 1. HOME PAGE
const HomeView = ({ onBook }) => {
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [newReview, setNewReview] = useState('');
  const [reviews, setReviews] = useState({});

  const spotData = {
    'Cloud 9': {
      tag: 'Surfing',
      desc: 'The legendary hollow peak of Siargao.',
      fullInfo: 'Cloud 9 in Siargao Island is the country’s most famous surfing spot, known for its powerful, hollow waves and iconic wooden boardwalk. Located in General Luna, it attracts surfers from around the world and is often considered one of the best surf breaks in the Philippines. Beyond surfing, Cloud 9 is also a popular tourist destination, loved for its scenic ocean views, vibrant island vibe, and breathtaking sunrise and sunset moments.',
      bestTime: 'High Tide',
      difficulty: 'Expert',
      amenities: ['Viewing Deck', 'Surf Rentals', 'Cafes'],
      gallery: [cloud_img1, cloud_img2, cloud_img3],
      coordinates: [9.8123, 126.1634],
      reviews: [
        { user: 'SurfLover', comment: 'Best waves in the PH!', rating: 5 },
        { user: 'Traveler_01', comment: 'Crowded but worth it.', rating: 4 }
      ]
    },
    'Coconut View': {
      tag: 'Sightseeing',
      desc: 'A breathtaking sea of palm trees from the roadside.',
      fullInfo: 'Known as the "Top View," this spot offers a panoramic look at thousands of coconut trees stretching toward the horizon. It is a must-stop for photos when heading North.',
      bestTime: 'Sunrise',
      difficulty: 'Easy',
      amenities: ['Photo Spot', 'Roadside Parking', 'Local Vendors'],
      gallery: [coconut_img1, coconut_img2, coconut_img3],
      coordinates: [9.8833, 126.1167],
      reviews: [
        { user: 'SurfLover', comment: 'Best waves in the PH!', rating: 5 },
        { user: 'Traveler_01', comment: 'Crowded but worth it.', rating: 4 }
      ]
    },
    'Pacifico': {
      tag: 'Northern Surf',
      desc: 'Quiet, long left-hand waves for a peaceful surf session.',
      fullInfo: 'Pacifico in Siargao is a quiet coastal village known for its strong waves making it a great spot for surfing especially for more experienced surfers. Unlike the busy areas of General Luna Pacifico offers a more peaceful and laid back vibe with long stretches of uncrowded beaches coconut lined shores and a relaxing island atmosphere 🌊🌴',
      bestTime: 'Mid-Tide',
      difficulty: 'Advanced',
      amenities: ['Quiet Beach', 'Surf Camps', 'Local Eateries'],
      gallery: [pacifico_img1, pacifico_img2, pacifico_img3],
      coordinates: [9.9667, 126.1000],
      reviews: [
        { user: 'SurfLover', comment: 'Best waves in the PH!', rating: 5 },
        { user: 'Traveler_01', comment: 'Crowded but worth it.', rating: 4 }
      ]
    },
    'Sugba Lagoon': {
      tag: 'Adventure',
      desc: 'Turquoise waters hidden within limestone hills.',
      fullInfo: 'Sugba Lagoon is a beautiful, quiet lagoon in Siargao Island, known for its clear emerald-green water and peaceful surroundings. Surrounded by lush mangroves and limestone hills, it’s perfect for swimming, kayaking, paddleboarding, and relaxing in nature. 🌿💚',
      bestTime: 'Morning',
      difficulty: 'Easy',
      amenities: ['Kayak Rental', 'Diving Board', 'Tour Boat'],
      gallery: [sugba_img1, sugba_img2, sugba_img3],
      coordinates: [9.8833, 126.0333],
      reviews: [
        { user: 'SurfLover', comment: 'Best waves in the PH!', rating: 5 },
        { user: 'Traveler_01', comment: 'Crowded but worth it.', rating: 4 }
      ]
    }
  };

  const handleAddReview = (spotName) => {
    if (!newReview.trim()) return;

    const reviewObj = { user: "Guest", comment: newReview, rating: 5 };
    
    setReviews(prev => ({
      ...prev,
      [spotName]: [reviewObj, ...(prev[spotName] || spotData[spotName].initialReviews || [])]
    }));
    
    setNewReview('');
  };

  return (
    <div className="p-6">
      {/* Animated Hero Card */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative h-56 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[2rem] p-6 text-white overflow-hidden shadow-xl"
      >
        <div className="relative z-10">
          <span className="text-[10px] font-bold bg-white/20 px-2 py-1 rounded-lg backdrop-blur-md uppercase">Destination</span>
          <h2 className="text-3xl font-black leading-tight mt-2">Ride the <br/>Pacific Swell.</h2>
          <p className="text-emerald-50 text-xs mt-2 max-w-[180px]">Your ultimate guide to the surfing capital of the Philippines.</p>
        </div>
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [12, 15, 12] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-8 -bottom-8 w-40 h-40 text-white/10"
        >
          <Waves size={160} />
        </motion.div>
      </motion.div>

      <div className="mt-10">
        <h3 className="font-black text-emerald-950 text-lg mb-4">Must Visit</h3>
        <div className="flex gap-5 overflow-x-auto pb-6 scrollbar-hide">
          {Object.keys(spotData).map((name, i) => (
            <motion.div 
              key={name}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedSpot({ name, ...spotData[name] })}
              className="min-w-[200px] cursor-pointer bg-white rounded-3xl shadow-sm border border-emerald-50 overflow-hidden active:bg-emerald-50 transition-colors"
            >
              <div className="h-32 bg-emerald-50 flex items-center justify-center text-emerald-300">
                {name === 'Coconut View' ? <Palmtree size={40} /> : <Waves size={40} />}
              </div>
              <div className="p-4">
                <p className="font-black text-sm text-slate-800">{name}</p>
                <div className="mt-2 inline-block px-2 py-0.5 bg-slate-50 rounded text-[9px] font-bold text-slate-500">{spotData[name].tag}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FULL SCREEN DETAIL VIEW */}
      <AnimatePresence>
        {selectedSpot && (
          <motion.div 
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            className="fixed inset-0 z-[100] bg-white overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 p-6 flex justify-between items-center bg-white/90 backdrop-blur-md z-10">
              <button onClick={() => setSelectedSpot(null)} className="p-3 bg-slate-100 rounded-2xl"><ChevronLeft size={24}/></button>
              <h4 className="font-black text-emerald-950 uppercase text-xs tracking-widest">Details</h4>
              <div className="w-12 h-12" /> 
            </div>

            <div className="px-6 pb-12 space-y-8">

              {/* OVERVIEW & HIGHLIGHTS */}
              <div>
                <h2 className="text-4xl font-black text-emerald-950 tracking-tighter">{selectedSpot.name}</h2>
                <p className="text-slate-500 text-sm mt-4 leading-relaxed">{selectedSpot.fullInfo}</p>
              </div>

               {/* GALLERY SECTION */}
              <div>
                <h5 className="font-black text-emerald-950 text-lg mb-4">Gallery</h5>
                <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                  {selectedSpot.gallery?.map((img, idx) => (
                    <img 
                      key={idx} 
                      src={img} 
                      className="w-48 h-32 object-cover rounded-3xl bg-emerald-50 shrink-0" 
                      alt="Gallery" 
                    />
                  ))}
                </div>
              </div>

              {/* LOCATION SECTION */}
              <div>
                <h5 className="font-black text-emerald-950 text-lg mb-4">Location</h5>
                <div className="h-64 w-full rounded-[2.5rem] overflow-hidden shadow-inner border-4 border-emerald-50 z-0 relative">
                  <MapContainer 
                    center={selectedSpot.coordinates} 
                    zoom={13} 
                    scrollWheelZoom={false} 
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={selectedSpot.coordinates}>
                      <Popup>
                        <span className="font-bold text-emerald-900">{selectedSpot.name}</span>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>



              {/* REVIEW SECTION */}
              <div className="pt-6 border-t border-slate-100">
                <h5 className="font-black text-emerald-950 text-lg mb-4">Community Reviews</h5>
                
                {/* Review Input */}
                <div className="mb-6 space-y-3">
                  <textarea 
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    placeholder="Share your experience..."
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    rows="2"
                  />
                  <button 
                    onClick={() => handleAddReview(selectedSpot.name)} // Add the name here
                    className="px-6 py-3 bg-emerald-600 text-white text-xs font-black rounded-xl"
                  >
                    Post Review
                  </button>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {selectedSpot.reviews?.map((rev, i) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-2xl">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-black text-xs text-emerald-900">{rev.user}</span>
                        <div className="flex gap-0.5"><Star size={10} fill="#10b981" className="text-emerald-500"/></div>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>

              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => onBook(selectedSpot.name)} // Trigger the booking
                className="w-full py-5 bg-emerald-950 text-white rounded-[2rem] font-black shadow-xl mt-6"
              >
                Book This Trip Now
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


// 2. EXPLORE PAGE
const ExploreView = ({ onBook }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedExploreSpot, setSelectedExploreSpot] = useState(null);

  const exploreSpots = [
    { 
      title: 'Guyam Island', 
      category: 'Islands', 
      desc: 'Miniature tropical paradise.', 
      fullInfo: 'Guyam is a tiny teardrop-shaped island surrounded by a vast coral reef. It is a staple of the Siargao island-hopping experience.',
      rating: '4.9', 
      icon: <Waves size={20}/>,
      coordinates: [9.7825, 126.1558]
    },
    { 
      title: 'Shaka Bowls', 
      category: 'Cafe', 
      desc: 'Famous smoothie bowls and coffee.', 
      fullInfo: 'The ultimate breakfast spot in Siargao. Known for healthy, colorful acai bowls and a perfect view of the Cloud 9 surf break.',
      rating: '4.7', 
      icon: <Palmtree size={20}/>,
      coordinates: [9.8115, 126.1620]
    },
    { 
      title: 'Barrel Bar', 
      category: 'Bar', 
      desc: 'Best nightlife and drinks in GL.', 
      fullInfo: 'A legendary spot for travelers to meet. Famous for its "Barrel" drinks and lively atmosphere every night of the week.',
      rating: '4.6', 
      icon: <Star size={20}/>,
      coordinates: [9.8088, 126.1601]
    },
    { 
      title: 'Kermit Siargao', 
      category: 'Cafe', 
      desc: 'Authentic Italian pizza and vibe.', 
      fullInfo: 'Rated as one of the best Italian restaurants in the world by Conde Nast. A must-visit for pizza lovers staying in General Luna.',
      rating: '4.9', 
      icon: <Palmtree size={20}/>,
      coordinates: [9.8050, 126.1580]
    }
  ];

  const categories = ['All', 'Islands', 'Cafe', 'Bar'];

  const filteredSpots = activeFilter === 'All' 
    ? exploreSpots 
    : exploreSpots.filter(spot => spot.category === activeFilter);

  return (
    <div className="p-6">
      {/* 1. Header & Filter Logic */}
      <div className="relative mb-6">
        <input type="text" placeholder="Search Siargao..." className="w-full p-4 pl-12 bg-white rounded-2xl border border-emerald-50 shadow-sm text-sm outline-none" />
        <Compass className="absolute left-4 top-4 text-emerald-500" size={20} />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-6 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
              activeFilter === cat ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-emerald-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 2. Grid of Clickable Cards */}
      <div className="space-y-4">
        {filteredSpots.map((item) => (
          <motion.div 
            key={item.title}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedExploreSpot(item)} // OPEN MODAL
            className="bg-white rounded-3xl overflow-hidden shadow-sm flex border border-emerald-50 cursor-pointer"
          >
            <div className={`w-24 flex items-center justify-center ${item.category === 'Cafe' ? 'bg-orange-50 text-orange-400' : 'bg-emerald-50 text-emerald-400'}`}>
               {item.icon}
            </div>
            <div className="p-5 flex-1">
              <h4 className="font-black text-emerald-950 text-base">{item.title}</h4>
              <p className="text-[11px] text-slate-400 mt-1">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. Detail & Reserve Modal */}
      <AnimatePresence>
        {selectedExploreSpot && (
          <motion.div 
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            className="fixed inset-0 z-[100] bg-white overflow-y-auto p-6"
          >
            <div className="flex justify-between items-center mb-8">
              <button onClick={() => setSelectedExploreSpot(null)} className="p-3 bg-slate-100 rounded-2xl"><ChevronLeft size={24}/></button>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{selectedExploreSpot.category}</span>
              <div className="w-10"/>
            </div>

            <h2 className="text-4xl font-black text-emerald-950 tracking-tighter">{selectedExploreSpot.title}</h2>
            <div className="flex items-center gap-2 mt-4">
               <Star size={14} fill="#10b981" className="text-emerald-500" />
               <span className="font-black text-emerald-700">{selectedExploreSpot.rating} Rating</span>
            </div>

            <p className="text-slate-500 text-sm mt-6 leading-relaxed">
              {selectedExploreSpot.fullInfo}
            </p>

            <div className="mt-10 p-6 bg-emerald-50 rounded-[2.5rem]">
              <h5 className="font-black text-emerald-900 text-sm uppercase">Quick Reservation</h5>
              <p className="text-[11px] text-emerald-600 mt-1 italic">*Reserved spots are recorded in your Profile dashboard.</p>
              
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  onBook(selectedExploreSpot.title); // RECORD DATA
                  setSelectedExploreSpot(null); // CLOSE MODAL
                }}
                className="w-full py-5 bg-emerald-950 text-white rounded-[2rem] font-black shadow-xl mt-6"
              >
                Confirm Reservation
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// 3. BOOKING PAGE
const BookingView = () => (
  <div className="p-6 text-center py-24 flex flex-col items-center">
    <motion.div 
      initial={{ scale: 0 }} 
      animate={{ scale: 1 }} 
      className="w-24 h-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-500 mb-6 border border-emerald-100"
    >
      <Calendar size={36} />
    </motion.div>
    <h3 className="text-2xl font-black text-emerald-950">Island Services</h3>
    <div className="w-full space-y-3 mt-10">
        <motion.button whileTap={{ scale: 0.98 }} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg">Rent Surfboard</motion.button>
    </div>
  </div>
);

// 4. INFO PAGE
const InfoView = () => (
  <div className="p-6 space-y-4">
    <h3 className="font-black text-emerald-950 text-2xl mb-6">Siargao Essentials</h3>
    {[
      { title: 'Surf Report', status: 'Moderate Swell', icon: <Waves size={16}/> },
      { title: 'Tide Times', status: 'High at 2:00 PM', icon: <Waves size={16}/> }
    ].map((item, i) => (
      <motion.div 
        key={item.title} 
        initial={{ opacity: 0, x: -10 }} 
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.1 }}
        className="p-5 bg-white rounded-3xl border border-emerald-50 flex justify-between items-center shadow-sm"
      >
        <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">{item.icon}</div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase">{item.title}</p>
              <p className="text-sm font-black text-emerald-600">{item.status}</p>
            </div>
        </div>
        <ChevronRight size={18} className="text-emerald-100" />
      </motion.div>
    ))}
  </div>
);

// 5. PROFILE PAGE
const ProfileView = ({ 
  isLoggedIn, 
  setIsLoggedIn, 
  isLoginView, 
  setIsLoginView, 
  formData, 
  handleInput, 
  handleAuth, 
  error,
  bookings = [] // Default to empty array if not passed
}) => {

  // Function to remove a booking (Optional but great for your thesis)
  const cancelBooking = (id) => {
    const existing = JSON.parse(localStorage.getItem('siargao_bookings') || '[]');
    const filtered = existing.filter(b => b.id !== id);
    localStorage.setItem('siargao_bookings', JSON.stringify(filtered));
    window.location.reload(); // Simple way to refresh the local state for now
  };

  // 1. AUTHENTICATED PROFILE VIEW
  if (isLoggedIn) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-8">
        {/* User Header */}
        <div className="flex flex-col items-center">
          <motion.div 
            initial={{ rotate: 10, scale: 0.8 }}
            animate={{ rotate: 6, scale: 1 }}
            className="w-28 h-28 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-[2.5rem] flex items-center justify-center text-white border-4 border-white shadow-xl"
          >
            <User size={48} strokeWidth={1.5} />
          </motion.div>
          <h3 className="font-black text-2xl text-emerald-950 mt-6">{formData.username}</h3>
          <p className="text-emerald-500 font-bold text-xs uppercase tracking-widest">Island Hopper</p>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-600 p-6 rounded-[2rem] text-white shadow-lg shadow-emerald-200">
            <p className="text-[10px] font-bold opacity-70 uppercase">Total Bookings</p>
            <p className="text-2xl font-black">{bookings.length < 10 ? `0${bookings.length}` : bookings.length}</p>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-emerald-50 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase">Island Points</p>
            <p className="text-2xl font-black text-emerald-900">{bookings.length * 50} <span className="text-xs">pts</span></p>
          </div>
        </div>

        {/* BOOKINGS LIST SECTION */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h4 className="font-black text-emerald-950 text-sm uppercase tracking-wider">My Trip Records</h4>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md uppercase">Local Storage</span>
          </div>
          
          <div className="space-y-3">
            {bookings.length === 0 ? (
              <div className="p-10 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                <p className="text-xs text-slate-400 font-bold italic">You haven't booked any trips to the Pacific yet.</p>
              </div>
            ) : (
              bookings.map((trip) => (
                <motion.div 
                  key={trip.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="p-5 bg-white rounded-3xl border border-emerald-50 shadow-sm flex justify-between items-center group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="font-black text-base text-emerald-950 leading-tight">{trip.spot}</p>
                      <p className="text-[11px] text-slate-400 font-bold mt-0.5">{trip.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[9px] font-black rounded-full uppercase tracking-tighter">
                      {trip.status || 'Confirmed'}
                    </span>
                    <button 
                      onClick={() => cancelBooking(trip.id)}
                      className="text-[9px] font-black text-red-300 uppercase hover:text-red-500 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        <button 
          onClick={() => setIsLoggedIn(false)}
          className="w-full py-4 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-emerald-600 transition-colors"
        >
          Sign Out of SiargaoGo
        </button>
      </motion.div>
    );
  }

  // 2. LOGIN / SIGNUP FORM VIEW
  return (
    <div className="p-8 flex flex-col min-h-[60vh] justify-center">
      <div className="mb-10 text-center">
        <div className="inline-block p-4 bg-emerald-50 rounded-3xl mb-4">
          <ShieldCheck className="text-emerald-600" size={32} />
        </div>
        <h3 className="text-3xl font-black text-emerald-950">{isLoginView ? 'Welcome Back' : 'Join the Tribe'}</h3>
        <p className="text-slate-400 text-sm mt-2">Access your personalized DMS dashboard</p>
      </div>

      <form onSubmit={handleAuth} className="space-y-4">
        <div className="space-y-1">
          <input 
            type="text" 
            name="username"
            placeholder="Username" 
            required
            className="w-full p-4 bg-white rounded-2xl border border-emerald-50 shadow-sm text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            onChange={handleInput}
          />
        </div>
        <div className="space-y-1">
          <input 
            type="password" 
            name="password"
            placeholder="Password" 
            required
            className="w-full p-4 bg-white rounded-2xl border border-emerald-50 shadow-sm text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            onChange={handleInput}
          />
        </div>
        
        {error && <p className="text-red-500 text-[10px] font-bold uppercase text-center bg-red-50 py-2 rounded-lg">{error}</p>}

        <motion.button 
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full py-4 bg-emerald-950 text-white rounded-2xl font-black shadow-xl shadow-emerald-900/20 mt-4"
        >
          {isLoginView ? 'Login to Dashboard' : 'Register Account'}
        </motion.button>
      </form>

      <button 
        onClick={() => { setIsLoginView(!isLoginView); setError(''); }}
        className="mt-8 text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em] text-center"
      >
        {isLoginView ? "New to the island? Sign Up" : "Already have an account? Login"}
      </button>
    </div>
  );
};

// NAVIGATION HELPER
function NavItem({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 flex-1 relative ${active ? 'text-emerald-600' : 'text-slate-300'}`}>
      <motion.div animate={active ? { y: -8, scale: 1.1 } : { y: 0, scale: 1 }}>
        {React.cloneElement(icon, { size: 20, strokeWidth: active ? 2.5 : 2 })}
      </motion.div>
      {!active && <span className="text-[9px] font-black uppercase opacity-70">{label}</span>}
      {active && <motion.div layoutId="dot" className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-0.5" />}
    </button>
  );
}