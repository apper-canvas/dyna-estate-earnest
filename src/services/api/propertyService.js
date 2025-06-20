import propertyData from '@/services/mockData/properties.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PropertyService {
  constructor() {
    this.properties = [...propertyData];
  }

  async getAll(filters = {}) {
    await delay(300);
    
    let filteredProperties = [...this.properties];

    // Apply filters
    if (filters.priceMin) {
      filteredProperties = filteredProperties.filter(p => p.price >= filters.priceMin);
    }
    if (filters.priceMax) {
      filteredProperties = filteredProperties.filter(p => p.price <= filters.priceMax);
    }
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      filteredProperties = filteredProperties.filter(p => 
        filters.propertyTypes.includes(p.propertyType)
      );
    }
    if (filters.bedroomsMin) {
      filteredProperties = filteredProperties.filter(p => p.bedrooms >= filters.bedroomsMin);
    }
    if (filters.bathroomsMin) {
      filteredProperties = filteredProperties.filter(p => p.bathrooms >= filters.bathroomsMin);
    }
    if (filters.squareFeetMin) {
      filteredProperties = filteredProperties.filter(p => p.squareFeet >= filters.squareFeetMin);
    }
    if (filters.location) {
      filteredProperties = filteredProperties.filter(p => 
        p.address.city.toLowerCase().includes(filters.location.toLowerCase()) ||
        p.address.neighborhood.toLowerCase().includes(filters.location.toLowerCase()) ||
        p.address.street.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredProperties = filteredProperties.filter(p => 
        p.title.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.address.street.toLowerCase().includes(searchTerm) ||
        p.address.city.toLowerCase().includes(searchTerm) ||
        p.features.some(feature => feature.toLowerCase().includes(searchTerm))
      );
    }

    return filteredProperties;
  }

  async getById(id) {
    await delay(200);
    const property = this.properties.find(p => p.Id === parseInt(id, 10));
    if (!property) {
      throw new Error('Property not found');
    }
    return { ...property };
  }

  async create(propertyData) {
    await delay(400);
    const newId = Math.max(...this.properties.map(p => p.Id)) + 1;
    const newProperty = {
      ...propertyData,
      Id: newId,
      listingDate: new Date().toISOString()
    };
    this.properties.push(newProperty);
    return { ...newProperty };
  }

  async update(id, propertyData) {
    await delay(300);
    const index = this.properties.findIndex(p => p.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Property not found');
    }
    
    const updatedProperty = {
      ...this.properties[index],
      ...propertyData,
      Id: this.properties[index].Id // Preserve ID
    };
    
    this.properties[index] = updatedProperty;
    return { ...updatedProperty };
  }

  async delete(id) {
    await delay(250);
    const index = this.properties.findIndex(p => p.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Property not found');
    }
    
    const deletedProperty = this.properties.splice(index, 1)[0];
    return { ...deletedProperty };
  }
}

export default new PropertyService();