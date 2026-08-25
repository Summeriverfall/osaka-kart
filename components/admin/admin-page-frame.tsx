type AdminPageFrameProps = {
  title: string;
  lead?: string;
  children: React.ReactNode;
};

export function AdminPageFrame({ title, lead, children }: AdminPageFrameProps) {
  return (
    <div className="admin-page fade-in min-w-0 max-w-full space-y-6">
      <div className="min-w-0">
        <h1 className="text-xl font-black tracking-tight break-words text-slate-900 sm:text-2xl">{title}</h1>
        {lead ? <p className="mt-2 max-w-3xl text-sm leading-6 break-words text-slate-500">{lead}</p> : null}
      </div>
      {children}
    </div>
  );
}
