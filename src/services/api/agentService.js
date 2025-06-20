import agentsData from '../mockData/agents.json';

class AgentService {
  constructor() {
    this.agents = [...agentsData];
  }

  // Simulate API delay
  delay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get all agents
  async getAll() {
    await this.delay();
    return [...this.agents];
  }

  // Get agent by ID
  async getById(id) {
    await this.delay();
    const agent = this.agents.find(agent => agent.Id === parseInt(id));
    return agent ? { ...agent } : null;
  }

  // Get agent by property ID (find agent associated with a property)
  async getByPropertyId(propertyId) {
    await this.delay();
    // This would typically query properties to find the associated agent
    // For now, we'll return the first agent as a placeholder
    return this.agents.length > 0 ? { ...this.agents[0] } : null;
  }

  // Create new agent
  async create(agentData) {
    await this.delay();
    const newId = Math.max(...this.agents.map(agent => agent.Id), 0) + 1;
    const newAgent = {
      Id: newId,
      ...agentData,
    };
    this.agents.push(newAgent);
    return { ...newAgent };
  }

  // Update agent
  async update(id, agentData) {
    await this.delay();
    const index = this.agents.findIndex(agent => agent.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Agent not found');
    }
    
    this.agents[index] = {
      ...this.agents[index],
      ...agentData,
      Id: parseInt(id) // Ensure ID doesn't change
    };
    
    return { ...this.agents[index] };
  }

  // Delete agent
  async delete(id) {
    await this.delay();
    const index = this.agents.findIndex(agent => agent.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Agent not found');
    }
    
    const deletedAgent = this.agents.splice(index, 1)[0];
    return { ...deletedAgent };
  }
}

export default new AgentService();