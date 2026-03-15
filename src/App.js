import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [menu, setMenu] = useState([]);
  const [search, setSearch] = useState('');
  const [brewing, setBrewing] = useState(false);

  const BASE_URL = "https://nammakadai-backend-4.onrender.com"; // Render backend URL

  const tagline = {
    "Cappuccino": "Suda suda coffee... unga day ku perfect start ☕",
    "Green Tea": "Oru sip green tea… stress ellam off 🍵",
    "Masala Chai": "Oru tea, rendu friends, full happiness ☕",
    "Filter Coffee": "Strong coffee... full energy ☕",
    "Lemon Tea": "Fresh lemon, full energy 🍋☕",
    "Mocha Coffee": "Chocolate + coffee = happiness ☕🍫"
  };

  useEffect(() => {
    axios.get(`${BASE_URL}/menu`)
      .then(res => {
        console.log("Fetched menu:", res.data);
        setMenu(res.data);
      })
      .catch(err => console.log("Fetch error:", err));
  }, []);

  const orderDrink = (drink) => {
    setBrewing(true);

    axios.post(`${BASE_URL}/order`, drink)
      .then(() => {
        setTimeout(() => {
          setBrewing(false);
          alert(`Order for ${drink.name} placed! ☕`);
        }, 2000);
      })
      .catch(err => {
        setBrewing(false);
        alert("Something went wrong 😢");
        console.log(err);
      });
  };

  const filteredMenu = menu.filter(drink => {
    const term = search.toLowerCase().trim();
    return (
      drink.name.toLowerCase().includes(term) ||
      (drink.type && drink.type.toLowerCase().includes(term)) ||
      (drink.keywords && drink.keywords.some(k => k.toLowerCase().includes(term)))
    );
  });

  return (
    <div className='bg-nature min-h-screen'>
      <div className='bg-black/40 min-h-screen relative overflow-hidden'>
        <div className='flex flex-col items-center justify-center min-h-screen text-center px-6'>
          <h1 className='text-6xl font-bold text-white mb-4 drop-shadow-lg'>Namma Kadai ☕</h1>
          <p className='text-white text-lg mb-6 opacity-90'>Oru kudi tea... konjam peace... full happiness ☕</p>

          <input
            type="text"
            placeholder="Search your drink..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className='px-4 py-2 rounded-xl text-black mb-10 w-64 focus:outline-none'
          />

          <div className='grid md:grid-cols-3 sm:grid-cols-2 gap-10 max-w-5xl w-full'>
            {filteredMenu.length > 0 ? filteredMenu.map(drink => (
              <div key={drink._id} className='backdrop-blur-lg bg-white/30 p-6 rounded-3xl shadow-xl hover:scale-110 transition text-white'>
                <h3 className='text-2xl font-semibold'>{drink.name}</h3>
                <p className='mt-2'>{tagline[drink.name]}</p>
                <span className='block mt-4 font-bold text-xl'>₹{drink.price}</span>
                <button
                  onClick={() => orderDrink(drink)}
                  className='mt-4 bg-white text-amber-700 px-4 py-2 rounded-xl hover:bg-amber-200'
                >
                  Order
                </button>
              </div>
            )) : (
              <p className='text-white text-xl col-span-full mt-10'>No drinks found for "{search}" 😢</p>
            )}
          </div>

          {brewing && (
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center'>
              <div className='text-8xl animate-bounce'>☕</div>
              <p className='text-white text-2xl mt-4 drop-shadow-lg'>Order placing...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;