import FoodPlant from './FoodPlant';
import TransportPlant from './TransportPlant';
import ShoppingPlant from './ShoppingPlant';
import LeisurePlant from './LeisurePlant';
import HousingPlant from './HousingPlant';
import MedicalPlant from './MedicalPlant';
import OtherPlant from './OtherPlant';

export const PLANT_COMPONENTS = [
  FoodPlant,
  TransportPlant,
  ShoppingPlant,
  LeisurePlant,
  HousingPlant,
  MedicalPlant,
  OtherPlant,
];

export const PLANT_HEIGHTS = [15, 70, 37, 40, 65, 20, 20];

export function plantFor(catIndex) {
  return PLANT_COMPONENTS[catIndex] ?? OtherPlant;
}

export function heightFor(catIndex) {
  return PLANT_HEIGHTS[catIndex] ?? 20;
}
