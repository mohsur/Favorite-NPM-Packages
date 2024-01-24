interface Favorite {
    name: string;
    reason: string;
  }
  
  export const getFavorites = (): Favorite[] => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]') as Favorite[];
    return storedFavorites;
  };
  
  export const addToFavorites = (name: string, reason: string) => {
    const favorites = getFavorites();
    console.log('Current favorites:', favorites);
  
    const isAlreadyAdded = favorites.some((fav) => fav.name === name);
  
    if (!isAlreadyAdded) {
      const newFavorite = { name, reason };
      const newFavorites = [...favorites, newFavorite];
      console.log('New favorites:', newFavorites);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    }
  
    console.log('Already added to favorites');
    return favorites;
  };
  
  
  export const removeFromFavorites = (name: string) => {
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter((fav) => fav.name !== name);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    return updatedFavorites;
  };
  