import { site } from "@/lib/data";
import { Container } from "@/components/Container";

export function Footer() {
  return (
    <footer className="border-border/80 mt-auto border-t">
      <Container className="text-muted-foreground flex flex-col gap-2 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name}. Built for {site.domain}.
        </p>
      </Container>
    </footer>
  );
}
