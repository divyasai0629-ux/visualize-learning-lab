interface Props {
  tc: string;
  sc: string;
}

const ComplexityInfo = ({ tc, sc }: Props) => (
  <div className="flex gap-4 mb-6">
    <div className="px-4 py-2 rounded-lg bg-secondary border border-border">
      <span className="text-xs text-muted-foreground">Time Complexity</span>
      <p className="font-mono font-semibold text-primary">{tc}</p>
    </div>
    <div className="px-4 py-2 rounded-lg bg-secondary border border-border">
      <span className="text-xs text-muted-foreground">Space Complexity</span>
      <p className="font-mono font-semibold text-primary">{sc}</p>
    </div>
  </div>
);

export default ComplexityInfo;
