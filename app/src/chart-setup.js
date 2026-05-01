import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Tooltip,
} from 'chart.js';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip);

export const PALETTE = [
  '#7A8C6C',
  '#D4A574',
  '#B5634A',
  '#A8B89A',
  '#C9A961',
  '#8B5C3F',
  '#5D6E4D',
  '#E4B984',
];
