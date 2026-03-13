export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-8 px-4">
      <div className="container max-w-3xl mx-auto text-center text-sm text-muted-foreground space-y-2">
        <p>Analytics and risk signals only, not financial advice. No auto‑trading.</p>
        <p>© {new Date().getFullYear()} ClearSignal. All rights reserved.</p>
      </div>
    </footer>
  );
}
