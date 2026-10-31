// Comprehensive ESM wrapper for React Router v7
import * as ReactRouter from "react-router";

const mod: any = (ReactRouter as any)?.default ?? ReactRouter;

export const Await = mod.Await;
export const BrowserRouter = mod.BrowserRouter;
export const Form = mod.Form;
export const HashRouter = mod.HashRouter;
export const Link = mod.Link;
export const Links = mod.Links;
export const MemoryRouter = mod.MemoryRouter;
export const Meta = mod.Meta;
export const NavLink = mod.NavLink;
export const Navigate = mod.Navigate;
export const NavigationType = mod.NavigationType;
export const Outlet = mod.Outlet;
export const Route = mod.Route;
export const Router = mod.Router;
export const RouterProvider = mod.RouterProvider;
export const Routes = mod.Routes;
export const ScrollRestoration = mod.ScrollRestoration;

export const createBrowserRouter = mod.createBrowserRouter;
export const createHashRouter = mod.createHashRouter;
export const createMemoryRouter = mod.createMemoryRouter;
export const createRoutesFromChildren = mod.createRoutesFromChildren;
export const createRoutesFromElements = mod.createRoutesFromElements;
export const createSearchParams = mod.createSearchParams;
export const generatePath = mod.generatePath;
export const matchPath = mod.matchPath;
export const matchRoutes = mod.matchRoutes;
export const renderMatches = mod.renderMatches;
export const resolvePath = mod.resolvePath;

export const useActionData = mod.useActionData;
export const useAsyncError = mod.useAsyncError;
export const useAsyncValue = mod.useAsyncValue;
export const useBlocker = mod.useBlocker;
export const useHref = mod.useHref;
export const useInRouterContext = mod.useInRouterContext;
export const useLoaderData = mod.useLoaderData;
export const useLocation = mod.useLocation;
export const useMatch = mod.useMatch;
export const useMatches = mod.useMatches;
export const useNavigate = mod.useNavigate;
export const useNavigation = mod.useNavigation;
export const useNavigationType = mod.useNavigationType;
export const useOutlet = mod.useOutlet;
export const useOutletContext = mod.useOutletContext;
export const useParams = mod.useParams;
export const useResolvedPath = mod.useResolvedPath;
export const useRevalidator = mod.useRevalidator;
export const useRouteError = mod.useRouteError;
export const useRouteLoaderData = mod.useRouteLoaderData;
export const useRoutes = mod.useRoutes;
export const useSearchParams = mod.useSearchParams;

export default mod;
