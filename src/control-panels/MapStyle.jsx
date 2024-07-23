import { useState, useEffect } from 'react';
import { fromJS } from 'immutable';

const categories = [
  'labels',
  'roads',
  'buildings',
  'parks',
  'water',
  'background',
];

// Layer id patterns by category
const layerSelector = {
  background: /background/,
  water: /water/,
  parks: /park/,
  buildings: /building/,
  roads: /bridge|road|tunnel/,
  labels: /label|place|poi/,
};

// Layer color class by type
const colorClass = {
  line: 'line-color',
  fill: 'fill-color',
  background: 'background-color',
  symbol: 'text-color',
};
