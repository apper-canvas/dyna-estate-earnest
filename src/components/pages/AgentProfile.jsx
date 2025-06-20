import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import PropertyCard from '@/components/molecules/PropertyCard';
import agentService from '@/services/api/agentService';
import propertyService from '@/services/api/propertyService';

const AgentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState(null);
  const [agents, setAgents] = useState([]);
  const [agentListings, setAgentListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [listingsLoading, setListingsLoading] = useState(false);

  const isListView = !id;

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (isListView) {
        // Load all agents for list view
        const agentsData = await agentService.getAll();
        setAgents(agentsData);
      } else {
        // Load specific agent and their listings
        const agentData = await agentService.getById(parseInt(id));
        if (!agentData) {
          setError('Agent not found');
          return;
        }
        setAgent(agentData);
        
        // Load agent's listings
        setListingsLoading(true);
        try {
          const allProperties = await propertyService.getAll();
          const agentProperties = allProperties.filter(property => 
            property.agent.name === agentData.name
          );
          setAgentListings(agentProperties);
        } catch (listingsError) {
          console.error('Error loading listings:', listingsError);
          setAgentListings([]);
        } finally {
          setListingsLoading(false);
        }
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleContactAgent = (agent, method) => {
    if (method === 'phone') {
      window.location.href = `tel:${agent.phone}`;
      toast.success(`Calling ${agent.name}...`);
    } else if (method === 'email') {
      window.location.href = `mailto:${agent.email}`;
      toast.success(`Opening email to ${agent.name}...`);
    }
  };

  const handleViewAgent = (agentId) => {
    navigate(`/agents/${agentId}`);
  };

  const handlePropertyClick = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState 
          title="Error Loading Agent Data"
          message={error}
          onRetry={loadData}
        />
      </div>
    );
  }

  // List view - show all agents
  if (isListView) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Agents</h1>
          <p className="text-gray-600">Meet our experienced real estate professionals</p>
        </div>

        {agents.length === 0 ? (
          <EmptyState
            icon="Users"
            title="No Agents Found"
            message="We're currently updating our agent directory."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <motion.div
                key={agent.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={agent.photo}
                    alt={agent.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
                    <p className="text-sm text-gray-600">{agent.company}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="Phone" className="w-4 h-4 mr-2" />
                    <span>{agent.phone}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="Mail" className="w-4 h-4 mr-2" />
                    <span>{agent.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="Award" className="w-4 h-4 mr-2" />
                    <span>{agent.license}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleViewAgent(agent.Id)}
                    className="flex-1"
                  >
                    <ApperIcon name="User" className="w-4 h-4 mr-1" />
                    View Profile
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleContactAgent(agent, 'phone')}
                  >
                    <ApperIcon name="Phone" className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleContactAgent(agent, 'email')}
                  >
                    <ApperIcon name="Mail" className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Detail view - show specific agent
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate('/agents')}
        className="mb-6"
      >
        <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
        Back to Agents
      </Button>

      {/* Agent Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center space-y-6 md:space-y-0 md:space-x-8">
          <img
            src={agent.photo}
            alt={agent.name}
            className="w-32 h-32 rounded-full object-cover mx-auto md:mx-0"
          />
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{agent.name}</h1>
            <p className="text-xl text-gray-600 mb-4">{agent.company}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center justify-center md:justify-start text-gray-600">
                <ApperIcon name="Phone" className="w-5 h-5 mr-2" />
                <span>{agent.phone}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start text-gray-600">
                <ApperIcon name="Mail" className="w-5 h-5 mr-2" />
                <span>{agent.email}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start text-gray-600">
                <ApperIcon name="Award" className="w-5 h-5 mr-2" />
                <span>{agent.license}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
              <Button
                variant="primary"
                onClick={() => handleContactAgent(agent, 'phone')}
              >
                <ApperIcon name="Phone" className="w-4 h-4 mr-2" />
                Call Agent
              </Button>
              <Button
                variant="outline"
                onClick={() => handleContactAgent(agent, 'email')}
              >
                <ApperIcon name="Mail" className="w-4 h-4 mr-2" />
                Send Email
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Agent Listings */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Listings by {agent.name}
          </h2>
          <Badge variant="primary" className="text-sm">
            {agentListings.length} {agentListings.length === 1 ? 'Property' : 'Properties'}
          </Badge>
        </div>

        {listingsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>
                <div className="space-y-2">
                  <div className="bg-gray-200 rounded h-4 w-3/4"></div>
                  <div className="bg-gray-200 rounded h-4 w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : agentListings.length === 0 ? (
          <EmptyState
            icon="Home"
            title="No Listings Found"
            message={`${agent.name} doesn't have any active listings at the moment.`}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agentListings.map((property) => (
              <motion.div
                key={property.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <PropertyCard
                  property={property}
                  onViewDetails={() => handlePropertyClick(property.Id)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentProfile;