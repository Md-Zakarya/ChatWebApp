const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/adminMiddleware');
const {
    getAllUsers,
    deleteUser,
    updateUserRole,
    getAdminStats,
    loginAdmin
} = require('../controllers/adminController');

// Public route for admin login
router.post('/login', loginAdmin);





// Protect all routes
router.use(protect);
router.use(isAdmin);

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/role', updateUserRole);
router.get('/stats', getAdminStats);

module.exports = router;