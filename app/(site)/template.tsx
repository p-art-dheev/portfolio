// A template (unlike a layout) remounts on every navigation, so each page
// eases in with a short fade (see .page-enter in globals.css). Pure CSS:
// no client JavaScript, and it is skipped for reduced-motion visitors.
export default function SiteTemplate({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="page-enter">{children}</div>;
}
