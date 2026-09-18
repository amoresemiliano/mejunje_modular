"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PRODUCTS, Product, formatPrice } from "@/data/catalog";
import { ProductVisual } from "@/components/ProductVisual";
import { IntensityScale } from "@/components/IntensityScale";
import { useCart } from "@/context/CartContext";
import { 
  Sparkles, 
  Compass, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  ShoppingBag, 
  CheckCircle2,
  Heart
} from "lucide-react";

interface Question {
  id: number;
  title: string;
  subtitle: string;
  options: {
    label: string;
    description: string;
    tag: string;
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    title: "¿EN QUÉ RINCÓN DE TU CASA VAS A UBICAR EL AROMA?",
    subtitle: "El espacio físico determina la difusión del pabilo o las varillas de ratán.",
    options: [
      {
        label: "Living & Sala Principal",
        description: "Espacio amplio para compartir con visitas o relajarse en el sillón.",
        tag: "living",
      },
      {
        label: "Dormitorio & Mesita de Noche",
        description: "Rincón íntimo para desenchufar la mente antes de dormir.",
        tag: "dormitorio",
      },
      {
        label: "Escritorio & Estudio de Trabajo",
        description: "Ambiente que requiere foco mental, claridad y energía limpia.",
        tag: "estudio",
      },
      {
        label: "Toda la Casa / Pasillos",
        description: "Sensación de bienvenida constante al cruzar la puerta de entrada.",
        tag: "casa",
      },
    ],
  },
  {
    id: 2,
    title: "¿QUÉ ATMÓSFERA EMOCIONAL BUSCÁS PROVOCAR?",
    subtitle: "Los aromas viajan directo al sistema límbico donde residen los recuerdos.",
    options: [
      {
        label: "Calma & Desaceleración",
        description: "Bajar revoluciones, respirar hondo y soltar el día.",
        tag: "calma",
      },
      {
        label: "Refugio & Calidez Abrazadora",
        description: "Sensación de hogar, madera tibia, manta de lana y lluvia afuera.",
        tag: "refugio",
      },
      {
        label: "Claridad, Luz & Energía",
        description: "Aire fresco, luminosidad matutina y optimismo botánico.",
        tag: "energia",
      },
      {
        label: "Intimidad, Sensualidad & Misterio",
        description: "Notas envolventes para una velada nocturna o un encuentro especial.",
        tag: "sensualidad",
      },
    ],
  },
  {
    id: 3,
    title: "¿QUÉ INTENSIDAD OLFATIVA PREFERÍS?",
    subtitle: "Desde un susurro sutil en el ambiente hasta una presencia rotunda.",
    options: [
      {
        label: "Sutil & Etérea (Nivel 1 - 2)",
        description: "Se percibe casi como un suspiro en el aire sin saturar jamás.",
        tag: "baja",
      },
      {
        label: "Equilibrada & Envolvente (Nivel 3)",
        description: "Acompaña el ambiente de manera constante y agradable.",
        tag: "media",
      },
      {
        label: "Profunda & Rotunda (Nivel 4 - 5)",
        description: "Llena toda la habitación con personalidad e impronta marcada.",
        tag: "alta",
      },
    ],
  },
  {
    id: 4,
    title: "¿QUÉ FAMILIA DE NOTAS TE ATRAE INSTINTIVAMENTE?",
    subtitle: "Confiá en tu intuición botánica primera.",
    options: [
      {
        label: "Maderas Nobles & Resinas",
        description: "Cedro, sándalo, corteza seca y ámbar dorado.",
        tag: "amaderado",
      },
      {
        label: "Cítricos Prensados & Hierbas",
        description: "Bergamota de Calabria, hojas machacadas y té verde.",
        tag: "citrico",
      },
      {
        label: "Flores Nocturnas & Vainilla Bourbon",
        description: "Pétalos de rosa, jazmines de noche y dulzor balsámico.",
        tag: "floral",
      },
      {
        label: "Bosque Húmedo & Eucalipto",
        description: "Lavanda serrana, pino, musgo y tierra fresca.",
        tag: "verde",
      },
    ],
  },
];

