import { Request, Response } from 'express';
import Location, { ILocation } from '../models/location.model';

// Create new location entry
export const createLocation = async (req: Request, res: Response) => {
  try {
    const location = new Location(req.body);
    await location.save();
    res.status(201).json(location);
  } catch (error) {
    res.status(400).json({ message: 'Error creating location entry', error });
  }
};

// Get latest location for a device
export const getLatestLocation = async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    const location = await Location.findOne({ deviceId })
      .sort({ timestamp: -1 });
    
    if (!location) {
      return res.status(404).json({ message: 'No location data found for device' });
    }
    
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching latest location', error });
  }
};

// Get location history for a device
export const getLocationHistory = async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    const { startDate, endDate, limit = 100 } = req.query;

    const query: any = { deviceId };
    
    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const locations = await Location.find(query)
      .sort({ timestamp: -1 })
      .limit(Number(limit));

    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching location history', error });
  }
};

// Get location statistics for a device
export const getLocationStats = async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    const { startDate, endDate } = req.query;

    const query: any = { deviceId };
    
    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const stats = await Location.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalLocations: { $sum: 1 },
          averageSpeed: { $avg: '$speed' },
          maxSpeed: { $max: '$speed' },
          averageAccuracy: { $avg: '$accuracy' },
          totalDistance: {
            $sum: {
              $cond: [
                { $gt: ['$speed', 0] },
                { $multiply: ['$speed', 1] }, // Assuming 1-second intervals
                0
              ]
            }
          },
          firstLocation: { $first: '$$ROOT' },
          lastLocation: { $last: '$$ROOT' }
        }
      }
    ]);

    res.json(stats[0] || {});
  } catch (error) {
    res.status(500).json({ message: 'Error fetching location statistics', error });
  }
};

// Get locations within a geographic boundary
export const getLocationsInBoundary = async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    const { 
      minLat, 
      maxLat, 
      minLng, 
      maxLng,
      startDate,
      endDate 
    } = req.query;

    const query: any = {
      deviceId,
      latitude: {
        $gte: Number(minLat),
        $lte: Number(maxLat)
      },
      longitude: {
        $gte: Number(minLng),
        $lte: Number(maxLng)
      }
    };

    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const locations = await Location.find(query)
      .sort({ timestamp: -1 });

    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching locations in boundary', error });
  }
};

// Get movement status for a device
export const getMovementStatus = async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    const { timeWindow = 300 } = req.query; // Default 5 minutes in seconds

    const cutoffTime = new Date(Date.now() - Number(timeWindow) * 1000);
    
    const recentLocations = await Location.find({
      deviceId,
      timestamp: { $gte: cutoffTime }
    }).sort({ timestamp: -1 });

    if (recentLocations.length === 0) {
      return res.json({ isMoving: false, lastUpdate: null });
    }

    const latestLocation = recentLocations[0];
    const isMoving = latestLocation.speed ? latestLocation.speed > 0 : false;

    res.json({
      isMoving,
      lastUpdate: latestLocation.timestamp,
      currentSpeed: latestLocation.speed,
      heading: latestLocation.heading
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movement status', error });
  }
};

// Delete location entries
export const deleteLocations = async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    const { startDate, endDate } = req.query;

    const query: any = { deviceId };
    
    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const result = await Location.deleteMany(query);
    res.json({ 
      message: 'Locations deleted successfully',
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting locations', error });
  }
}; 