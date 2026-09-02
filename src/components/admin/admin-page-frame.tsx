type AdminPageFrameProps = {
  title: string;
  lead?: string;
  children: React.ReactNode;
};

export function AdminPageFrame({ title, lead, children }: AdminPageFrameProps) {
  return (
    <div className="admin-page fade-in min-w-0 max-w-full space-y-6">
      <div className="min-w-0">
        <h1 className="admin-page-title">{title}</h1>
        {lead ? <p className="admin-page-lead">{lead}</p> : null}
      </div>
      {children}
    </div>
  );
}
