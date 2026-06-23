import { formatRelative, parseISO } from "date-fns";

export function RecentList<T extends { id: string; created_at: string }>(props: {
  items: T[];
  renderItem: (item: T) => JSX.Element;
  title?: string;
}) {
  const { items, renderItem, title } = props;

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      {title ? <p className="text-sm text-muted-foreground">{title}</p> : null}
      <ul className="mt-3 space-y-3">
        {items.length === 0 ? (
          <li className="text-sm text-muted-foreground">No items yet.</li>
        ) : (
          items.map((it) => (
            <li key={it.id} className="flex items-start justify-between">
              <div className="flex-1">{renderItem(it)}</div>
              <div className="ml-4 text-xs text-muted-foreground">
                {formatRelative(parseISO(it.created_at), new Date())}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default RecentList;
