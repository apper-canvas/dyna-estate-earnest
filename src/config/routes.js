import React from "react";
import Browse from "@/components/pages/Browse";
import PropertyDetail from "@/components/pages/PropertyDetail";
import MapView from "@/components/pages/MapView";
import SavedProperties from "@/components/pages/SavedProperties";
import AgentProfile from "@/components/pages/AgentProfile";

export const routes = {
  browse: {
    id: 'browse',
    label: 'Buy',
    path: '/',
    icon: 'Home',
    component: Browse
  },
  rent: {
    id: 'rent',
    label: 'Rent',
    path: '/rent',
    icon: 'Key',
    component: Browse
  },
  saved: {
    id: 'saved',
    label: 'Saved Properties',
    path: '/saved',
    icon: 'Heart',
    component: SavedProperties
  },
  map: {
    id: 'map',
    label: 'Map View',
    path: '/map',
    icon: 'Map',
    component: MapView
  },
  property: {
    id: 'property',
    label: 'Property Detail',
    path: '/property/:id',
    icon: 'Building',
    component: PropertyDetail,
    hidden: true
  },
  agents: {
    id: 'agents',
    label: 'Agents',
    path: '/agents',
    icon: 'UserCheck',
    component: AgentProfile
  },
  agent: {
    id: 'agent',
    label: 'Agent Profile',
    path: '/agents/:id',
    icon: 'User',
    component: AgentProfile,
    hidden: true
  }
};

export const routeArray = Object.values(routes);