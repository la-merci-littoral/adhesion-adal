import express, { Request, Response } from 'express';
import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

interface RawRequest extends Request {
    rawBody?: string;
}
import Stripe from 'stripe';
import mongoose from 'mongoose';
import AdhesionModel from './schemas/adhesion';


const envPath = process.env.NODE_ENV === 'production' ? '../.env.production' : '../.env.development';
require('dotenv').config({path: envPath});

const app = express(); 
const router = express.Router();     
router.use(express.json({
    verify: (req: Request, res: Response, buf: Buffer) => {
        if (req.path.includes("/payment/webhook")) {
            (req as RawRequest).rawBody = buf.toString();
        }
    }
}));
app.use('/', router);

const stripe = new Stripe(process.env.STRIPE_SK!);

mongoose.connect(process.env.MONGO_CONN_STR!);

const mailTransport = nodemailer.createTransport({
    pool: true,
    host: process.env.EMAIL_HOST!,
    port: parseInt(process.env.EMAIL_PORT!),
    auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!
    },
    connectionTimeout: 3000,
});

const emailTemplates: { [key: string]: string } = {};

fs.readdirSync(path.resolve('./emails')).forEach(file => {
    if (fs.statSync(path.resolve('./emails', file)).isDirectory()) {
        return;
    }
    const templateName = file.replace('.ejs', '');
    const templateContent = fs.readFileSync(`./emails/${file}`, 'utf-8');
    emailTemplates[templateName] = templateContent;
});

async function generatePaymentIntent() {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: parseInt(process.env.AMOUNT!),
        currency: 'eur',
        payment_method_types: ['card']
    });
    return [paymentIntent.id, paymentIntent.client_secret!];
}

router.put("/person", async (req, res) => {
    const userData = req.body;

    const potentialFind = await AdhesionModel.findOne({
        $and: [
            { "email": userData.email },
            { "adhesion.payment.hasPaid": true }
        ]
    })
    if (potentialFind !== null) {
        res.status(409).send("Already paid");
        return;
    }
    
    var paymentIntentSecret = userData.pi_secret
    var paymentIntentId = "";

    if (paymentIntentSecret === "") {
        console.log("Generating new payment intent");
        [paymentIntentId, paymentIntentSecret] = await generatePaymentIntent();
    } else {
        paymentIntentId = RegExp(/(.*)_secret_(.*)/gm).exec(paymentIntentSecret as string)![1]
        await stripe.paymentIntents.retrieve(paymentIntentId).then(async (paymentIntentObject) => {
            if (paymentIntentObject.status === "succeeded") {
                [paymentIntentId, paymentIntentSecret] = await generatePaymentIntent();
            }
        })
    }

    userData.adhesion = {
        date: new Date(),
        payment: {
            hasPaid: false,
            date: new Date(0),
            method: "none",
            intentId: paymentIntentId
        }
    }
    delete userData.pi_secret;

    const inserted = await AdhesionModel.findOneAndUpdate({
        $or: [
            { "email": userData.email },
            { "adhesion.payment.intentId": paymentIntentId }
        ]
    }, userData, {upsert: true, new: true});

    res.send({
        clientSecret: paymentIntentSecret,
        memberId: inserted?.member_id
    })

});

router.post("/payment/webhook", express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent((req as RawRequest).rawBody!, sig!, process.env.STRIPE_WBH_SECRET!);
    } catch (err: any | Error) {
        console.error(err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    event = req.body as Stripe.Event;
    if (event.type == 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        const updateResult = await AdhesionModel.findOneAndUpdate(
            { "adhesion.payment.intentId": paymentIntent.id },
            {
                $set: {
                    "adhesion.payment.hasPaid": true,
                    "adhesion.payment.date": new Date(),
                    "adhesion.payment.method": paymentIntent.payment_method
                }
            },
            { new: true } // Return the updated document
        );

        if (updateResult !== null){
            (updateResult as any).base_url = process.env.BASE_URL;
            mailTransport.sendMail({
                from: 'ADAL Ne pas Répondre ne-pas-repondre@amis-du-littoral.fr',
                to: updateResult.email,
                subject: "ADAL - Confirmation d'adhésion",
                html: ejs.render(emailTemplates['adhesion-confirm'], updateResult),
            });
        }
    }

    res.json({ received: true });
});

router.get("/validate", async (req, res) => {
    const paymentIntent = req.query.pi;
    try {
        const doc = await AdhesionModel.findOne({"adhesion.payment.intentId": paymentIntent});
        if (!doc) {
            res.status(404).send("Not found");
        } else {
            res.status(200).send("OK");
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get("/logo", (req, res) => {
    res.sendFile(__dirname + '/emails/assets/logo.png');
})

app.listen(5174, () => { console.log("Backend is running on port 5174") });