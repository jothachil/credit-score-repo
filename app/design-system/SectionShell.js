import NavBar from "../components/NavBar";

// Shared chrome for a design-system detail page: top nav bar + content.
export default function SectionShell({ title, description, children }) {
  return (
    <>
      <NavBar title={title} backHref="/design-system" />
      <div className="flex flex-1 flex-col gap-6 px-5 py-6">
        {description && (
          <p className="text-xs text-content-secondary">{description}</p>
        )}
        {children}
      </div>
    </>
  );
}
