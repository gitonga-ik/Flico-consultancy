import { Img, Section} from "react-email";
import { styles } from "@/Mail/styles";
import * as React from "react";

export function Logo() {
    return (
        <Section style={styles.logoSection}>
            <Img
                src="cid:flico-logo"
                alt="Flico Consultancy"
                width="100"
                style={styles.logo}
            />
        </Section>
    );
}