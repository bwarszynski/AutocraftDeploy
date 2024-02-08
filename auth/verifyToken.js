import jwt from 'jsonwebtoken';
import Mechanic from "../models/MechanicSchema.js";
import User from "../models/UserSchema.js";

export const authenticate = async (req, res, next) => {

    // pobierz Token z nagłówka
    const authToken = req.headers.authorization;

    // sprawdź czy token istnieje
    if (!authToken || !authToken.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({success: false, message: "Brak tokenu, autoryzacja zabroniona"});
    }

    try {
        const token = authToken.split(" ")[1];

        // sprawdź poprawność tokenu
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        req.userId = decoded.id;
        req.role = decoded.role;

        next(); // musi być wezwanie następnej funkcji
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res
                .status(401)
                .json({success: false, message: "Token wygasł"});
        }
        return res
            .status(401)
            .json({success: false, message: "Token nieprawidłowy"});
    }
};

export const restrict = roles => async (req, res, next) => {
    const userId = req.userId;

    let user;
    // sprawdź rolę użytkownika i pobierz odpowiednie dane
    const customer = await User.findById(userId);
    const mechanic = await Mechanic.findById(userId);

    if (customer) {
        user = customer;
    } else if (mechanic) {
        user = mechanic;
    } else {
        return res.status(404).json({ message: "Nie znaleziono użytkownika" });
    }

    if(!roles.includes(user.role)){
        return res.status(401).json({success: false, message: "Brak uprawnień do autoryzacji"});
    }

    next();
};

// middleware do autentykacji poszczególnych dostepów
export const adminAuth = restrict(["admin"]);
export const mechanicAuth = restrict(["mechanic"]);
export const customerAuth = restrict(["customer", "admin"]);