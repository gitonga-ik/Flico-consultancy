import {
    Hr,
    Text,
} from "react-email";

import { EmailLayout } from "../Components/Layout";
import { EmailButton } from "../Components/EmailButton";
import { ExpiryNotice } from "../Components/LinkExpiry";
import { styles } from "../styles";
import { COMPANY_NAME } from "../theme";

interface VerificationEmailProps {
    recipientName?: string;
    paymentUrl: string;
    expiresInHours?: number;
    logoUrl?: string;
}

export default function VerificationEmail({
                                              recipientName = "there",
                                              paymentUrl,
                                              expiresInHours = 6,
                                              logoUrl,
                                          }: VerificationEmailProps) {
    return (
        <EmailLayout
            logoUrl={logoUrl}
            preview={`Your email is verified — complete your payment within ${expiresInHours} hours`}
        >
            <Text style={styles.eyebrow}>Email Verified</Text>

            <Text style={styles.heading}>
                You&#39;re all set, {recipientName}.
            </Text>

            <Text style={styles.paragraph}>
                This confirms that the email address you provided to{" "}
                <strong>{COMPANY_NAME}</strong> is valid and active.
            </Text>

            <Text style={styles.paragraph}>
                Your next step is to complete your payment using the button below.
            </Text>

            <EmailButton href={paymentUrl}>
                View Payment Details
            </EmailButton>

            <ExpiryNotice hours={expiresInHours} purpose={"payment"}/>

            <Text style={styles.paragraph}>
                If the button doesn&#39;t work, copy and paste this URL into your browser:
            </Text>

            <Text style={styles.linkFallback}>
                {paymentUrl}
            </Text>

            <Hr style={styles.hr} />

            <Text style={styles.footnote}>
                If you weren&#39;t expecting this email or don&#39;t recognize this request,
                you can safely ignore it.
            </Text>
        </EmailLayout>
    );
}