const LibraryAttendant = require('../models/LibraryAttendant');

exports.createAttendant = async (req, res) => {
    try {
        const attendant = new LibraryAttendant(req.body);
        await attendant.save();
        res.status(201).json(attendant);
    } catch (err) {
        res.status(400).json({ error: 'Server error' });
    }
};

exports.getAllAttendants = async (req, res) => {
    try {
        const attendants = await LibraryAttendant.find();
        res.json(attendants);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getAttendantById = async (req, res) => {
    try {
        const attendant = await LibraryAttendant.findById(req.params.id);
        if (!attendant) return res.status(404).json({ error: 'Attendant not found' });
        res.json(attendant);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};