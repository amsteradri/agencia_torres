"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function ContactoPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(231,25,31,0.22),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(231,25,31,0.18),transparent_42%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e7191f33_1px,transparent_1px),linear-gradient(to_bottom,#e7191f33_1px,transparent_1px)] bg-[size:44px_44px] opacity-[0.18] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_40%,#000_55%,transparent_100%)]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-6 py-10 md:px-10 md:py-14">
        <div className="mb-12 flex items-center justify-between gap-4">
          <motion.h1
            initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl font-black uppercase tracking-[0.16em] text-[#e7191f] md:text-6xl"
          >
            Contacto
          </motion.h1>

          <Link
            href="/"
            className="rounded-full border border-[#e7191f]/40 px-5 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#e7191f] transition-colors hover:bg-[#e7191f] hover:text-white"
          >
            Volver
          </Link>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_1.35fr]">
          <motion.aside
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
            className="rounded-3xl border border-[#e7191f]/25 bg-zinc-950/80 p-6 backdrop-blur-md md:p-8"
          >
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.35em] text-[#e7191f]">
              Agencia Torres
            </p>

            <h2 className="mb-5 text-3xl font-black uppercase leading-[0.95] tracking-tight md:text-4xl">
              Cuéntanos tu reto
            </h2>

            <p className="mb-8 text-sm leading-relaxed text-zinc-300 md:text-base">
              Diseñamos estrategias de marketing con foco real en conversión y posicionamiento.
              Envíanos tu información y te contactamos con una propuesta clara.
            </p>

            <div className="space-y-3">
              {[
                "Respuesta inicial en menos de 24h",
                "Enfoque en resultados y crecimiento",
                "Estrategia adaptada a tu negocio",
              ].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-3"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-[#e7191f]" />
                  <span className="text-sm text-zinc-200">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.aside>

          <motion.section
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
            className="rounded-3xl border border-[#e7191f]/30 bg-zinc-950/80 p-6 shadow-[0_0_60px_rgba(231,25,31,0.09)] backdrop-blur-md md:p-8"
          >
            <form action="https://formspree.io/f/xbdqgald" method="POST" className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="nombre" className="mb-2 block text-sm font-semibold text-zinc-100">
                    Nombre*
                  </label>
                  <input
                    id="nombre"
                    name="Nombre"
                    type="text"
                    required
                    className="w-full rounded-xl border border-zinc-700/90 bg-black/80 px-4 py-3 text-white outline-none transition-all focus:border-[#e7191f] focus:shadow-[0_0_0_3px_rgba(231,25,31,0.18)]"
                  />
                </div>

                <div>
                  <label htmlFor="apellidos" className="mb-2 block text-sm font-semibold text-zinc-100">
                    Apellidos
                  </label>
                  <input
                    id="apellidos"
                    name="Apellidos"
                    type="text"
                    className="w-full rounded-xl border border-zinc-700/90 bg-black/80 px-4 py-3 text-white outline-none transition-all focus:border-[#e7191f] focus:shadow-[0_0_0_3px_rgba(231,25,31,0.18)]"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-semibold text-zinc-100">
                    Email*
                  </label>
                  <input
                    id="email"
                    name="Email"
                    type="email"
                    required
                    className="w-full rounded-xl border border-zinc-700/90 bg-black/80 px-4 py-3 text-white outline-none transition-all focus:border-[#e7191f] focus:shadow-[0_0_0_3px_rgba(231,25,31,0.18)]"
                  />
                </div>

                <div>
                  <label htmlFor="numero" className="mb-2 block text-sm font-semibold text-zinc-100">
                    Número*
                  </label>
                  <input
                    id="numero"
                    name="Numero"
                    type="tel"
                    required
                    className="w-full rounded-xl border border-zinc-700/90 bg-black/80 px-4 py-3 text-white outline-none transition-all focus:border-[#e7191f] focus:shadow-[0_0_0_3px_rgba(231,25,31,0.18)]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="empresa" className="mb-2 block text-sm font-semibold text-zinc-100">
                  Empresa
                </label>
                <input
                  id="empresa"
                  name="Empresa"
                  type="text"
                  className="w-full rounded-xl border border-zinc-700/90 bg-black/80 px-4 py-3 text-white outline-none transition-all focus:border-[#e7191f] focus:shadow-[0_0_0_3px_rgba(231,25,31,0.18)]"
                />
              </div>

              <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-zinc-400">* Campos obligatorios</p>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-[#e7191f] px-8 py-3 text-xs font-black uppercase tracking-[0.18em] text-white transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(231,25,31,0.55)]"
                >
                  Enviar Brief
                </button>
              </div>
            </form>
          </motion.section>
        </div>
      </div>
    </main>
  );
}