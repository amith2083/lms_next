"use server"
import { headers } from "next/headers";
const CURRENCY = "USD";

import { stripe } from "@/lib/stripe";
import { formatAmountForStripe } from "@/lib/stripeHelper";
import { getCourseDetails } from "@/queries/courses";

export async function createCheckoutSession(data){
    const ui_mode = "hosted";
    const origin = (await headers()).get("origin");
     const courseId = data.get("courseId");

      const course = await getCourseDetails(courseId);

    if(!course) return new Error(`Course not found`);

    const courseName = course?.title;
    const coursePrice = course?.price;

    const checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        submit_type: "auto",
        line_items: [
            {
                quantity: 1,
                price_data: {
                    currency: CURRENCY,

                    product_data: {
                        name: courseName,
                    },
                    unit_amount: formatAmountForStripe(coursePrice,CURRENCY)
                },
            },
        ],

        ...(ui_mode === "hosted" && {
            success_url: `${origin}/enroll-success?session_id={CHECKOUT_SESSION_ID}&courseId=${courseId}`,
            cancel_url: `${origin}/courses`
        }),

        ui_mode
    });

    return {
        client_secret: checkoutSession.client_secret,  //The user is taken to a secure, Stripe-hosted checkout page where they:
                  url: checkoutSession.url,            //Enter payment details (e.g., credit card number).
                                                       //Confirm the payment.                    
    };

}

/// End Method 

export async function createPaymentIntent(data){
    const paymentIntent = await stripe.paymentIntents.create({
        amount: formatAmountForStripe(coursePrice,
            CURRENCY
        ),
        automatic_payment_methods: {enabled:true},
        currency: CURRENCY
    });
    return { client_secret: paymentIntent.client_secret };

}
/// End Method 