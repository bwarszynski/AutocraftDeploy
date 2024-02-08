import Mechanic from "../models/MechanicSchema.js";
import Booking from "../models/BookingSchema.js";

// zaktualizuj dane mechanika
export const updateMechanic = async (req, res) => {
    const id = req.params.id

    try {
        const updatedMechanic = await Mechanic.findByIdAndUpdate(
            id,
            {
                $set: req.body,
            },
            {
                new: true
            }
            );

        res.status(200).json({success: true, message: "Pomyślnie zaktualizowano mechanika", data: updatedMechanic});
    } catch (err) {
        res.status(500).json({success: false, message: "Nie udało się zaktualizować"});
    }
};

// usuń mechanika
export const deleteMechanic = async (req, res) => {
    const id = req.params.id;

    try {
        await Mechanic.findByIdAndDelete(id);

        res.status(200).json({success: true, message: "Pomyślnie usunięto mechanika"});

    } catch (err) {
        res.status(500).json({success: false, message: "Nie udało się usunąć"});
    }
};

// pobierz pojedynczego mechanika po id
export const getSingleMechanic = async (req, res) => {
    const id = req.params.id;

    try {
        const mechanic = await Mechanic.findById(id).populate("reviews").select("-password");

        res.status(200).json({success: true, message: "Znaleziono mechanika", data: mechanic});

    } catch (err) {
        res.status(404).json({success: false, message: "Nie znaleziono mechanika"})
    }
};

// pobierz wszystkich mechaników
export const getAllMechanics = async (req, res) => {
    try {
        const { query } = req.query;
        let mechanics;

        if (query) {
            // Szukaj mechanika po specjalizacji bądź imieniu i nazwisku
            mechanics = await Mechanic.find({
                isApproved: "approved",
                $or: [
                    {name: {$regex: query, $options: "i"}}, // wyszukiwanie regexem imienia bez uwzględniania wielkości liter
                    {specialization: {$regex: query, $options: "i"}}, // wyszukiwanie regexem specjalizacji bez uwzględniania wielkości liter
                ],
            }).select("-password");
        } else {
            // pobierz wszystki zaakceptowanych mechaników
            mechanics = await Mechanic.find({ isApproved: "approved" }).select("-password");
        }

        res.status(200).json({success: true, message: "Znaleziono mechaników", data: mechanics});

    } catch (err) {
        res.status(404).json({success: false, message: "Nie znaleziono mechaników"})
    }
};

export const getMechanicProfile = async (req, res) => {
    const userId = req.userId

    try {
        const user = await Mechanic.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Nie znaleziono mechanika"})
        }

        const {password, ...rest} = user._doc;
        const appointments = await Booking.find({ mechanic:userId })

        res.status(200).json({success: true, message: "Znaleziono mechanika", data: {...rest, appointments}})

    } catch {
        res.status(500).json({success: false, message: "Coś poszło nie tak, nie można pobrać"})
    }
};
