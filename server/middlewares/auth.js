import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Access denied, no token found.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: 'Invalid token provided.' });
    }
};

export default auth;