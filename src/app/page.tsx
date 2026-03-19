"use client";

"use client";

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const magneticBtnRef = useRef<HTMLButtonElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Custom cursor movement
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);

    // Initialize Lenis for smooth vertical to horizontal mapping
    const lenis = new Lenis({
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Setup Horizontal Scroll with GSAP (Only Desktop)
    let sections = gsap.utils.toArray(".panel");
    const container = containerRef.current;

    if (container) {
      let mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        // Ajustamos el end para que equivalga exactamente al desplazamiento real a lo largo de las secciones
        const scrollDistance = container.offsetWidth - window.innerWidth;

        let tween = gsap.to(sections, {
          xPercent: -100 * (sections.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: container,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${scrollDistance}`,
          }
        });
        
        return () => {
          tween.kill();
        };
      });

      return () => {
        mm.revert();
        lenis.destroy();
        ScrollTrigger.getAll().forEach(t => t.kill());
        window.removeEventListener("mousemove", updateMousePosition);
      };
    }
  }, []);

  // Magnetic Button Logic
  const handleMagneticMove = (e: React.MouseEvent) => {
    const el = magneticBtnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(el, { x: x * 0.4, y: y * 0.4, duration: 0.5, ease: "power3.out" });
  };

  const handleMagneticLeave = () => {
    const el = magneticBtnRef.current;
    if (!el) return;
    gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
  };

  // Scroll to Top action on Title click
  const scrollToTop = () => {
    lenisRef.current?.scrollTo(0, { 
      duration: 1.2, 
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
    });
  };

  // Navigation jumping calculada exactamente por el ancho de la ventana GSAP
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, index: number) => {
    e.preventDefault();
    if (!containerRef.current || !lenisRef.current) return;
    
    if (window.innerWidth < 768) {
      // En móvil es scroll vertical nativo
      const sectionsItems = document.querySelectorAll('.panel');
      if(sectionsItems[index]) {
        lenisRef.current.scrollTo(sectionsItems[index] as HTMLElement, { 
          duration: 1.2, 
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
        });
      }
    } else {
      // Obtenemos exactamente el espacio escroleable real de la animación pineada
      const totalScroll = containerRef.current.offsetWidth - window.innerWidth;
      
      // Si tenemos 4 secciones (3 desplazamientos = Hero -> 1, Marketer -> 2, Portafolio -> 3, Contacto -> 4)
      const targetScroll = (totalScroll / 3) * index; 
      
      // Sustituimos window.scrollTo por el control de Lenis directo
      lenisRef.current.scrollTo(targetScroll, { 
        duration: 1.2, 
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
      });
    }
  };

  return (
    <main className="bg-black text-[#FACC15] overflow-x-hidden font-sans cursor-none selection:bg-[#FACC15] selection:text-black">
      
      {/* Background Noise overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-[0.03] bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')]"></div>

      {/* Global Custom Cursor */}
      <motion.div 
        ref={cursorRef}
        className="fixed top-0 left-0 w-6 h-6 bg-[#FACC15] rounded-full pointer-events-none z-[100] mix-blend-difference"
        animate={{ 
          x: mousePosition.x - 12, 
          y: mousePosition.y - 12,
          scale: isHovered ? 2.5 : 1
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
      />


      {/* Fixed Navbar - Responsive */}
      <nav className="fixed top-0 left-0 w-full p-4 md:p-8 z-50 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 text-white mix-blend-difference pointer-events-none">
        
        {/* Izquierda: LOGO */}
        <div className="md:flex-1 flex w-full justify-between md:justify-start items-center pointer-events-auto">
          <button 
            onClick={scrollToTop}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="text-lg md:text-2xl font-black tracking-[0.2em] relative group overflow-hidden"
          >
            <div className="translate-y-0 group-hover:-translate-y-full transition-transform duration-500 will-change-transform">A.TORRES</div>
            <div className="absolute top-0 left-0 translate-y-full group-hover:translate-y-0 text-[#FACC15] transition-transform duration-500 will-change-transform">A.TORRES</div>
          </button>

          {/* Estado on Mobile */}
          <div className="flex md:hidden text-[9px] uppercase tracking-widest opacity-80 items-center gap-2">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse"></span>
            Open for Work
          </div>
        </div>

        {/* Centro: ENLACES CENTRADOS */}
        <div className="md:flex-1 w-full md:w-auto flex justify-center gap-6 md:gap-12 text-[9px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold pointer-events-auto border-t md:border-t-0 border-white/10 pt-4 md:pt-0">
          {["El Marketer", "Portafolio", "Contacto"].map((item, i) => (
            <a 
              href={`#sec-${i}`}
              key={item} 
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={(e) => scrollToSection(e, i + 1)}
              className="relative group cursor-pointer overflow-hidden pb-1"
            >
              <div className="group-hover:-translate-y-full transition-transform duration-500">{item}</div>
              <div className="absolute top-0 left-0 translate-y-full group-hover:translate-y-0 text-[#FACC15] transition-transform duration-500">{item}</div>
            </a>
          ))}
        </div>

        {/* Derecha: ESTADO (Desktop) */}
        <div className="hidden md:flex flex-1 justify-end text-xs uppercase tracking-widest opacity-50 items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Open for Work
        </div>
      </nav>

      {/* Main Horizontal/Vertical Container */}
      <div ref={containerRef} className="flex flex-col md:flex-row w-full md:w-[400vw] h-auto md:h-screen will-change-transform">
        
        {/* SECTION 01: HERO */}
        <section id="home" className="panel w-full md:w-screen min-h-[100svh] md:h-screen flex flex-col justify-center items-center bg-black relative border-b md:border-b-0 md:border-r border-white/5 overflow-hidden">
          
          {/* Background Image para el Hero */}
          <div className="absolute inset-0 z-0">
             <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80" alt="Hero background" className="w-full h-full object-cover opacity-30 grayscale" />
             <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black"></div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
            className="z-10 text-center flex flex-col items-center pointer-events-none mt-20 md:mt-0"
          >
            <h2 className="text-[12vw] md:text-[8vw] font-black leading-[0.9] md:leading-[0.8] tracking-tighter md:tracking-tighter uppercase whitespace-normal md:whitespace-nowrap px-4 md:px-0">
              El Marketing <br/>
              <span className="text-white/30 italic font-serif font-light lowercase text-[14vw] md:text-[9vw] block md:inline">no se vende</span><span className="hidden md:inline">,</span> <br className="md:hidden" />
              <span className="text-white md:ml-4">se siente</span>
            </h2>

            {/* Scroll Indicator animado apuntando a la derecha (abajo en móvil) */}
            <div className="mt-16 md:mt-20 text-[#FACC15]/70 text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.4em] flex flex-col md:flex-row items-center gap-4 md:gap-6 relative z-10 pointer-events-auto">
              <span>Scroll para explorar</span>
              <div className="relative flex items-center">
                <div className="w-20 h-[1px] bg-gradient-to-r from-transparent to-[#FACC15]"></div>
                <motion.div 
                  animate={{ x: [0, 15, 0], opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[10px] border-l-[#FACC15]"
                />
              </div>
            </div>
          </motion.div>
        </section>

        {/* SECTION 02: ABOUT */}
        <section id="marketing" className="panel w-full md:w-screen min-h-[100svh] md:h-screen flex flex-col-reverse md:flex-row justify-center items-center px-6 md:px-[12vw] bg-[#050505] relative border-b md:border-b-0 md:border-r border-[#FACC15]/10 overflow-hidden pt-24 md:pt-0 pb-16 md:pb-0 gap-8 md:gap-0">
          
          {/* React Bits Style: Spotlight & Dot Pulse Network (More visible!) */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Malla de puntos radial interactiva - Más brillante y visible */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff50_2px,transparent_2px)] [background-size:25px_25px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)] opacity-30"></div>
            
            {/* Esfera de luz desplazándose lentamente - Mayor opacidad para que resalte */}
            <motion.div 
              animate={{ 
                x: ['-20vw', '20vw', '-20vw'],
                y: ['-10vh', '15vh', '-10vh'],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[800px] h-[800px] bg-[#FACC15]/10 rounded-full blur-[120px]" 
            />
          </div>

          <div className="hidden md:block absolute top-20 right-[-5vw] text-[20vw] font-black opacity-[0.02] pointer-events-none select-none text-[#FACC15] leading-none z-0">
            STRATEGY <br/>
            HACKER
          </div>
          
          <div className="z-10 w-full md:max-w-[45vw] relative text-center md:text-left flex flex-col items-center md:items-start">
            <div className="flex items-center gap-4 mb-6 md:mb-8">
              <div className="w-8 md:w-12 h-px bg-[#FACC15]"></div>
              <span className="text-[#FACC15] uppercase tracking-[0.3em] text-[10px] md:text-sm">El Marketer</span>
            </div>

            <h2 className="text-4xl md:text-7xl font-bold mb-6 md:mb-10 text-white uppercase tracking-tighter">
              ¿Quién es Álvaro?
            </h2>
            <p className="text-xl md:text-3xl text-zinc-300 font-light leading-snug mb-6 md:mb-10 text-justify md:text-left">
              No hacemos ruido, <span className="text-black font-bold bg-[#FACC15] px-2 selection:bg-white selection:text-black">componemos melodías</span>. Transformamos ideas difusas en marcas que la gente quiere consumir.
            </p>
            <p className="text-base md:text-xl text-zinc-500 mb-10 md:mb-14 max-w-2xl text-justify md:text-left">
              Especialista en Growth, Branding Radical y Performance. Más de 10 años ayudando a marcas a entender que el diseño sin números es arte, y los números sin diseño es código aburrido.
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4">
              {['Dirección Creativa', 'Data Driven', 'ROI Obsessed'].map((tag, idx) => (
                <motion.span 
                  key={tag} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="px-4 py-2 md:px-6 md:py-3 border border-white/10 rounded-full text-white/70 text-[10px] md:text-xs uppercase tracking-wider backdrop-blur-sm"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Foto Principal de Álvaro Torres */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative md:absolute md:top-[20%] md:right-[8%] w-[60vw] md:w-[28vw] max-w-[250px] md:max-w-[400px] aspect-[4/5] z-0 pointer-events-auto"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Decoración de acento detrás de la foto */}
            <div className="absolute -inset-2 md:-inset-4 border border-[#FACC15]/30 rounded-2xl rotate-3 transition-transform duration-700 hover:rotate-6"></div>
            <img 
              src="/torres.jpeg" 
              alt="Álvaro Torres" 
              className="w-full h-full object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl relative z-10"
            />
          </motion.div>
        </section>

          {/* SECTION 03: PORTFOLIO */}
        <section id="portfolio" className="panel w-full md:w-screen min-h-[100svh] md:h-screen flex flex-col justify-start md:justify-center items-center bg-[#050505] border-b md:border-b-0 md:border-r border-[#FACC15]/20 relative overflow-hidden py-24 md:py-0">
          
          {/* FONDOS MARCADOS Y VISIBLES QUE NO SE PIERDEN EN EL DOM - PARTICLE WAVES / GLOWING ORBS */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#050505]">
            
            {/* Esfera gigante amarilla moviéndose de lado a lado en el fondo para asegurar que hay color VISIBLE */}
            <motion.div 
              animate={{ x: ['-20vw', '40vw', '-20vw'] }}
              transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
              className="absolute top-[20%] left-[10%] w-[60vw] h-[60vw] bg-[#FACC15]/20 rounded-full blur-[160px]"
            />

            {/* Segunda esfera contraste en la parte inferior */}
            <motion.div 
              animate={{ x: ['40vw', '-20vw', '40vw'] }}
              transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
              className="absolute bottom-[-10%] right-[10%] w-[100vw] md:w-[40vw] h-[100vw] md:h-[40vw] bg-white/10 rounded-full blur-[140px]"
            />

            {/* Malla de Puntos gigante animada parallax (Aseguramos que tiene un background-size fuerte y es visible) */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:40px_40px] md:[background-size:60px_60px] opacity-[0.15]">
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]"></div>
            </div>

            {/* Ondas tipo radar muy marcadas en el centro para darle tridimensionalidad */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] md:w-[80vw] h-[120vw] md:h-[80vw] border-[1px] border-[#FACC15]/20 rounded-full animate-ping [animation-duration:4s]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] md:w-[60vw] h-[80vw] md:h-[60vw] border-[2px] border-[#FACC15]/30 rounded-full opacity-50"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] md:w-[40vw] h-[60vw] md:h-[40vw] border-[1px] border-white/20 rounded-full border-dashed animate-[spin_30s_linear_infinite]"></div>

          </div>

          <h2 className="text-white text-3xl md:text-5xl font-black md:mb-[10vh] uppercase tracking-[0.2em] relative md:absolute mt-8 md:mt-0 md:top-24 z-20 mb-12">Proyectos</h2>
          
          <div className="flex flex-col md:flex-row gap-8 md:gap-8 px-4 md:px-20 relative z-10 w-full max-w-[100vw] md:max-w-[85vw] mx-auto justify-center items-center group/container">
            
            {[
              { id: 1, title: 'Campaña Vicio 2.0', cat: 'Branding', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80' },
              { id: 2, title: 'Fintech App', cat: 'Growth', img: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80' },
              { id: 3, title: 'Ecommerce Fashion', cat: 'Performance', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80' },
            ].map((card) => (
              <div 
                key={card.id}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative w-[85%] md:w-[30%] aspect-[4/3] md:aspect-[3/4] bg-black border border-white/10 rounded-3xl overflow-hidden cursor-pointer flex flex-col justify-end p-6 md:p-8 transition-all duration-700 md:hover:-translate-y-6 hover:rotate-1 hover:border-[#FACC15]/50 group-hover/container:opacity-40 hover:!opacity-100 hover:scale-100 md:hover:scale-105"
              >
                {/* Background Image de tarjeta */}
                <img src={card.img} alt={card.title} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-700 group-hover:scale-110 ease-out" />
                
                {/* Glow Background */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#FACC15]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                {/* Content */}
                <span className="text-[#FACC15] text-[10px] md:text-xs font-bold tracking-widest mb-2 opacity-100 md:opacity-0 group-hover:opacity-100 md:-translate-y-4 group-hover:translate-y-0 transition-all duration-500 z-10">{card.cat}</span>
                <h3 className="text-2xl md:text-3xl font-bold text-white z-10 translate-y-0 md:translate-y-8 group-hover:translate-y-0 transition-all duration-500 ease-out">{card.title}</h3>
                
                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 md:top-8 md:right-8 w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 flex items-center justify-center md:translate-x-10 opacity-100 md:opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 md:delay-100 bg-white/5 backdrop-blur-md">
                  <span className="text-[#FACC15] text-lg md:text-xl leading-none">↗</span>
                </div>
              </div>
            ))}
            
          </div>
        </section>

        {/* SECTION 04: CONTACT */}
        <section id="contacto" className="panel w-full md:w-screen min-h-[100svh] md:h-screen flex flex-col justify-center items-center bg-black relative overflow-hidden py-32 md:py-0">
          
          {/* React Bits Style: Animated Squares Grid - Enhanced Visibility */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex justify-center items-center">
             <div className="w-[150%] h-[150%] bg-[linear-gradient(to_right,#facc1540_1px,transparent_1px),linear-gradient(to_bottom,#facc1540_1px,transparent_1px)] bg-[size:30px_30px] md:bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)] animate-[spin_120s_linear_infinite]" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-[#FACC15]/10 rounded-full blur-[80px] md:blur-[120px]" />
          </div>

          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-black/40 to-black opacity-90 pointer-events-none"></div>

          <h2 className="text-[14vw] md:text-[7vw] font-black text-white mb-6 z-10 leading-[0.9] md:leading-[0.8] text-center uppercase tracking-tighter px-4 md:px-0">
            El Momento <br/>es <span className="text-[#FACC15] italic font-serif font-light lowercase">ahora</span>
          </h2>
          <p className="text-zinc-400 mb-12 md:mb-20 z-10 text-sm md:text-xl font-light text-center px-6">Deja de pensar. Empieza a ejecutar.</p>

          <div 
            className="z-10 p-4 md:p-8 rounded-full pointer-events-auto"
            onMouseMove={handleMagneticMove}
            onMouseLeave={(e) => {
              handleMagneticLeave();
              setIsHovered(false);
            }}
            onMouseEnter={() => setIsHovered(true)}
          >
            <button 
              ref={magneticBtnRef}
              className="w-36 h-36 md:w-48 md:h-48 bg-[#FACC15] rounded-full text-black font-black uppercase tracking-[0.2em] flex items-center justify-center text-[10px] md:text-sm shadow-[0_0_50px_rgba(250,204,21,0.2)] hover:shadow-[0_0_100px_rgba(250,204,21,0.6)] transition-shadow duration-500 hover:scale-110"
            >
              Hablemos
            </button>
          </div>
        </section>
        
      </div>
    </main>
  );
}
