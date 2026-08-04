import { Button, Section } from "react-email";
import { ReactNode } from "react";
import { styles } from "@/Mail/styles";

interface EmailButtonProps {
    href: string;
    children: ReactNode;
}

export function EmailButton({
                                href,
                                children,
                            }: EmailButtonProps) {
    return (
        <Section style={styles.buttonWrapper}>
            <Button href={href} style={styles.button}>
                {children}
            </Button>
        </Section>
    );
}