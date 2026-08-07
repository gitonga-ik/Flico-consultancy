import { Text } from "react-email";
import { styles } from "@/Mail/styles";
import { COMPANY_NAME } from "../theme";

export function Footer() {
    return (
        <Text style={styles.footer}>
            © {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
        </Text>
    );
}