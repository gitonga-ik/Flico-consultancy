import {
    Body,
    Container,
    Head,
    Html,
    Preview,
    Section,
} from "react-email";
import { ReactNode } from "react";
import { styles } from "@/Mail/styles";
import { Footer } from "./Footer";
import { Logo } from "./Logo";

interface EmailLayoutProps {
    preview: string;
    logoUrl?: string;
    children: ReactNode;
}

export function EmailLayout({
                                preview,
                                children,
                            }: EmailLayoutProps) {
    return (
        <Html>
            <Head />
            <Preview>{preview}</Preview>

            <Body style={styles.main}>
                <Container style={styles.container}>
                    <Logo />

                    <Section style={styles.card}>{children}</Section>

                    <Footer />
                </Container>
            </Body>
        </Html>
    );
}