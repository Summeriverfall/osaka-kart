type AdminPageFrameProps = {
  title: string;
  lead?: string;
  children: React.ReactNode;
};

export function AdminPageFrame({ title, lead, children }: AdminPageFrameProps) {
  return (
    <div className="admin-page fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900">{title}</h1>
        {lead ? <p className="mt-2 text-sm text-slate-500">{lead}</p> : null}
      </div>
      {children}
    </div>
  );
}
