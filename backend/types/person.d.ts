import { Document } from "mongoose";

interface IPerson extends Document {
    _id: string;
    member_id: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
    address: string;
    zip: string;
    city: string;
    country: string;
    initDate: Date;
    adhesion: {
        initDate: Date;
        payment: {
            hasPaid: boolean;
            date: Date;
            method: string;
            intentId: string;
        }
    }
}

export default IPerson