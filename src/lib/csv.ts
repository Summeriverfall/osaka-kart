export function downloadCsv(filename: string, rows: Array<Array<string | number>>) {
  const body = rows
    .map((row) =>
      row
        .map((cell) => {
          const value = String(cell ?? "");
          if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
          return value;
        })
        .join(","),
    )
    .join("\n");
  const blob = new Blob([`\uFEFF${body}`], { type: "text/csv;charset=utf-8;" });
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(href);
}
