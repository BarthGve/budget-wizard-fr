
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, Menu, X } from "lucide-react";
import { appConfig } from "@/config/app.config";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Détecter le scroll pour changer l'apparence du navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const menuItems = [
    { label: "Fonctionnalités", href: "#features" },
    { label: "Témoignages", href: "#testimonials" },
    { label: "Technologies", href: "#techstack" },
    { label: "FAQ", href: "#faq" },
    { label: "Changelog", href: "/changelog" },
  ];

  return (
    <nav 
      className={`w-full transition-all duration-300 z-50 ${scrolled ? "py-2" : "py-4"}`}
    >
      <div className="container mx-auto px-4">
        <div className={`rounded-2xl backdrop-blur-md ${scrolled ? "bg-white/70 dark:bg-gray-950/70" : "bg-white/30 dark:bg-gray-950/30"} border border-white/10 dark:border-gray-800/30 shadow-lg transition-all duration-300 px-4 py-2`}>
          <div className="flex items-center justify-between">
            {/* Logo et nom */}
            <Link to="/" className="flex items-center gap-2">
              <motion.img
                src="/lovable-uploads/9f7c5b9f-f126-45eb-8e10-1a3c1de218a6.avif"
                alt="Budget Wizard" 
                className="w-8 h-8 transform-fix"
                whileHover={{ rotate: 10 }}
                style={{
                  WebkitBackfaceVisibility: 'hidden',
                  backfaceVisibility: 'hidden',
                  WebkitTransform: 'translateZ(0)',
                  transform: 'translateZ(0)'
                }}
              />
              <motion.span 
                className="font-bold text-lg sm:text-xl tracking-tight"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {appConfig.name}
              </motion.span>
            </Link>

            {/* Navigation desktop */}
            {!isMobile && (
              <motion.div 
                className="hidden md:flex items-center gap-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {menuItems.map((item, index) => (
                  <Link 
                    key={index} 
                    to={item.href.startsWith('#') ? `/${item.href}` : item.href}
                    className="text-sm font-medium text-gray-700 dark:text-gray-200 relative group"
                    onClick={(e) => {
                      if (item.href.startsWith('#')) {
                        e.preventDefault();
                        const element = document.querySelector(item.href);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }
                    }}
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                  </Link>
                ))}
              </motion.div>
            )}

            {/* Boutons d'action */}
            <div className="flex items-center gap-2 sm:gap-4">
              {!isMobile ? (
                <motion.div
                  className="flex items-center gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Link to="/login">
                    <Button variant="ghost" className="hover:bg-white/20 hover:text-primary">
                      {appConfig.landing.hero.buttons.login}
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-primary hover:bg-primary/90 text-white rounded-full">
                      {appConfig.landing.hero.buttons.register}
                    </Button>
                  </Link>
                </motion.div>
              ) : (
                <>
                  <Link to="/login" className="mr-2">
                    <Button size="sm" variant="ghost" className="gap-1 px-2 py-1.5">
                      <LogIn className="w-4 h-4" />
                      <span className="text-xs">Connexion</span>
                    </Button>
                  </Link>
                  <Button 
                    size="icon"
                    variant="ghost"
                    className="p-1.5"
                    onClick={toggleMenu}
                    aria-label="Menu"
                  >
                    {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                  </Button>
                </>
              )}
            </div>
          </div>
        
          {/* Menu mobile */}
          <AnimatePresence>
            {isMenuOpen && isMobile && (
              <motion.div
                className="mt-4 rounded-xl overflow-hidden"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col space-y-3 py-3 px-2 bg-white/10 dark:bg-gray-900/20 backdrop-blur-md rounded-xl">
                  {menuItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.href.startsWith('#') ? `/${item.href}` : item.href}
                      className="px-4 py-2 text-sm rounded-lg hover:bg-white/10 transition-colors"
                      onClick={(e) => {
                        if (item.href.startsWith('#')) {
                          e.preventDefault();
                          const element = document.querySelector(item.href);
                          if (element) {
                            setIsMenuOpen(false);
                            element.scrollIntoView({ behavior: 'smooth' });
                          }
                        } else {
                          setIsMenuOpen(false);
                        }
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Link to="/register" className="mt-2">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-full">
                      {appConfig.landing.hero.buttons.register}
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
