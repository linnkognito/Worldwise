/* 
📝 Comments show code pre-refactoring & has been kept for studying purposes. 
*/

import { createContext, useContext, useEffect, useReducer } from 'react';

const BASE_URL = 'http://localhost:8000';
const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'loading':
      return { ...state, isLoading: true };

    case 'cities/loaded':
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };

    case 'city/loaded':
      return {
        ...state,
        isLoading: false,
        city: action.payload,
      };

    case 'city/created':
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case 'city/deleted':
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };

    case 'rejected':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      throw new Error('Unknown action type');
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: 'loading' });
      // setIsLoading(true);

      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();

        dispatch({ type: 'cities/loaded', payload: data });
        // setCities(data);
      } catch {
        dispatch({
          type: 'rejected',
          payload: 'There was an error loading cities...',
        });
      }
    }
    fetchCities();
  }, []);

  // Get data
  async function getCity(id) {
    if (Number(id) === currentCity.id) return; // Avoid unnecessary API calls

    dispatch({ type: 'loading' });
    try {
      // setIsLoading(true);

      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();

      dispatch({ type: 'city/loaded', payload: data });
      // setCurrentCity(data);
    } catch {
      dispatch({
        type: 'rejected',
        payload: 'There was an error loading the city...',
      });
    }
  }

  // Send data
  async function createCity(newCity) {
    try {
      dispatch({ type: 'loading' });
      //setIsLoading(true);

      const res = await fetch(`${BASE_URL}/cities/`, {
        method: 'POST',
        body: JSON.stringify(newCity),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();

      dispatch({ type: 'city/created', payload: data });
      //setCities((cities) => [...cities, data]);
    } catch {
      dispatch({
        type: 'rejected',
        payload: 'There was an error creating the city...',
      });
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: 'loading' });
      // setIsLoading(true);

      await fetch(`${BASE_URL}/cities/${id}`, {
        method: 'DELETE',
      });

      dispatch({ type: 'city/deleted', payload: id });
      //setCities((cities) => cities.filter((city) => city.id !== id));
    } catch {
      dispatch({
        type: 'rejected',
        payload: 'There was an error deleting the city...',
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error('CitiesContext was used outside of the CitiesProvider');
  return context;
}

export { CitiesProvider, useCities };
