declare module 'lucide-react' {
  import * as React from 'react';
  export type LucideIcon = React.ForwardRefExoticComponent<
    React.SVGProps<SVGSVGElement> & {
      size?: number | string;
      strokeWidth?: number | string;
      color?: string;
      className?: string;
      [key: string]: any;
    }
  >;
  export type Icon = LucideIcon;
  export const Calendar: LucideIcon;
  export const MapPin: LucideIcon;
  export const LayoutDashboard: LucideIcon;
  export const LogOut: LucideIcon;
  export const Menu: LucideIcon;
  export const Search: LucideIcon;
  export const Ticket: LucideIcon;
  export const CheckIcon: LucideIcon;
  export const ChevronRightIcon: LucideIcon;
  export const XIcon: LucideIcon;
  export const Check: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const ChevronUp: LucideIcon;
  export const X: LucideIcon;
  export const IndianRupee: LucideIcon;
  export const Users: LucideIcon;
  export const User: LucideIcon;
  export const Eye: LucideIcon;
  export const EyeOff: LucideIcon;
  export const Lock: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const Shield: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const Clock: LucideIcon;
  export const Sparkles: LucideIcon;
  export const Filter: LucideIcon;
  export const SlidersHorizontal: LucideIcon;
  export const Plus: LucideIcon;
  export const Trash2: LucideIcon;
  export const Edit: LucideIcon;
  export const Edit2: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const Info: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const Loader2: LucideIcon;
  export const DollarSign: LucideIcon;
  export const CreditCard: LucideIcon;
  export const Armchair: LucideIcon;
  export const ExternalLink: LucideIcon;
  export const Share2: LucideIcon;
  export const Download: LucideIcon;
  export const Tag: LucideIcon;
  export const Music: LucideIcon;
  export const Film: LucideIcon;
  export const Trophy: LucideIcon;
  export const Copy: LucideIcon;
  export const Printer: LucideIcon;
  export const QrCode: LucideIcon;
  export const Mic: LucideIcon;
  export const Compass: LucideIcon;
  export const TrendingUp: LucideIcon;
  export const Building: LucideIcon;
  export const Mail: LucideIcon;
  export const Phone: LucideIcon;
  export const MapPinCheck: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const RefreshCw: LucideIcon;
}

declare module 'react-router' {
  import * as React from 'react';
  export function useNavigate(): (to: any, options?: any) => void;
  export function useParams<T = Record<string, string | undefined>>(): T;
  export function useLocation(): {
    pathname: string;
    search: string;
    hash: string;
    state: any;
    key: string;
  };
  export function useSearchParams(): [
    URLSearchParams,
    (
      next:
        | URLSearchParams
        | ((prev: URLSearchParams) => URLSearchParams)
        | Record<string, any>
        | any,
      options?: any
    ) => void
  ];
  export const Routes: React.FC<{ children?: React.ReactNode }>;
  export const Route: React.FC<{
    path?: string;
    index?: boolean;
    element?: React.ReactNode;
    children?: React.ReactNode;
  }>;
  export const Link: React.ForwardRefExoticComponent<any>;
  export const Navigate: React.FC<{ to: any; replace?: boolean; state?: any }>;
}

declare module 'react-router-dom' {
  import * as React from 'react';
  export * from 'react-router';
  export const BrowserRouter: React.FC<{ children?: React.ReactNode }>;
  export const NavLink: React.ForwardRefExoticComponent<any>;
}
