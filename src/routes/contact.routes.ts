import express from 'express';
import {
  createContact,
  getDeviceContacts,
  getContactById,
  updateContact,
  deleteContact,
  getFavoriteContacts,
  searchContacts,
  getContactsByGroup,
  getContactStats,
  permanentlyDeleteContacts
} from '../controllers/contact.controller';
import { auth } from '../middleware/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Create new contact entry
router.post('/', createContact);

// Get all contacts for a device
router.get('/device/:deviceId', getDeviceContacts);

// Get contact by ID
router.get('/device/:deviceId/contact/:contactId', getContactById);

// Update contact
router.put('/device/:deviceId/contact/:contactId', updateContact);

// Delete contact (soft delete)
router.delete('/device/:deviceId/contact/:contactId', deleteContact);

// Get favorite contacts
router.get('/device/:deviceId/favorites', getFavoriteContacts);

// Search contacts
router.get('/device/:deviceId/search', searchContacts);

// Get contacts by group
router.get('/device/:deviceId/group/:group', getContactsByGroup);

// Get contact statistics
router.get('/device/:deviceId/stats', getContactStats);

// Permanently delete contacts
router.post('/device/:deviceId/permanent-delete', permanentlyDeleteContacts);

export default router; 