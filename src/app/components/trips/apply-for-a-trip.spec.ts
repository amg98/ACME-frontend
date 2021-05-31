import { Trip } from "src/app/models/Trip"

describe("apply-for-a-trip", () => {

    const tripID = "123"
    const sampleTrip: Trip = {
        _id: tripID,
        ticker: "210510-IMUZ",
        title: "Trip title",
        requirements: ["R1", "R2", "R3"],
        startDate: "2021-05-20T12:46:31.290Z",
        endDate: "2021-06-20T12:46:31.290Z",
        pictures: ["https://images.io/image.jpg"],
        cancelReason: "",
        isCancelled: false,
        isPublished: true,
        price: 120,
        stages: [
            {
                title: "Stage 1",
                description: "Stage 1 description",
                price: 120,
            }
        ],
    }

})