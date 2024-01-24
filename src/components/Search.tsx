// Search component
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { addToFavorites } from '../utils/favoriteutils';
import '../styles.css';

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [addingToFavorites, setAddingToFavorites] = useState<string | null>(null);
  const [favoriteReason, setFavoriteReason] = useState<string>('');
  const [error, setError] = useState<string | null>(null); // Initialize the error state
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim() !== '') {
        axios.get(`https://api.npms.io/v2/search?q=${searchTerm}`).then((response) => {
          setSearchResults(response.data.results);
        });
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleAddToFavorites = (packageName: string) => {
    setAddingToFavorites(packageName);
    setError(null); // Reset the error state when starting the action
  };

  const confirmAddToFavorites = () => {
    if (addingToFavorites) {
      if (favoriteReason.trim() === '') {
        setError('Please enter a reason for adding to favorites.');
      } else {
        addToFavorites(addingToFavorites, favoriteReason);
        setAddingToFavorites(null);
        setFavoriteReason('');
        setError(null); // Reset the error state when successfully added
      }
    }
  };

  return (
    <div className="min-h-screen bg-blue-200">
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center">
          Welcome to Favorite-NPM-Packages
        </h1>

        <div className="flex flex-col md:flex-row items-stretch justify-between mb-4 md:mb-8">
          <Link
            to="/favorites"
            className="p-4 bg-indigo-600 text-white rounded mb-4 md:mb-0 md:mr-4 text-center"
          >
            Go to Favorites
          </Link>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for NPM Packages"
            className="p-4 border rounded mb-4 md:mb-0 w-full md:w-2/3 md:mr-4"
          />
          <button
            onClick={() => confirmAddToFavorites()}
            className="p-4 bg-blue-500 text-white rounded w-full md:w-auto text-center"
          >
            Search
          </button>
        </div>

        <ul className="list-none p-0">
          {searchResults.map((result) => (
            <li key={result.package.name} className="mb-4">
              <div className="bg-teal-100 p-4 rounded shadow-md flex justify-between items-center">
                <div>
                  <strong className="text-lg font-semibold text-indigo-600">{result.package.name}</strong>
                  <p className="text-gray-800">{result.package.description}</p>
                </div>
                <button
                  onClick={() => handleAddToFavorites(result.package.name)}
                  className="p-2 bg-green-500 text-white rounded"
                >
                  Add to Favorites
                </button>
              </div>
            </li>
          ))}
        </ul>

        {addingToFavorites && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded shadow-md">
              <p className="mb-4 text-gray-800 text-center">
                Why is {addingToFavorites} your favorite?
              </p>
              <input
                type="text"
                value={favoriteReason}
                onChange={(e) => setFavoriteReason(e.target.value)}
                placeholder="Enter reason"
                className="p-2 border rounded w-full mb-4 bg-yellow-100"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => setAddingToFavorites(null)}
                  className="p-2 bg-red-500 text-white rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmAddToFavorites()}
                  className="p-2 bg-green-500 text-white rounded"
                >
                  Add to Favorites
                </button>
              </div>
              {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
