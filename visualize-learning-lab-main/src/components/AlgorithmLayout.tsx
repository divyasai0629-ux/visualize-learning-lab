import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";

interface Props {
  title: string;
  description: string;
  children: ReactNode;
}

const AlgorithmLayout = ({ title, description, children }: Props) => (
  <div className="min-h-screen bg-background">
    <header className="border-b border-border px-6 py-4">
      <div className="mx-auto max-w-5xl flex items-center gap-4">
        <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </header>
    <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
  </div>
);

export default AlgorithmLayout;
