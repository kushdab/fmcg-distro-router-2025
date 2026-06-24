export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Shop {
  id: string;
  name: string;
  location: Coordinates;
  demand: number; // e.g., weight or volume units
}

export interface Warehouse {
  id: string;
  name: string;
  location: Coordinates;
}

export interface Vehicle {
  id: string;
  capacity: number;
}

export interface Route {
  vehicleId: string;
  shops: Shop[];
  totalDistanceKm: number;
  totalLoad: number;
}

export class FMCGRouter {
  /**
   * Calculates distance between two points using Haversine formula
   */
  private calculateDistance(p1: Coordinates, p2: Coordinates): number {
    const R = 6371; // Earth's radius in km
    const dLat = (p2.lat - p1.lat) * (Math.PI / 180);
    const dLng = (p2.lng - p1.lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(p1.lat * (Math.PI / 180)) *
        Math.cos(p2.lat * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Solves a simplified Capacitated Vehicle Routing Problem (CVRP)
   * using a Greedy Nearest Neighbor approach.
   */
  public optimizeRoutes(
    warehouse: Warehouse,
    shops: Shop[],
    vehicles: Vehicle[]
  ): Route[] {
    let unvisitedShops = [...shops];
    const routes: Route[] = [];

    // Sort vehicles by capacity (descending) to maximize efficiency
    const availableVehicles = [...vehicles].sort((a, b) => b.capacity - a.capacity);

    for (const vehicle of availableVehicles) {
      if (unvisitedShops.length === 0) break;

      const currentRoute: Shop[] = [];
      let currentLoad = 0;
      let currentLocation = warehouse.location;
      let totalDistance = 0;

      while (unvisitedShops.length > 0) {
        // Find nearest shop that fits in current vehicle
        let nearestIndex = -1;
        let minDistance = Infinity;

        for (let i = 0; i < unvisitedShops.length; i++) {
          const shop = unvisitedShops[i];
          if (currentLoad + shop.demand <= vehicle.capacity) {
            const dist = this.calculateDistance(currentLocation, shop.location);
            if (dist < minDistance) {
              minDistance = dist;
              nearestIndex = i;
            }
          }
        }

        // If no more shops fit or reachable, close this route
        if (nearestIndex === -1) break;

        const selectedShop = unvisitedShops.splice(nearestIndex, 1)[0];
        currentRoute.push(selectedShop);
        currentLoad += selectedShop.demand;
        totalDistance += minDistance;
        currentLocation = selectedShop.location;
      }

      if (currentRoute.length > 0) {
        // Add distance back to warehouse
        totalDistance += this.calculateDistance(currentLocation, warehouse.location);
        
        routes.push({
          vehicleId: vehicle.id,
          shops: currentRoute,
          totalDistanceKm: Number(totalDistance.toFixed(2)),
          totalLoad: currentLoad
        });
      }
    }

    return routes;
  }
}
