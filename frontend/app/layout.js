import "./globals.css";

export const metadata = {
  title: "AutoGraph",
  description: "Upload your data and instantly get meaningful visualizations.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Animated Background Orbs for the Glassmorphism Effect */}
        <div className="bg-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
          <div className="orb orb-4"></div>
        </div>
        
        {children}
      </body>
    </html>
  );
}
