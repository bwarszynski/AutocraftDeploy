import Review from '../models/ReviewSchema.js';
import Mechanic from '../models/MechanicSchema.js';

//pobierz wszystkie recenzje
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({});
    res.status(200).json({success:true, message:"OK", data: reviews});
  } catch (err) {
    res.status(404).json({success:false, message: "Nie znaleziono" });
  }
};

//stwórz recenzje

export const createReview = async (req, res) => {
    if(!req.body.mechanic) req.body.mechanic = req.params.mechanicId;
    if(!req.body.user) req.body.user = req.userId;

    const newReview = new Review(req.body);

    try{
        const savedReview = await newReview.save();

        await Mechanic.findByIdAndUpdate(req.body.mechanic, {
            $push: { reviews: savedReview._id },
        });

        res
            .status(200)
            .json({ success: true, message: "Recenzja została dodana", data: savedReview });
    } catch(err) {
        res.status(500).json({success: false, message: err.message});
    }
}
