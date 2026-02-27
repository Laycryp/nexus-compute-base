'use client';

import { useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { NEXUS_COMPUTE_ADDRESS, NEXUS_COMPUTE_ABI } from '@/lib/contracts';

export function ProviderDashboard() {
  const { address, isConnected } = useAccount();

  // قراءة حالة المزود من العقد الذكي
  const { data: providerData, refetch } = useReadContract({
    address: NEXUS_COMPUTE_ADDRESS,
    abi: NEXUS_COMPUTE_ABI,
    functionName: 'providers',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    }
  });

  const isActive = providerData ? providerData[1] : false;
  const tasksCompleted = providerData ? Number(providerData[2]) : 0;

  // إعداد دالة الكتابة على العقد (للتسجيل)
  const { data: hash, isPending, writeContract } = useWriteContract();

  const handleRegister = () => {
    writeContract({
      address: NEXUS_COMPUTE_ADDRESS,
      abi: NEXUS_COMPUTE_ABI,
      functionName: 'registerProvider',
    });
  };

  // متابعة حالة المعاملة في البلوكتشين
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // تحديث البيانات تلقائياً عند نجاح المعاملة
  useEffect(() => {
    if (isConfirmed) {
      refetch();
    }
  }, [isConfirmed, refetch]);

  // إخفاء اللوحة إذا لم تكن المحفظة متصلة
  if (!isConnected) {
    return null; 
  }

  return (
    <div className="w-full max-w-xl mx-auto mt-12 p-6 bg-gray-900/80 border border-blue-500/30 rounded-2xl shadow-[0_0_15px_rgba(59,130,246,0.15)] backdrop-blur-md">
      <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-800 pb-4">Provider Node Status</h2>
      
      {isActive ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-green-500/20">
            <span className="text-gray-400">Node Status</span>
            <span className="text-green-400 font-mono font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              ACTIVE
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <span className="text-gray-400">Tasks Completed</span>
            <span className="text-blue-400 font-mono font-semibold">{tasksCompleted}</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 space-y-4">
          <p className="text-gray-400 text-center">Your wallet is not registered as a GPU provider on the Nexus network.</p>
          <button
            onClick={handleRegister}
            disabled={isPending || isConfirming}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(59,130,246,0.4)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)]"
          >
            {isPending ? 'Confirming in Wallet...' : isConfirming ? 'Registering on Base...' : 'Initialize Provider Node'}
          </button>
        </div>
      )}
    </div>
  );
}