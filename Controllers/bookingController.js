import Booking from "../models/BookingSchema.js";
import Mechanic from "../models/MechanicSchema.js";
import Stripe from 'stripe';
import User from "../models/UserSchema.js";

export const getCheckoutSession = async (req, res) => {
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        // pobierz aktualnie rezerwowanego mechanika
        const mechanic = await Mechanic.findById(req.params.mechanicId);
        const user = await User.findById(req.userId);

        // utwórz sesje płatności
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            success_url: `${process.env.CLIENT_SITE_URL}/checkout-success`,
            cancel_url: `${req.protocol}://${req.get("host")}/mechanic/${mechanic.id}`,
            customer_email: user.email,
            client_reference_id: req.params.mechanicId,
            line_items: [
                {
                    price_data: {
                        currency: "pln",
                        unit_amount: mechanic.price * 100,
                        product_data: {
                            name: mechanic.name,
                            description: mechanic.bio,
                            images: [mechanic.photo],
                        },
                    },
                    quantity: 1,
                },
            ],
        });

        // Stwórz obiekt rezerwacji
        const booking = new Booking({
            mechanic: mechanic._id,
            user: user._id,
            price: mechanic.price,
            session: session.id,
        });

        // Zapisz do bazy danych
        await booking.save();

        // odpowiedz stworzoną sesją
        res.status(200).json({ success: true, message: "Sukces", session });
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ success: false, message: "Problem z płatnością" });
    }
};
