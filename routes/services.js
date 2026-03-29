const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const auth = require('../middleware/auth');

// Get all services
router.get('/', auth, async (req, res) => {
  try {
    console.log('=== SERVICES API DEBUG ===');
    console.log('Fetching all services...');
    console.log('User authenticated:', req.user);
    
    // Check if the services collection exists and has data
    console.log('Querying services collection...');
    const services = await Service.find().sort({ createdAt: -1 });
    console.log('Services found:', services.length);
    
    // If no services exist, create default services
    if (!services || services.length === 0) {
      console.log('No services found, creating default services...');
      
      const defaultServices = [
        {
          serviceName: 'Machine Maintenance',
          description: 'Regular maintenance and repair services for all machinery',
          isActive: true
        },
        {
          serviceName: 'Installation Service',
          description: 'Professional installation of new machinery and equipment',
          isActive: true
        },
        {
          serviceName: 'Technical Support',
          description: '24/7 technical support and troubleshooting services',
          isActive: true
        },
        {
          serviceName: 'Training Service',
          description: 'Operator training and safety certification programs',
          isActive: true
        },
        {
          serviceName: 'Consultation Service',
          description: 'Expert consultation for machinery optimization and efficiency',
          isActive: true
        }
      ];
      
      console.log('Inserting default services...');
      const createdServices = await Service.insertMany(defaultServices);
      console.log('Default services created:', createdServices.length);
      console.log('Created services:', createdServices.map(s => s.serviceName));
      return res.json(createdServices);
    }
    
    console.log('Returning existing services:', services.map(s => s.serviceName));
    res.json(services);
  } catch (error) {
    console.error('=== SERVICES API ERROR ===');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // If it's a collection doesn't exist error, create default services
    if (error.message && error.message.includes('Collection')) {
      console.log('Services collection does not exist, creating default services...');
      
      const defaultServices = [
        {
          serviceName: 'Machine Maintenance',
          description: 'Regular maintenance and repair services for all machinery',
          isActive: true
        },
        {
          serviceName: 'Installation Service',
          description: 'Professional installation of new machinery and equipment',
          isActive: true
        },
        {
          serviceName: 'Technical Support',
          description: '24/7 technical support and troubleshooting services',
          isActive: true
        }
      ];
      
      try {
        console.log('Attempting to create default services after collection error...');
        const createdServices = await Service.insertMany(defaultServices);
        console.log('Default services created:', createdServices.length);
        return res.json(createdServices);
      } catch (createError) {
        console.error('Error creating default services:', createError);
        console.error('Create error details:', createError.message);
        return res.status(500).json({ message: 'Failed to create default services', error: createError.message });
      }
    }
    
    console.error('Returning 500 error to client');
    res.status(500).json({ message: error.message, error: error.stack });
  }
});

// Get service by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    console.error('Error fetching service by ID:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create new service
router.post('/', auth, async (req, res) => {
  try {
    console.log('Creating new service:', req.body);
    const service = new Service(req.body);
    const newService = await service.save();
    console.log('Service created successfully');
    res.status(201).json(newService);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update service
router.put('/:id', auth, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete service
router.delete('/:id', auth, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
