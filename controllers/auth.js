const checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) { 
        return res.status(403).json({ message: 'Already authenticated' });
    }
    next();
};

