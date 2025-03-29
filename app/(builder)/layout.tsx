import "@/app/(chaibuilder)/styles.css";
import "@chaibuilder/sdk/styles";

export const metadata = {
  title: "Chai Builder - Admin",
  description: "Chai Builder",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html dir="ltr" className="smooth-scroll">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
