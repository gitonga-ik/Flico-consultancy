import {
    Hr,
    Text,
} from "react-email";

import { EmailLayout } from "../Components/Layout";
import { EmailButton } from "../Components/EmailButton";
import { ExpiryNotice } from "../Components/LinkExpiry";
import { styles } from "../styles";
import { COMPANY_NAME } from "../theme";

interface PurchaseConfirmationEmailProps {
    recipientName?: string;
    productName: string;
    downloadUrl: string;
    expiresInDays?: number;
    logoUrl?: string;
}

export default function PurchaseConfirmationEmail({
                                                      recipientName = "there",
                                                      productName,
                                                      downloadUrl,
                                                      expiresInDays = 7,
                                                      logoUrl,
                                                  }: PurchaseConfirmationEmailProps) {
    return (
        <EmailLayout
            logoUrl={logoUrl}
            preview={`Your purchase is confirmed — download "${productName}"`}
        >
            <Text style={styles.eyebrow}>Payment Successful</Text>

            <Text style={styles.heading}>
                Thank you for your purchase, {recipientName}!
            </Text>

            <Text style={styles.paragraph}>
                We&#39;ve successfully received your payment and your order is now complete.
            </Text>

            <Text style={styles.paragraph}>
                Your purchase of <strong>{productName}</strong> has been confirmed and
                your download is ready.
            </Text>

            <EmailButton href={downloadUrl}>
                Download Your Purchase
            </EmailButton>

            <ExpiryNotice days={expiresInDays} purpose={"download"}/>

            <Text style={styles.paragraph}>
                If the button above doesn&#39;t work, copy and paste this link into your
                browser:
            </Text>

            <Text style={styles.linkFallback}>
                {downloadUrl}
            </Text>

            <Hr style={styles.hr} />

            <Text style={styles.paragraph}>
                <strong>Need to download it later?</strong>
            </Text>

            <Text style={styles.paragraph}>
                This download link remains active for{" "}
                <strong>{expiresInDays} days</strong>. After it expires, you&#39;ll need to
                contact {COMPANY_NAME} if you require access again.
            </Text>

            <Text style={styles.paragraph}>
                We appreciate your business and hope you find your purchase valuable.
                Thank you for choosing <strong>{COMPANY_NAME}</strong>.
            </Text>

            <Hr style={styles.hr} />

            <Text style={styles.footnote}>
                If you did not make this purchase or believe this email was sent in
                error, please contact our support team as soon as possible.
            </Text>
        </EmailLayout>
    );
}