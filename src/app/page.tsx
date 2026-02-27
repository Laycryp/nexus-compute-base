import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ProviderDashboard } from '@/components/ProviderDashboard';
import { DeveloperDashboard } from '@/components/DeveloperDashboard';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 flex flex-col items-center py-12 px-4 relative overflow-hidden">
      {/* تأثيرات الإضاءة في الخلفية (Neon Glow) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* قسم الترويسة والاتصال */}
      <div className="z-10 flex flex-col items-center text-center space-y-6 w-full max-w-4xl mb-12">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Nexus Compute
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 font-light">
          Decentralized AI Power, Scaled on Base
        </p>

        <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm shadow-2xl flex flex-col items-center space-y-4">
          <p className="text-gray-300 text-sm text-center">
            Connect your wallet to provide GPU power or run AI models on our scalable DePIN layer.
          </p>
          <ConnectButton 
            accountStatus="avatar"
            chainStatus="icon"
            showBalance={false}
          />
        </div>
      </div>

      {/* قسم اللوحات (يظهر فقط عند الاتصال عبر المكونات نفسها) */}
      <div className="z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
        <ProviderDashboard />
        <DeveloperDashboard />
      </div>
    </main>
  );
}