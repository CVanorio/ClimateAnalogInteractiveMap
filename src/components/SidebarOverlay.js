// SidebarOverlay.js
import React from 'react';
import '../styles/Sidebar.css';

const SidebarOverlay = ({ loading }) => {
  if (!loading) return null;
  return <div className="sidebar-overlay">
  </div>;
};

export default SidebarOverlay;
