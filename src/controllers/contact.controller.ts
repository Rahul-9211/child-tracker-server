import { Request, Response } from 'express';
import Contact, { IContact } from '../models/contact.model';

// Create new contact entry
export const createContact = async (req: Request, res: Response) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ message: 'Error creating contact entry', error });
  }
};

// Get all contacts for a device
export const getDeviceContacts = async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    const { includeDeleted = false } = req.query;

    const query: any = { deviceId };
    if (!includeDeleted) {
      query.isDeleted = false;
    }

    const contacts = await Contact.find(query)
      .sort({ name: 1 });
    
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contacts', error });
  }
};

// Get contact by ID
export const getContactById = async (req: Request, res: Response) => {
  try {
    const { deviceId, contactId } = req.params;
    const contact = await Contact.findOne({ 
      deviceId,
      contactId,
      isDeleted: false
    });
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contact', error });
  }
};

// Update contact
export const updateContact = async (req: Request, res: Response) => {
  try {
    const { deviceId, contactId } = req.params;
    const contact = await Contact.findOne({ 
      deviceId,
      contactId,
      isDeleted: false
    });

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Update fields from request body
    Object.assign(contact, req.body);
    contact.lastUpdated = new Date();
    
    await contact.save();
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Error updating contact', error });
  }
};

// Delete contact (soft delete)
export const deleteContact = async (req: Request, res: Response) => {
  try {
    const { deviceId, contactId } = req.params;
    const contact = await Contact.findOne({ 
      deviceId,
      contactId,
      isDeleted: false
    });

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    contact.isDeleted = true;
    contact.lastUpdated = new Date();
    
    await contact.save();
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contact', error });
  }
};

// Get favorite contacts
export const getFavoriteContacts = async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    const contacts = await Contact.find({ 
      deviceId,
      isFavorite: true,
      isDeleted: false
    }).sort({ name: 1 });
    
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching favorite contacts', error });
  }
};

// Search contacts
export const searchContacts = async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    const { query, includeDeleted = false } = req.query;

    const searchQuery: any = { 
      deviceId,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { phoneNumbers: { $regex: query, $options: 'i' } },
        { emailAddresses: { $regex: query, $options: 'i' } }
      ]
    };

    if (!includeDeleted) {
      searchQuery.isDeleted = false;
    }

    const contacts = await Contact.find(searchQuery)
      .sort({ name: 1 })
      .limit(50);

    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error searching contacts', error });
  }
};

// Get contacts by group
export const getContactsByGroup = async (req: Request, res: Response) => {
  try {
    const { deviceId, group } = req.params;
    const contacts = await Contact.find({ 
      deviceId,
      groups: group,
      isDeleted: false
    }).sort({ name: 1 });
    
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contacts by group', error });
  }
};

// Get contact statistics
export const getContactStats = async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    const stats = await Contact.aggregate([
      { $match: { deviceId, isDeleted: false } },
      {
        $group: {
          _id: null,
          totalContacts: { $sum: 1 },
          favoriteContacts: { $sum: { $cond: [{ $eq: ['$isFavorite', true] }, 1, 0] } },
          contactsWithPhotos: { $sum: { $cond: [{ $eq: ['$hasPhoto', true] }, 1, 0] } },
          contactsWithEmail: { $sum: { $cond: [{ $gt: [{ $size: '$emailAddresses' }, 0] }, 1, 0] } },
          averagePhoneNumbers: { $avg: { $size: '$phoneNumbers' } },
          groups: { $addToSet: '$groups' }
        }
      }
    ]);

    res.json(stats[0] || {});
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contact statistics', error });
  }
};

// Permanently delete contacts
export const permanentlyDeleteContacts = async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    const { contactIds } = req.body;

    const result = await Contact.deleteMany({
      deviceId,
      contactId: { $in: contactIds }
    });

    res.json({ 
      message: 'Contacts permanently deleted successfully',
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error permanently deleting contacts', error });
  }
}; 