import savedPropertyData from '@/services/mockData/savedProperties.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class SavedPropertyService {
  constructor() {
    this.savedProperties = [...savedPropertyData];
  }

  async getAll() {
    await delay(200);
    return [...this.savedProperties];
  }

  async getById(id) {
    await delay(150);
    const savedProperty = this.savedProperties.find(sp => sp.Id === parseInt(id, 10));
    if (!savedProperty) {
      throw new Error('Saved property not found');
    }
    return { ...savedProperty };
  }

  async create(savedPropertyData) {
    await delay(300);
    const newId = this.savedProperties.length > 0 
      ? Math.max(...this.savedProperties.map(sp => sp.Id)) + 1 
      : 1;
    
    // Check if property is already saved
    const existing = this.savedProperties.find(sp => sp.propertyId === savedPropertyData.propertyId);
    if (existing) {
      throw new Error('Property is already saved');
    }
    
    const newSavedProperty = {
      ...savedPropertyData,
      Id: newId,
      savedDate: new Date().toISOString()
    };
    
    this.savedProperties.push(newSavedProperty);
    return { ...newSavedProperty };
  }

  async update(id, savedPropertyData) {
    await delay(250);
    const index = this.savedProperties.findIndex(sp => sp.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Saved property not found');
    }
    
    const updatedSavedProperty = {
      ...this.savedProperties[index],
      ...savedPropertyData,
      Id: this.savedProperties[index].Id // Preserve ID
    };
    
    this.savedProperties[index] = updatedSavedProperty;
    return { ...updatedSavedProperty };
  }

  async delete(id) {
    await delay(200);
    const index = this.savedProperties.findIndex(sp => sp.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Saved property not found');
    }
    
    const deletedSavedProperty = this.savedProperties.splice(index, 1)[0];
    return { ...deletedSavedProperty };
  }

  async deleteByPropertyId(propertyId) {
    await delay(200);
    const index = this.savedProperties.findIndex(sp => sp.propertyId === propertyId);
    if (index === -1) {
      throw new Error('Saved property not found');
    }
    
    const deletedSavedProperty = this.savedProperties.splice(index, 1)[0];
    return { ...deletedSavedProperty };
  }

  async isPropertySaved(propertyId) {
    await delay(100);
    return this.savedProperties.some(sp => sp.propertyId === propertyId);
  }
}

export default new SavedPropertyService();