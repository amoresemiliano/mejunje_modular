import React from 'react';
import {
  X,
  Plus,
  Trash2,
  Copy,
  Edit3,
  RotateCcw,
  SlidersHorizontal,
  Package,
  Building2,
  Clock,
  MapPin,
  Globe,
  Play,
  Save,
  Send,
  CheckSquare,
  Square,
  LayoutGrid,
  List,
  Eye,
  Share2,
  Info,
  AlertCircle,
  AlertTriangle,
  Compass,
  Scale,
  Sparkles as LucideSparkles,
  LayoutDashboard as LucideLayoutDashboard,
  FlaskConical as LucideFlaskConical,
  ShoppingBag as LucideShoppingBag,
  TrendingUp as LucideTrendingUp,
  BookOpen as LucideBookOpen,
  Layers as LucideLayers,
  CheckCircle as LucideCheckCircle,
  CheckCircle2 as LucideCheckCircle2,
  ArrowRight as LucideArrowRight,
  ArrowUpRight as LucideArrowUpRight,
  Factory as LucideFactory,
  Calculator as LucideCalculator,
  ChevronRight as LucideChevronRight,
  ChevronDown as LucideChevronDown,
  ChevronUp as LucideChevronUp,
  FileText as LucideFileText,
  PackageCheck as LucidePackageCheck,
  RefreshCw as LucideRefreshCw,
  BarChart3 as LucideBarChart3,
  Search as LucideSearch,
  MessageCircle as LucideMessageCircle,
  Flower2 as LucideFlower2,
  Users as LucideUsers,
  UserCheck as LucideUserCheck,
  UserPlus as LucideUserPlus,
  Truck as LucideTruck,
  Phone as LucidePhone,
  Mail as LucideMail,
  Menu as LucideMenu,
  PanelLeft as LucidePanelLeft,
  PanelLeftClose as LucidePanelLeftClose,
} from 'lucide-react';

export {
  X,
  Plus,
  Trash2,
  Copy,
  Edit3,
  RotateCcw,
  SlidersHorizontal,
  Package,
  Building2,
  Clock,
  MapPin,
  Globe,
  Play,
  Save,
  Send,
  CheckSquare,
  Square,
  LayoutGrid,
  List,
  Eye,
  Share2,
  Info,
  AlertCircle,
  AlertTriangle,
  Compass,
  Scale,
};

export const Menu = LucideMenu;
export const PanelLeft = LucidePanelLeft;
export const PanelLeftClose = LucidePanelLeftClose;
export const Users = LucideUsers;
export const UserCheck = LucideUserCheck;
export const UserPlus = LucideUserPlus;
export const Truck = LucideTruck;
export const Phone = LucidePhone;
export const Mail = LucideMail;

// Domain-Specific Handcrafted SVG Icons for MEJUNJE Atelier

export function CandleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75} {...props}>
      {/* Candle flame */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.5c1.2 1.8 1.8 3 1.2 4.2-.6 1.2-1.8 1.3-2.4 0-.6-1.3 0-2.4 1.2-4.2z" className="text-mejunje-ambar" fill="currentColor" fillOpacity={0.2} />
      {/* Wick */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5v2" />
      {/* Candle cylinder body */}
      <rect x="7.5" y="9.5" width="9" height="12" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 12h9" />
    </svg>
  );
}

export function DropperIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 4.5a2.12 2.12 0 00-3-3l-2 2 3 3 2-2z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 6.5L6.5 14a2.83 2.83 0 00-.8 2l-.7 4.5 4.5-.7a2.83 2.83 0 002-.8L19 11.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 20l1.5-1.5" />
      {/* Droplet */}
      <circle cx="3.5" cy="21.5" r="1" fill="currentColor" />
    </svg>
  );
}

