import { Outlet, Link } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm py-10">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-3">
                <img src="/logo.png" alt="EduGuide" className="w-7 h-7 rounded-lg" />
                <span className="font-display text-lg font-bold text-foreground">EduGuide</span>
              </Link>
              <p className="text-sm text-muted-foreground max-w-xs">
                Career path and college suggestion portal for MHT-CET & JEE students in Maharashtra. Free, fast, and privacy-first.
              </p>
            </div>
            <div>
              <h4 className="font-display font-semibold text-foreground mb-3">Quick Links</h4>
              <div className="flex flex-col gap-2">
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
                <Link to="/predict" className="text-sm text-muted-foreground hover:text-foreground transition-colors">College Predictor</Link>
                <Link to="/career-guidance" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Career Guidance</Link>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</Link>
              </div>
            </div>
            <div>
              <h4 className="font-display font-semibold text-foreground mb-3">Resources</h4>
              <div className="flex flex-col gap-2">
                <Link to="/about#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
                <span className="text-sm text-muted-foreground">Supports MHT-CET & JEE</span>
                <span className="text-sm text-muted-foreground">Maharashtra, India</span>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
            © 2026 EduGuide — Built with ❤️ for Engineering Aspirants
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
