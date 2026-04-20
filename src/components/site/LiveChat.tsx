import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";

export function LiveChat() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-3 w-[320px] overflow-hidden rounded-2xl border border-navy/20 bg-white shadow-2xl shadow-navy/20"
          >
            <div className="flex items-center justify-between bg-navy px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <MessageCircle className="size-4 text-brand-red" />
                <span className="text-sm font-semibold">Live Chat</span>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close chat">
                <X className="size-4" />
              </button>
            </div>
            <div className="p-4">
              {sent ? (
                <p className="py-6 text-center text-sm text-navy">
                  Thanks! A consultant will reach out shortly.
                </p>
              ) : (
                <>
                  <p className="mb-3 text-xs leading-relaxed text-navy/75">
                    A publishing consultant will join this chat shortly. Please leave your details.
                  </p>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSent(true);
                    }}
                    className="space-y-2"
                  >
                    <input
                      required
                      placeholder="Name"
                      className="w-full rounded-md border border-navy/15 px-3 py-2 text-sm focus:border-brand-red focus:outline-none"
                    />
                    <input
                      required
                      type="email"
                      placeholder="Email"
                      className="w-full rounded-md border border-navy/15 px-3 py-2 text-sm focus:border-brand-red focus:outline-none"
                    />
                    <input
                      required
                      placeholder="Phone"
                      className="w-full rounded-md border border-navy/15 px-3 py-2 text-sm focus:border-brand-red focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-red py-2 text-sm font-semibold text-white hover:bg-brand-red-dark"
                    >
                      <Send className="size-4" /> Send
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((v) => !v)}
        aria-label="Open live chat"
        className="flex size-14 items-center justify-center rounded-full bg-brand-red text-white shadow-xl shadow-brand-red/40"
      >
        <MessageCircle className="size-6" />
      </motion.button>
    </div>
  );
}
