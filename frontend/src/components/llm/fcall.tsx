import { Badge } from "@/components/ui/badge";

interface FunctionCallBadgeProps {
  name: string;
  args: Record<string, any>;
}

export default function FunctionCallBadge({
  name,
  args,
}: FunctionCallBadgeProps) {
  let parsedArgs: Record<string, any> = {};

  try {
    //@ts-ignore
    parsedArgs = JSON.parse(args);
  } catch (error) {
    console.error("Failed to parse args:", error);
  }
  return (
    <Badge
      className="inline-flex items-center px-3 py-1 rounded-md  text-sm font-medium"
      variant="secondary"
    >
      <FunctionSquareIcon className="h-4 w-4 mr-2 shrink-0" />
      <span>{name}</span>
      {Object.entries(parsedArgs).map(([key, value]) => (
        <span
          key={key}
          className="ml-2 px-2 py-0.5 rounded-md bg-accent text-xs font-semibold text-accent-foreground"
        >
          {key}: {JSON.stringify(value)}
        </span>
      ))}
    </Badge>
  );
}

function FunctionSquareIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <path d="M9 17c2 0 2.8-1 2.8-2.8V10c0-2 1-3.3 3.2-3" />
      <path d="M9 11.2h5.7" />
    </svg>
  );
}
