import { Section, Text } from "react-email";
import { styles } from "@/Mail/styles";

interface Props {
    hours?: number;
    days?: number;
    purpose: string;
}

export function ExpiryNotice({ hours, days, purpose }: Props) {
    const duration = days !== undefined ? `${days} day${days === 1 ? "" : "s"}` : `${hours} hour${hours === 1 ? "" : "s"}`;

    return (
        <Section style={styles.noticeBox}>
            <Text style={styles.noticeText}>
                TThis link will remain active for the next{" "}
                <strong>{duration}</strong>. Please complete your {purpose} before it expires..
            </Text>
        </Section>
    );
}