export function ApothecaryBottleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75} {...props}>
      {/* Stopper */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 2.5h4v2h-4z" />
      {/* Neck */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 4.5v2.5h3v-2.5" />
      {/* Bottle Body */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 9.5c0-1.4 1-2.5 2.5-2.5h5c1.5 0 2.5 1.1 2.5 2.5v10c0 1.1-.9 2-2 2h-6c-1.1 0-2-.9-2-2v-10z" />
      {/* Amber label */}
      <rect x="9" y="11.5" width="6" height="5" rx="0.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1" />
    </svg>
  );
}

export function MortarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75} {...props}>
      {/* Pestle */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 3l4 8M14 4l5 6" />
      {/* Bowl */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 11h16c0 5-3.5 8.5-8 8.5S4 16 4 11z" />
      {/* Base */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 19.5h8" />
    </svg>
  );
}

export function BalanceScaleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17M12 3L6 7m6-4l6 4M6 7l-3 6h6L6 7zm12 0l-3 6h6l-3-6zM8 20h8" />
    </svg>
  );
}

export function BotanicalBranchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 19c4-4 8-10 14-14" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 13c-2-3-1-5 1-6 2.5 1 3 3 1 6z" fill="currentColor" fillOpacity={0.15} />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 9c-1-3 1-5 3-4 1 2.5-.5 4.5-3 4z" fill="currentColor" fillOpacity={0.15} />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16c-3-1-4 1-3 3 2.5 0 3.5-1.5 3-3z" fill="currentColor" fillOpacity={0.15} />
    </svg>
  );
}

export function BotanicalLeafIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5c-7 0-14 5-14 14 9 0 14-7 14-14z" fill="currentColor" fillOpacity={0.15} />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 18.5c4-4 8-8 14-14" />
    </svg>
  );
}

export function TypewriterKeyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="6" strokeDasharray="2 1" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 10v4m4-4v4m-4-2h4" />
    </svg>
  );
}

export function TagStringIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 3.5L3.5 9.5a2 2 0 000 2.83l7.17 7.17a2 2 0 002.83 0l6-6a2 2 0 00.58-1.41V4.5a1 1 0 00-1-1h-7.58a2 2 0 00-1.42.59z" />
      <circle cx="15.5" cy="7.5" r="1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 6c2-2 4-2 5-1" />
    </svg>
  );
}

export const Sparkles = LucideSparkles;
export const LayoutDashboard = LucideLayoutDashboard;
export const FlaskConical = LucideFlaskConical;
export const ShoppingBag = LucideShoppingBag;
export const TrendingUp = LucideTrendingUp;
export const BookOpen = LucideBookOpen;
export const Layers = LucideLayers;
export const CheckCircle = LucideCheckCircle;
export const CheckCircle2 = LucideCheckCircle2;
export const ArrowRight = LucideArrowRight;
export const ArrowUpRight = LucideArrowUpRight;
export const Factory = LucideFactory;
export const Calculator = LucideCalculator;
export const ChevronRight = LucideChevronRight;
export const ChevronDown = LucideChevronDown;
export const ChevronUp = LucideChevronUp;
export const FileText = LucideFileText;
export const PackageCheck = LucidePackageCheck;
export const RefreshCw = LucideRefreshCw;
export const BarChart3 = LucideBarChart3;
export const Search = LucideSearch;
export const MessageCircle = LucideMessageCircle;
export const Flower2 = LucideFlower2;
export const CompassIcon = Compass;
export const ScalesIcon = Scale;

// Micro-illustrations for editorial embellishments

export function BotanicalBranchMini({ className = "w-12 h-6" }: { className?: string }) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 48 24" strokeWidth={1.25} className={`text-mejunje-verdeseco/60 ${className}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 18c10-4 22-8 44-12" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 14c-1-3 0-5 2-6 2 1 2.5 3 .5 6z" fill="currentColor" fillOpacity={0.2} />
      <path strokeLinecap="round" strokeLinejoin="round" d="M26 10c-1-3 1-5 3-4 1 2 0 4-2 4z" fill="currentColor" fillOpacity={0.2} />
      <path strokeLinecap="round" strokeLinejoin="round" d="M38 7c0-2 2-4 3-3 1 1.5-.5 3-2 3z" fill="currentColor" fillOpacity={0.2} />
    </svg>
  );
}

export function DropletMini({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg fill="currentColor" viewBox="0 0 16 16" className={`text-mejunje-ambar/80 ${className}`}>
      <path d="M8 1c2.5 3.5 5 7 5 9.5a5 5 0 11-10 0C3 8 5.5 4.5 8 1z" />
    </svg>
  );
}
