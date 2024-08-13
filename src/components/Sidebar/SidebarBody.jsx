import { useState } from 'react';
import Navigation from './Navigation';
import './styles.css';

export default function SidebarBody() {
  return (
    <div className='sidebar-body'>
      <Navigation />
    </div>
  );
}
