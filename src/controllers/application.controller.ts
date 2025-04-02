import { Request, Response } from 'express';
import Application, { IApplication } from '../models/application.model';

// Create new application entry
export const createApplication = async (req: Request, res: Response) => {
  try {
    const application = new Application(req.body);
    await application.save();
    res.status(201).json(application);
  } catch (error) {
    res.status(400).json({ message: 'Error creating application entry', error });
  }
};

// Get all applications for a device
export const getDeviceApplications = async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    const applications = await Application.find({ deviceId })
      .sort({ lastUsed: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error });
  }
};

// Get active applications for a device
export const getActiveApplications = async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    const applications = await Application.find({ 
      deviceId,
      isActive: true 
    }).sort({ lastUsed: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching active applications', error });
  }
};

// Update application status (end time and duration)
export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { endTime } = req.body;

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.endTime = endTime;
    application.duration = Math.floor((endTime.getTime() - application.startTime.getTime()) / 1000);
    application.isActive = false;
    application.usageCount += 1;

    await application.save();
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Error updating application status', error });
  }
};

// Get application usage statistics
export const getApplicationStats = async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    const stats = await Application.aggregate([
      { $match: { deviceId } },
      {
        $group: {
          _id: '$packageName',
          totalDuration: { $sum: '$duration' },
          usageCount: { $sum: 1 },
          lastUsed: { $max: '$lastUsed' }
        }
      },
      { $sort: { totalDuration: -1 } }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching application statistics', error });
  }
};

// Get applications by category
export const getApplicationsByCategory = async (req: Request, res: Response) => {
  try {
    const { deviceId, category } = req.params;
    const applications = await Application.find({ 
      deviceId,
      category 
    }).sort({ lastUsed: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications by category', error });
  }
};

// Delete application entry
export const deleteApplication = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const application = await Application.findByIdAndDelete(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting application', error });
  }
}; 