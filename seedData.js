const mongoose = require('mongoose');
const Machine = require('./models/Machine');
const Reading = require('./models/Reading');
const Maintenance = require('./models/Maintenance');

// Sample data for seeding
const sampleMachines = [
  {
    name: 'Epson L805',
    brand: 'Epson',
    modelNumber: 'L805',
    installationDate: new Date('2023-01-15'),
    status: 'Active'
  },
  {
    name: 'Canon PIXMA G3010',
    brand: 'Canon',
    modelNumber: 'PIXMA G3010',
    installationDate: new Date('2023-02-20'),
    status: 'Active'
  },
  {
    name: 'Epson L3150',
    brand: 'Epson',
    modelNumber: 'L3150',
    installationDate: new Date('2023-03-10'),
    status: 'Active'
  },
  {
    name: 'Canon PIXMA G2010',
    brand: 'Canon',
    modelNumber: 'PIXMA G2010',
    installationDate: new Date('2023-04-05'),
    status: 'Under Maintenance'
  },
  {
    name: 'Epson L210',
    brand: 'Epson',
    modelNumber: 'L210',
    installationDate: new Date('2023-05-12'),
    status: 'Active'
  }
];

const generateReadings = (machines) => {
  const readings = [];
  const today = new Date();
  
  machines.forEach((machine, machineIndex) => {
    let currentCount = Math.floor(Math.random() * 5000) + 1000; // Starting count
    
    // Generate readings for the last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const previousCount = currentCount;
      const dailyPrints = Math.floor(Math.random() * 200) + 50; // 50-250 prints per day
      currentCount += dailyPrints;
      
      // Skip some days to make it realistic
      if (Math.random() > 0.3) { // 70% chance of having a reading
        readings.push({
          machineId: machine._id,
          date: date,
          currentCount: currentCount,
          previousCount: previousCount,
          totalPrints: dailyPrints,
          remarks: i % 7 === 0 ? 'Weekly maintenance check' : ''
        });
      }
    }
  });
  
  return readings;
};

const generateMaintenance = (machines) => {
  const maintenance = [];
  const serviceTypes = ['Head Cleaning', 'Ink Reset', 'General Service', 'Parts Replacement', 'Calibration', 'Other'];
  const technicians = ['John Smith', 'Mike Johnson', 'Sarah Davis', 'Robert Wilson', 'Emily Brown'];
  
  machines.forEach((machine) => {
    // Generate 2-4 maintenance records per machine
    const recordCount = Math.floor(Math.random() * 3) + 2;
    
    for (let i = 0; i < recordCount; i++) {
      const serviceDate = new Date();
      serviceDate.setDate(serviceDate.getDate() - (Math.random() * 90 + 30)); // 30-120 days ago
      
      const nextServiceDate = new Date(serviceDate);
      nextServiceDate.setDate(nextServiceDate.getDate() + (Math.random() * 60 + 30)); // 30-90 days later
      
      maintenance.push({
        machineId: machine._id,
        serviceDate: serviceDate,
        serviceType: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
        technicianName: technicians[Math.floor(Math.random() * technicians.length)],
        nextServiceDate: nextServiceDate,
        remarks: Math.random() > 0.5 ? 'Routine maintenance completed successfully' : '',
        cost: Math.floor(Math.random() * 200) + 50 // $50-$250
      });
    }
  });
  
  return maintenance;
};

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Machine.deleteMany({});
    await Reading.deleteMany({});
    await Maintenance.deleteMany({});
    
    console.log('Cleared existing data');
    
    // Insert machines
    const insertedMachines = await Machine.insertMany(sampleMachines);
    console.log(`Inserted ${insertedMachines.length} machines`);
    
    // Generate and insert readings
    const readings = generateReadings(insertedMachines);
    const insertedReadings = await Reading.insertMany(readings);
    console.log(`Inserted ${insertedReadings.length} readings`);
    
    // Generate and insert maintenance records
    const maintenance = generateMaintenance(insertedMachines);
    const insertedMaintenance = await Maintenance.insertMany(maintenance);
    console.log(`Inserted ${insertedMaintenance.length} maintenance records`);
    
    console.log('Database seeded successfully!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = seedDatabase;
