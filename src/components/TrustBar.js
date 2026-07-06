
export function TrustBar() {
  return (
    <div className="bg-white border-y border-gray-100 py-8 font-sans antialiased mt-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
          <span className="text-xl">🧵</span>
          <div>
            <h4 className="text-xs font-black uppercase text-slate-950 tracking-wider">Premium Fabrics</h4>
            <p className="text-[11px] text-gray-400 mt-0.5">High-weight piqué & clean textures</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
          <span className="text-xl">📦</span>
          <div>
            <h4 className="text-xs font-black uppercase text-slate-950 tracking-wider">Fast Shipping</h4>
            <p className="text-[11px] text-gray-400 mt-0.5">Prompt delivery all over BD</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
          <span className="text-xl">🔄</span>
          <div>
            <h4 className="text-xs font-black uppercase text-slate-950 tracking-wider">Easy Exchange</h4>
            <p className="text-[11px] text-gray-400 mt-0.5">Hassle-free size adjustment claims</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
          <span className="text-xl">🛡️</span>
          <div>
            <h4 className="text-xs font-black uppercase text-slate-950 tracking-wider">Secure Payment</h4>
            <p className="text-[11px] text-gray-400 mt-0.5">Cash on delivery integration available</p>
          </div>
        </div>

      </div>
    </div>
  );
}