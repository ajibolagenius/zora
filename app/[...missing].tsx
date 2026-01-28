/**
 * Catch-all route for unmatched paths
 * This handles 404 errors for any route that doesn't match existing routes
 */
import NotFoundScreen from '../components/errors/NotFoundScreen';

export default function MissingScreen() {
    return (
        <NotFoundScreen
            title="Page Not Found"
            message="The page you're looking for doesn't exist or has been moved."
        />
    );
}
