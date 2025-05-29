import { Store } from '../types/store';

// Calculate distance between two points using the Haversine formula
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (value: number): number => {
  return (value * Math.PI) / 180;
};

export const findNearestStore = (
  stores: Store[],
  userLat: number,
  userLon: number
): Store | null => {
  if (!stores.length) return null;

  let nearestStore = stores[0];
  let shortestDistance = Infinity;

  stores.forEach(store => {
    if (!store.location?.coordinates) return;

    const distance = calculateDistance(
      userLat,
      userLon,
      store.location.coordinates.latitude,
      store.location.coordinates.longitude
    );

    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearestStore = store;
    }
  });

  return nearestStore;
};
