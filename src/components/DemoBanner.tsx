import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Badge } from './ui/badge';

export const DemoBanner = () => {
  return (
    <Alert className="w-full mb-6 border-orange-200 bg-orange-50">
      <AlertTitle className="flex items-center gap-2 mb-2">
        <Badge
          variant="outline"
          className="bg-orange-100 text-orange-800 border-orange-300"
        >
          🚀 Demo
        </Badge>
        <span className="text-sm font-medium text-orange-800">
          Shared Playground
        </span>
      </AlertTitle>
      <AlertDescription className="text-left text-orange-700">
        This is a public demo with a shared database. Please be respectful: no
        inappropriate content, spam, or personal information. Todos are
        automatically cleaned up after 7 days.
      </AlertDescription>
    </Alert>
  );
};