export default function DescubriTuAromaPage() {
  const { addProductToCart } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isFinished, setIsFinished] = useState(false);

  const handleSelectOption = (tag: string) => {
    const updated = { ...answers, [currentStep]: tag };
    setAnswers(updated);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStep(0);
    setIsFinished(false);
  };

  // Determine best matching product
  const getRecommendation = (): { main: Product; companion: Product; score: number } => {
    const notePref = answers[3] || "amaderado";
    const moodPref = answers[1] || "refugio";

    let matchSlug = "vela-ambar-madera";
    if (notePref === "citrico" || moodPref === "energia") {
      matchSlug = "difusor-bergamota-calabria";
    } else if (notePref === "verde" || moodPref === "calma") {
      matchSlug = "home-spray-bosque-humedo";
    } else if (notePref === "floral" || moodPref === "sensualidad") {
      matchSlug = "perfume-textil-velvet-rose";
    } else if (notePref === "amaderado") {
      matchSlug = "vela-ambar-madera";
    }

    const main = PRODUCTS.find((p) => p.slug === matchSlug) || PRODUCTS[0];
    const companion = PRODUCTS.find((p) => p.slug !== matchSlug && p.aromaticFamily !== main.aromaticFamily) || PRODUCTS[1];

    return { main, companion, score: 98 };
  };

  const currentQ = QUESTIONS[currentStep];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-mejunje-paper border border-mejunje-border font-typewriter text-[10px] tracking-widest text-mejunje-amber uppercase">
          <Compass className="w-3.5 h-3.5" />
          <span>QUIZ OLFATIVO DE BOTICA</span>
        </div>
        <h1 className="font-typewriter text-3xl sm:text-4xl font-bold tracking-wide text-mejunje-charcoal">
          DESCUBRÍ TU AROMA IDEAL
        </h1>
        <p className="font-editorial italic text-base text-mejunje-muted max-w-lg mx-auto">
          “una guía de 4 pasos para encontrar el acorde botánico que resuene con tu casa y tu memoria.”
        </p>
      </div>

      {!isFinished ? (
        <div className="bg-white border border-mejunje-border rounded-3xl p-6 sm:p-12 shadow-sm space-y-8 animate-in fade-in duration-300">
          
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-typewriter text-mejunje-muted">
              <span>PREGUNTA {currentStep + 1} DE {QUESTIONS.length}</span>
              <span>{Math.round(((currentStep + 1) / QUESTIONS.length) * 100)}% COMPLETADO</span>
            </div>
            <div className="w-full h-1.5 bg-mejunje-paper rounded-full overflow-hidden">
              <div
                className="h-full bg-mejunje-amber transition-all duration-300 rounded-full"
                style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Title */}
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="font-typewriter text-xl sm:text-2xl font-bold text-mejunje-charcoal">
              {currentQ.title}
            </h2>
            <p className="font-editorial italic text-sm text-mejunje-muted">
              {currentQ.subtitle}
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentQ.options.map((opt, idx) => {
              const isSelected = answers[currentStep] === opt.tag;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt.tag)}
                  className={`p-6 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 group ${
                    isSelected
                      ? "bg-mejunje-paper border-mejunje-amber shadow-sm ring-1 ring-mejunje-amber"
                      : "bg-white border-mejunje-border hover:border-mejunje-amber hover:bg-mejunje-paper/50"
                  }`}
                >
                  <div className="flex items-start justify-between w-full">
                    <span className="font-typewriter text-sm font-bold text-mejunje-charcoal group-hover:text-mejunje-amber transition-colors">
                      {opt.label}
                    </span>
                    <span className="w-5 h-5 rounded-full border border-mejunje-border flex items-center justify-center text-mejunje-amber shrink-0">
                      {isSelected ? "✓" : ""}
                    </span>
                  </div>
                  <p className="font-sans text-xs text-mejunje-muted leading-relaxed">
                    {opt.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-mejunje-border flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex items-center gap-1.5 font-typewriter text-xs font-bold ${
                currentStep === 0
                  ? "text-mejunje-subtle/50 cursor-not-allowed"
                  : "text-mejunje-muted hover:text-mejunje-charcoal"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>ANTERIOR</span>
            </button>

            <span className="font-typewriter text-[11px] text-mejunje-muted">
              Paso {currentStep + 1} / {QUESTIONS.length}
            </span>
          </div>
        </div>
      ) : (
        /* QUIZ RESULT SCREEN */
        <div className="space-y-10 animate-in zoom-in-95 duration-300">
          {(() => {
            const { main, companion, score } = getRecommendation();
            return (
              <div className="space-y-10">
                {/* Result Hero */}
                <div className="bg-mejunje-paper border border-mejunje-border rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
                  <div className="flex items-center justify-between border-b border-mejunje-border pb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-mejunje-amber" />
                      <span className="font-typewriter text-xs font-bold uppercase tracking-widest text-mejunje-charcoal">
                        PERFIL OLFATIVO GENERADO
                      </span>
                    </div>
                    <span className="font-typewriter text-xs font-bold px-3 py-1 rounded-full bg-mejunje-amber text-white">
                      {score}% AFINIDAD
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-5 flex justify-center">
                      <div className="w-full max-w-xs bg-white rounded-2xl p-6 border border-mejunje-border shadow-inner">
                        <ProductVisual
                          type={main.visualType}
                          name={main.name}
                          notes={main.mainNotes}
                          accentColor={main.accentColor}
                          size="lg"
                        />
                      </div>
                    </div>

                    <div className="lg:col-span-7 space-y-4">
                      <span className="font-typewriter text-xs uppercase tracking-widest text-mejunje-amber font-bold block">
                        TU MEJUNJE DESTACADO
                      </span>
                      <h2 className="font-typewriter text-3xl font-bold text-mejunje-charcoal">
                        {main.name}
                      </h2>
                      <p className="font-editorial italic text-lg text-mejunje-muted">
                        “{main.shortStory}”
                      </p>
                      <p className="font-sans text-xs text-mejunje-ink leading-relaxed">
                        {main.poeticDescription}
                      </p>

                      <div className="pt-2">
                        <IntensityScale intensity={main.intensity} />
                      </div>

                      <div className="pt-4 flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => addProductToCart(main)}
                          className="px-6 py-3.5 rounded-xl bg-mejunje-charcoal hover:bg-mejunje-amber text-white font-typewriter text-xs font-bold tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>SUMAR AL CARRITO · {formatPrice(main.price)}</span>
                        </button>
                        <Link
                          href={`/producto/${main.slug}`}
                          className="px-6 py-3.5 rounded-xl bg-white border border-mejunje-border text-mejunje-charcoal font-typewriter text-xs font-bold text-center hover:bg-mejunje-paper transition-colors"
                        >
                          VER DETALLES
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secondary Companion suggestion */}
                <div className="bg-white border border-mejunje-border rounded-3xl p-8 space-y-4">
                  <span className="font-typewriter text-xs uppercase tracking-widest text-mejunje-terracotta font-bold block">
                    SEGUNDA CAPA OLFATIVA RECOMENDADA
                  </span>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="font-typewriter text-lg font-bold text-mejunje-charcoal">
                        {companion.name}
                      </h3>
                      <p className="font-editorial italic text-xs text-mejunje-muted mt-0.5">
                        “{companion.shortStory}”
                      </p>
                    </div>
                    <button
                      onClick={() => addProductToCart(companion)}
                      className="px-4 py-2.5 rounded-xl bg-mejunje-paper border border-mejunje-border hover:bg-mejunje-charcoal hover:text-white font-typewriter text-xs font-bold transition-colors shrink-0"
                    >
                      SUMAR TAMBIÉN · {formatPrice(companion.price)}
                    </button>
                  </div>
                </div>

                {/* Reset button */}
                <div className="text-center pt-4">
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 font-typewriter text-xs text-mejunje-muted hover:text-mejunje-charcoal transition-colors border-b border-mejunje-border pb-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>VOLVER A HACER EL QUIZ OLFATIVO</span>
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

    </div>
  );
}
