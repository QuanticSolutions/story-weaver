import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { FloatingOrbs } from "@/components/site/FloatingOrbs";
import { useCRMAuth } from "@/context/CRMAuthContext";

export const Route = createFileRoute("/crm/login")({
  head: () => ({
    meta: [
      { title: "Sign In — AWH Internal CRM" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: CRMLoginPage,
});

function CRMLoginPage() {
  const navigate = useNavigate();
  const { login, crmUser } = useCRMAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const controls = useAnimationControls();

  useEffect(() => {
    if (crmUser) navigate({ to: "/crm/dashboard" });
  }, [crmUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const u = login(email, password);
    if (u) {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 600));
      await controls.start({ opacity: 0, y: -20, transition: { duration: 0.4 } });
      navigate({ to: "/crm/dashboard" });
    } else {
      setError("Invalid credentials");
      controls.start({ x: [0, -10, 10, -8, 8, -4, 4, 0], transition: { duration: 0.5 } });
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0B1F4B] px-4 py-10">
      <FloatingOrbs variant="navy" />

      <div className="relative z-10 w-full max-w-[440px]">
        <div className="mb-8 text-center">
          <div className="font-serif text-4xl font-bold text-white">AWH</div>
          <div className="mt-1 font-accent text-[11px] uppercase tracking-[0.25em] text-brand-red">
            Internal CRM
          </div>
        </div>

        <motion.div animate={controls} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="glass-light rounded-2xl p-8">
          <h1 className="font-serif text-3xl font-bold text-white">Staff Sign In</h1>
          <p className="mt-1.5 text-sm text-white/60">Access your CRM workspace</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="font-accent text-[11px] uppercase tracking-wider text-white/60">Email</label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-[10px] border-[1.5px] border-white/15 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-white/30 focus:border-brand-red focus:outline-none" placeholder="staff@awh.com" />
              </div>
            </div>
            <div>
              <label className="font-accent text-[11px] uppercase tracking-wider text-white/60">Password</label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input type={showPwd ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-[10px] border-[1.5px] border-white/15 bg-white/5 py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-white/30 focus:border-brand-red focus:outline-none" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-md border border-brand-red/40 bg-brand-red/10 px-3 py-2 text-xs text-white">{error}</div>
            )}

            <button type="submit" disabled={loading} className="btn-uppercase flex w-full items-center justify-center gap-2 rounded-[10px] bg-brand-red py-3 text-sm text-white hover:bg-brand-red-dark disabled:opacity-70">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </motion.div>

        <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4 text-[11px] text-white/60">
          <div className="font-accent uppercase tracking-wider text-white/80">Demo Credentials</div>
          <div className="mt-2 space-y-1">
            <div><span className="text-white/40">Project Manager:</span> sarah.collins@awh.com / pm2024</div>
            <div><span className="text-white/40">Salesperson:</span> marcus.webb@awh.com / sales2024</div>
            <div><span className="text-white/40">Production:</span> priya.nair@awh.com / prod2024</div>
          </div>
        </div>
      </div>
    </div>
  );
}
