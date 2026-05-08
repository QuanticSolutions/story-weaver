import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { FloatingOrbs } from "@/components/site/FloatingOrbs";
import { usePortalAuth } from "@/context/PortalAuthContext";

export const Route = createFileRoute("/portal/login")({
  head: () => ({
    meta: [
      { title: "Sign In — AWH Client Portal" },
      { name: "description", content: "Sign in to track your publishing journey." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: LoginPage,
});

const VALID_EMAIL = "james.harrington@email.com";
const VALID_PASSWORD = "AWH-2024-0047";

function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoggedIn } = usePortalAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const controls = useAnimationControls();

  useEffect(() => {
    if (isLoggedIn) navigate({ to: "/portal/dashboard" });
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const ok = await login(email.trim(), password);
    setLoading(false);
    if (ok) {
      await controls.start({ opacity: 0, y: -20, transition: { duration: 0.4 } });
      navigate({ to: "/portal/dashboard" });
    } else {
      setError("Invalid email or password");
      controls.start({ x: [0, -10, 10, -8, 8, -4, 4, 0], transition: { duration: 0.5 } });
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0B1F4B] px-4 py-10">
      <FloatingOrbs variant="navy" />

      <div className="relative z-10 w-full max-w-[420px]">
        <div className="mb-8 text-center">
          <div className="font-serif text-4xl font-bold text-white">AWH</div>
          <div className="mt-1 font-accent text-[11px] uppercase tracking-[0.25em] text-white/50">
            Client Portal
          </div>
        </div>

        <motion.div
          animate={controls}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="glass-light rounded-2xl p-8"
        >
          <h1 className="font-serif text-3xl font-bold text-white">Welcome Back</h1>
          <p className="mt-1.5 text-sm text-white/60">
            Sign in to track your publishing journey
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="font-accent text-[11px] uppercase tracking-wider text-white/60">
                Email
              </label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-[10px] border-[1.5px] border-white/15 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-white/30 focus:border-brand-red focus:outline-none"
                  placeholder="you@email.com"
                />
              </div>
            </div>

            <div>
              <label className="font-accent text-[11px] uppercase tracking-wider text-white/60">
                Password
              </label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  type={showPwd ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-[10px] border-[1.5px] border-white/15 bg-white/5 py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-white/30 focus:border-brand-red focus:outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-md border border-brand-red/40 bg-brand-red/10 px-3 py-2 text-xs text-white">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-uppercase flex w-full items-center justify-center gap-2 rounded-[10px] bg-brand-red py-3 text-sm text-white transition-colors hover:bg-brand-red-dark disabled:opacity-70"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <div className="flex items-center justify-center gap-1.5 pt-2 text-xs text-white/50">
              <Mail className="h-3.5 w-3.5" />
              <span>Having trouble? Contact your project manager</span>
            </div>
          </form>
        </motion.div>

        <div className="mt-6 text-center text-[11px] leading-relaxed text-white/40">
          <div className="font-accent uppercase tracking-wider">Demo Credentials</div>
          <div className="mt-1">Email: {VALID_EMAIL}</div>
          <div>Password: {VALID_PASSWORD}</div>
        </div>
      </div>
    </div>
  );
}

// Re-export for usage by guards if needed
export { Route as LoginRoute };

// Helper used by other portal routes via beforeLoad
export function requireAuthGuard(isLoggedIn: boolean) {
  if (!isLoggedIn) {
    throw redirect({ to: "/portal/login" });
  }
}
