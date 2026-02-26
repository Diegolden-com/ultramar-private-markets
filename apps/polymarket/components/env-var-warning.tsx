import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function EnvVarWarning() {
  return (
    <div className="flex items-center gap-4">
      <Badge variant="outline" className="font-normal text-muted-foreground">
        Supabase env vars required
      </Badge>
      <div className="flex gap-2">
        <Button size="sm" variant="ghost" disabled>
          Sign in
        </Button>
        <Button size="sm" disabled>
          Sign up
        </Button>
      </div>
    </div>
  );
}
