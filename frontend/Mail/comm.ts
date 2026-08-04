"use server"

import resend from "@/Mail/mailer";
import {logger} from "@/utils/logger";
import {readFileSync} from "fs";
import VerificationEmail from "@/Mail/verification/VerificationEmail";
import "dotenv/config";

const logoBuffer = readFileSync("public/images/favicon.png");
const BASE_URL = process.env.BASE_URL;

export async function sendVerificationMail(email: string, token: string): Promise<boolean> {
    if (!email) throw new Error("Provide valid email");

    try {
        const {data, error} = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Email Verified',
            react: VerificationEmail({
                paymentUrl: `${BASE_URL}checkout/${token}`
            }),
            attachments: [
                {
                    filename: "logo.png",
                    content: logoBuffer,
                    contentId: "flico-logo",
                },
            ],
        });

        if(error){
            logger.error(`Could not send email to address ${email}: ${error.message}`);
            return false;
        }
        console.log(data);
        logger.info(`Mail sent to ${email} successfully.`);
        return true;
    } catch (error) {
        logger.error(`Could not send email to address ${email}: ${error}`)
        return false;
    }
}