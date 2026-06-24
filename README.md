# fmcg-distro-router-2025

A lightweight TypeScript library designed for small-scale FMCG (Fast Moving Consumer Goods) distributors. This tool helps optimize delivery routes from a central warehouse to various estate shops while respecting vehicle capacity constraints.

## Features
- **CVRP Solver**: Implements a greedy Nearest Neighbor algorithm for the Capacitated Vehicle Routing Problem.
- **Haversine Distance**: Accurate distance calculations using latitude and longitude.
- **Capacity Management**: Ensures vehicles are not overloaded based on shop demand.

## Installation
```bash
npm install
```

## Usage
```typescript
import { FMCGRouter } from './router';

const router = new FMCGRouter();
const warehouse = { id: 'W1', name: 'Main Hub', location: { lat: -1.286389, lng: 36.817223 } };
const shops = [
  { id: 'S1', name: 'Estate Shop A', location: { lat: -1.290, lng: 36.820 }, demand: 50 },
  { id: 'S2', name: 'Estate Shop B', location: { lat: -1.280, lng: 36.810 }, demand: 30 },
];
const vehicles = [{ id: 'V1', capacity: 100 }];

const routes = router.optimizeRoutes(warehouse, shops, vehicles);
console.log(JSON.stringify(routes, null, 2));
```