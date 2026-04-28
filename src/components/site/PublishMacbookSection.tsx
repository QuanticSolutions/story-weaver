import { MacbookScroll } from "@/components/ui/macbook-scroll";

const portal = (
  <div className="flex h-full w-full flex-col bg-[#0B1F4B] text-white">
    <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
      <span
        className="text-xs font-semibold tracking-wide"
        style={{ fontFamily: '"Montserrat", sans-serif' }}
      >
        American Writers Hub Portal
      </span>
      <div className="flex gap-1">
        <span className="size-2 rounded-full bg-red-500" />
        <span className="size-2 rounded-full bg-yellow-500" />
        <span className="size-2 rounded-full bg-green-500" />
      </div>
    </div>
    <div className="flex flex-1 flex-col gap-3 p-5">
      <p
        className="text-[10px] uppercase tracking-[0.2em] text-white/50"
        style={{ fontFamily: '"Montserrat", sans-serif' }}
      >
        Project Status
      </p>
      <div className="space-y-2">
        <div className="flex items-center justify-between rounded-md bg-white/5 px-3 py-2">
          <span className="text-xs">Ghostwriting</span>
          <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-semibold text-green-300">
            Completed
          </span>
        </div>
        <div className="flex items-center justify-between rounded-md bg-white/5 px-3 py-2">
          <span className="text-xs">Cover Design</span>
          <span className="rounded-full bg-yellow-500/20 px-2 py-0.5 text-[10px] font-semibold text-yellow-300">
            In Progress
          </span>
        </div>
        <div className="flex items-center justify-between rounded-md bg-white/5 px-3 py-2">
          <span className="text-xs">Publishing</span>
          <span className="rounded-full bg-gray-500/30 px-2 py-0.5 text-[10px] font-semibold text-gray-300">
            Not Started
          </span>
        </div>
      </div>
      <div className="mt-auto">
        <div className="mb-1 flex justify-between text-[10px] text-white/60">
          <span>Overall Progress</span>
          <span>60%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-[60%] rounded-full bg-[#8B1A2B]" />
        </div>
      </div>
    </div>
  </div>
);

export function PublishMacbookSection() {
  return (
    <section className="bg-white">
      <MacbookScroll
        title={<span className="text-navy">Your Dashboard. Your Book Journey.</span>}
        screenContent={portal}
        showGradient={false}
      />
    </section>
  );
}
