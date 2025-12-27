import { Construction } from "lucide-react";
import { Link } from "react-router-dom";

interface ComingSoonProps {
  title: string;
}

export function ComingSoon({ title }: ComingSoonProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
      <div className="mb-6 rounded-full bg-slate-800 p-6">
        <Construction size={48} className="text-slate-500" />
      </div>
      <h2 className="text-2xl font-bold text-slate-200">{title}</h2>
      <p className="mt-2 max-w-md text-slate-400">
        This feature is under development and will be available soon.
      </p>
      <Link
        to="/"
        className="btn-primary mt-6"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}

export default ComingSoon;
