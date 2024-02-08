import User from "../models/UserSchema.js";
import Mechanic from "../models/MechanicSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// generowanie tokenu
const generateToken = user => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: '15d',
        }
    );
};

export const register = async (req, res) => {
    const {email, password, name, role, photo, gender} = req.body;

    try {
        // sprawdzenie czy użytkownik istnieje
        let user = null;

        // porównanie rol i wybranie odpowiedniego maila z bazy
        if (role === "customer") {
            user = await User.findOne({ email });
        } else if (role === "mechanic") {
            user = await Mechanic.findOne({ email });
        }
        // sprawdzanie czy użytkownik już wcześniej został utworzony
        if (user) {
            return res
                .status(400)
                .json({message: 'Użytkownik już istnieje'});
        }

        // hashowanie hasła
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // bazując na roli tworzony jest nowy użytkownik
        if (role === "customer") {
            user = new User({
                name,
                email,
                password: hashPassword,
                photo,
                gender,
                role
            });
        }

        if (role === "mechanic") {
            user = new Mechanic({
                name,
                email,
                password: hashPassword,
                photo,
                gender,
                role
            });
        }
        await user.save();
        res
            .status(200)
            .json({success: true, message: 'Użytkownik został zarejestrowany pomyślnie'})

    } catch (err) {
        res
            .status(500)
            .json({success: false, message: 'Wewnętrzny błąd serwera, spróbuj ponownie później'})
    }
}

export const login = async (req, res) => {

    const {email} = req.body

    try {
        let user = null;

        // sprawdzenie roli użytkownika i pobranie odpowiednich danych
        const customer = await User.findOne({ email })
        const mechanic = await Mechanic.findOne({ email })

        if (customer) {
            user = customer;
        } else if (mechanic) {
            user = mechanic;
        }

        // sprawdzanie czy użytkownik istnieje
        if (!user) {
            return res
                .status(400)
                .json({success: false, message: "Nie znaleziono użytkownika"});
        }

        // porównaj hasła
        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);

        if(!isPasswordMatch){
            return res
                .status(400)
                .json({success: false, message: "Niepoprawne dane logowania"});
        }

        // generowanie tokena
        const token = generateToken(user);

        const {password, role, appointments, ...rest} = user._doc;

        res.status(200).json({success: true, message: "Zalogowano pomyślnie", token, data:{...rest}, role })

    } catch (err) {
    res.status(500).json({success: false, message: "Nie udało się zalogować"})
    }
};