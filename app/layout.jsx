export const metadata = {
  title: "N.O.V.A — Neural Operative Virtual Assistant",
  description: "Personal AI Agent",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "#080808" }}>
        {children}
      </body>
    </html>
  );
}
