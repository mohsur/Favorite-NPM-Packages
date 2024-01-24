import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFavorites, addToFavorites, removeFromFavorites } from '../utils/favoriteutils';
import '../styles.css';

interface FavoriteParams {
  packageName?: string;
  [key: string]: string | undefined;
}

interface Favorite {
  name: string;
  reason: string;
}

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [removingItem, setRemovingItem] = useState<string | null>(null); // To store the item being removed
  const { packageName } = useParams<FavoriteParams>();

  useEffect(() => {
    // Load favorites from the utility function
    setFavorites(getFavorites());
  }, []);

  const handleAddToFavorites = (name: string, reason: string) => {
    const newFavorites = addToFavorites(name, reason);
    setFavorites(newFavorites);
  };

  const handleRemoveFromFavorites = (name: string) => {
    // Set the item to be removed
    setRemovingItem(name);
  };

  const confirmRemove = (name: string) => {
    // Remove the item from favorites
    removeFromFavorites(name);
    setFavorites(getFavorites());
    // Clear the removingItem state after removing
    setRemovingItem(null);
  };

  return (
    <div className="min-h-screen bg-blue-200 p-8">
      <h2 className="text-2xl font-bold mb-4 text-teal-500 text-center">Your Favorite NPM Packages List</h2>
      {favorites.length === 0 ? (
        <p className="text-gray-600 mb-4 text-center">There are no favorites in your list!!! Please add your favorites to the list.</p>
      ) : (
        <div className="flex flex-wrap justify-center">
          {favorites.map((fav: Favorite) => (
            <div key={fav.name} className="bg-green-100 p-4 rounded shadow-md m-4">
              <div>
                <span className="text-green-500 text-lg font-semibold block mb-2">Package Name: {fav.name}</span>
                <p className="text-gray-700 mb-2">Reason for Favorite: {fav.reason}</p>
              </div>
              <button onClick={() => handleRemoveFromFavorites(fav.name)} className="p-2 bg-red-500 text-white rounded mx-auto block mt-2">Remove</button>
            </div>
          ))}
        </div>
      )}
      {packageName && (
        <div>
          {/* Add to favorites form */}
          <h3 className="text-xl mt-4 text-teal-500 text-center">Add to Favorites</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const reason = (e.currentTarget.elements.namedItem('reason') as HTMLInputElement)?.value;
              handleAddToFavorites(packageName, reason);
            }}
            className="flex flex-col items-center"
          >
            <label className="block text-gray-700 mb-2">Reason:
              <input type="text" name="reason" required className="p-2 border rounded" />
            </label>
            <button type="submit" className="mt-2 p-2 bg-teal-500 text-white rounded text-sm">Add to Favorites</button>
          </form>
        </div>
      )}

      {/* Confirm Remove Dialog */}
      {removingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow text-center">
            <p className="mb-4">Are you sure you want to remove {removingItem} from favorites?</p>
            <div className="flex justify-center mt-4">
              <button onClick={() => setRemovingItem(null)} className="mr-2 p-2 bg-gray-400 text-white rounded text-sm">
                Cancel
              </button>
              <button onClick={() => confirmRemove(removingItem)} className="p-2 bg-red-500 text-white rounded text-sm">
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search for NPM Packages link */}
      <div className="text-center">
  <button className="mx-auto p-4">
    <Link to="/" className="block p-4 bg-teal-500 text-white rounded text-center text-sm">
      Search for NPM Packages
    </Link>
  </button>
</div>
    </div>
  );
};

export default Favorites;

