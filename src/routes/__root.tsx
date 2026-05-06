import { Outlet, Link, createRootRoute, HeadContent, Scripts, useLocation } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { LiveChat } from "@/components/site/LiveChat";
import { PortalAuthProvider } from "@/context/PortalAuthContext";
import { CRMAuthProvider } from "@/context/CRMAuthContext";
import { CRMProvider } from "@/context/CRMContext";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-offwhite px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-7xl font-bold text-navy">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-navy">Page not found</h2>
        <p className="mt-2 text-sm text-navy/60">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-brand-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-red-dark"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "American Writers Hub — Premium Book Publishing Services" },
      {
        name: "description",
        content:
          "From manuscript to bestseller — ghostwriting, editing, design, formatting, and global distribution on 200+ platforms.",
      },
      { name: "author", content: "American Writers Hub" },
      { property: "og:title", content: "American Writers Hub — Premium Book Publishing" },
      {
        property: "og:description",
        content: "We handle ghostwriting, editing, design, and global distribution.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const location = useLocation();
  const isPortal = location.pathname.startsWith("/portal");
  const isCRM = location.pathname.startsWith("/crm");

  return (
    <CRMAuthProvider>
      <CRMProvider>
        <PortalAuthProvider>
          {isPortal || isCRM ? (
            <Outlet />
          ) : (
            <>
              <Navbar />
              <main className="min-h-screen">
                <Outlet />
              </main>
              <Footer />
              <LiveChat />
            </>
          )}
          <Toaster />
        </PortalAuthProvider>
      </CRMProvider>
    </CRMAuthProvider>
  );
}
