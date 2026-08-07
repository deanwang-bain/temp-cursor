import type { Metadata } from "next";
import { I18nProvider } from "@/lib/i18n/context";
import { ChatProvider } from "@/lib/chat-context";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "EV Manufacturing AI Demo",
  description: "Demo system for integrated EV manufacturing AI use cases",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <I18nProvider>
          <ChatProvider>
            <AppShell>{children}</AppShell>
          </ChatProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
