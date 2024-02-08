import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    mechanic: {
      type: mongoose.Types.ObjectId,
      ref: "Mechanic",
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    price: { type: String, required: true },


    isPaid: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

bookingSchema.pre(/^find/, function (next) {
    this.populate("user").populate({
        path: "mechanic",
        select: "name",
    });

    next();
});

export default mongoose.model("Booking", bookingSchema);
