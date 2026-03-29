const express = require('express');
const router = express.Router();
const Machine = require('../models/Machine');
const Reading = require('../models/Reading');
const Maintenance = require('../models/Maintenance');

// Get dashboard summary data
router.get('/summary', async (req, res) => {
  try {
    // Get total machines count
    const totalMachines = await Machine.countDocuments();

    // Get today's readings count
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayReadings = await Reading.countDocuments({
      date: { $gte: today, $lt: tomorrow }
    });

    // Get pending maintenance alerts
    const alertDate = new Date();
    alertDate.setDate(alertDate.getDate() + 3); // Next 3 days
    
    const pendingMaintenance = await Maintenance.countDocuments({
      nextServiceDate: { $lte: alertDate }
    });

    // Get recent activities (last 10 records)
    const recentReadings = await Reading.find()
      .populate('machineId', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentMaintenance = await Maintenance.find()
      .populate('machineId', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    // Combine and sort recent activities
    const recentActivities = [
      ...recentReadings.map(r => ({
        type: 'reading',
        description: `Daily reading added for ${r.machineId.name}`,
        date: r.createdAt,
        details: `Count: ${r.currentCount}, Prints: ${r.totalPrints}`
      })),
      ...recentMaintenance.map(m => ({
        type: 'maintenance',
        description: `${m.serviceType} performed on ${m.machineId.name}`,
        date: m.createdAt,
        details: `Technician: ${m.technicianName}`
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

    // Get maintenance alerts with priority
    const maintenanceAlerts = await Maintenance.find({
      nextServiceDate: { $lte: alertDate }
    })
    .populate('machineId', 'name brand modelNumber')
    .sort({ nextServiceDate: 1 });

    const alerts = maintenanceAlerts.map(record => {
      const daysUntilService = Math.ceil((record.nextServiceDate - new Date()) / (1000 * 60 * 60 * 24));
      let priority = 'low';
      
      if (daysUntilService <= 1) priority = 'high';
      else if (daysUntilService <= 3) priority = 'medium';

      return {
        machineName: record.machineId.name,
        serviceType: record.serviceType,
        nextServiceDate: record.nextServiceDate,
        daysUntilService,
        priority
      };
    });

    res.json({
      summary: {
        totalMachines,
        todayReadings,
        pendingMaintenance
      },
      recentActivities,
      alerts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get machine status breakdown
router.get('/machine-status', async (req, res) => {
  try {
    const statusBreakdown = await Machine.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(statusBreakdown);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get reading statistics for last 30 days
router.get('/reading-stats', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const stats = await Reading.aggregate([
      {
        $match: {
          date: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          totalPrints: { $sum: '$totalPrints' },
          totalReadings: { $sum: 1 },
          avgPrintsPerDay: { $avg: '$totalPrints' }
        }
      }
    ]);

    res.json(stats[0] || { totalPrints: 0, totalReadings: 0, avgPrintsPerDay: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
