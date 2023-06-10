import { Navigate } from "react-router-dom";
import { PrivateLayout } from "../components/layout/private/PrivateLayout";

export const GuardedRoute = ({
	/**
	 * Permission check for route
	 * @default false
	 */
    isRouteAccessible = false,
	/**
	 * Route to be redirected to
	 * @default '/'
	 */
    redirectRoute = '/'
}) => {
	// Aqui se recomienda devolver el Oulet en vez del componente private
    return (isRouteAccessible === true ? 
        <PrivateLayout/>
        : 
        <Navigate to={redirectRoute} replace />
        
    );
}
