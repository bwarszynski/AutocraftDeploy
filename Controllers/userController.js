import User from "../models/UserSchema.js";
import Booking from "../models/BookingSchema.js";
import Mechanic from "../models/MechanicSchema.js";

// zaktualizuj dane użytkownika
export const updateUser = async (req, res) => {
    const id = req.params.id;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                $set: req.body
            },
            {
                new: true
            }
        )

        res.status(200).json({success: true, message: "Pomyślnie zaktualizowano użytkownika", data: updatedUser})
    } catch (err) {
        res.status(500).json({success: false, message: "Nie udało się zaktualizować"})
    }
};

// usuń użytkownika
export const deleteUser = async (req, res) => {
    const id = req.params.id;

    try {
        await User.findByIdAndDelete(id);

        res.status(200).json({success: true, message: "Pomyślnie usunięto użytkownika"});

    } catch (err) {
        res.status(500).json({success: false, message: "Nie udało się usunąć"});
    }
};

// pobierz pojedynczego użytkownika
export const getSingleUser = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await User.findById(id).select("-password");

        res.status(200).json({success: true, message: "Znaleziono użytkownika", data: user});

    } catch (err) {
        res.status(404).json({success: false, message: "Nie znaleziono użytkownika"})
    }
};

// pobierz wszystkich użytkowników
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");

        res.status(200).json({success: true, message: "Znaleziono użytkowników", data: users});

    } catch (err) {
        res.status(404).json({success: false, message: "Nie znaleziono użytkowników"})
    }
};

export const getUserProfile = async (req, res) => {
    const userId = req.userId

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({success: false, message: "Nie znaleziono użytkownika"})
        }

        const {password, ...rest} = user._doc;

        res.status(200).json({success: true, message: "Znaleziono użytkownika", data: {...rest}})

    } catch {
        res.status(500).json({success: false, message: "Coś poszło nie tak, nie można pobrać"})
    }
};

export const getMyAppointments = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.userId });

        const mechanicIds = bookings.map(el => el.mechanic.id);

        const mechanics = await Mechanic.find({_id: {$in: mechanicIds}}).select('-password');

        res.status(200).json({success:true, message: "Pobrano rezerwacje", data:mechanics});
    } catch (err) {
        res.status(500).json({success:false, message: "Coś poszło nie tak, nie można pobrać"});
    }
};