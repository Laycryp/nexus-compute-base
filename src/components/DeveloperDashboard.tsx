'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { NEXUS_COMPUTE_ADDRESS, NEXUS_COMPUTE_ABI } from '@/lib/contracts';

export function DeveloperDashboard() {
  const { isConnected } = useAccount();
  const [modelUri, setModelUri] = useState('');
  const [reward, setReward] = useState('');

  const { data: hash, isPending, writeContract } = useWriteContract();

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modelUri || !reward) return;

    try {
      const valueInWei = parseEther(reward);
      
      writeContract({
        address: NEXUS_COMPUTE_ADDRESS,
        abi: NEXUS_COMPUTE_ABI,
        functionName: 'createTask',
        args: [modelUri],
        value: valueInWei, 
      });
    } catch (error) {
      console.error('Invalid reward amount', error);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // تم الحل هنا: استخدام setTimeout لتجنب التحذير المتزامن
  useEffect(() => {
    if (isConfirmed) {
      const timer = setTimeout(() => {
        setModelUri('');
        setReward('');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isConfirmed]);

  if (!isConnected) return null;

  return (
    <div className="w-full max-w-xl mx-auto mt-8 p-6 bg-gray-900/80 border border-purple-500/30 rounded-2xl shadow-[0_0_15px_rgba(168,85,247,0.15)] backdrop-blur-md">
      <h2 className="text-2xl font-bold text-white mb-2 border-b border-gray-800 pb-4">Deploy AI Task</h2>
      <p className="text-sm text-gray-400 mb-6">Request GPU computation and escrow your reward on Base.</p>
      
      <form onSubmit={handleCreateTask} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Model URI (IPFS / URL)</label>
          <input
            type="text"
            value={modelUri}
            onChange={(e) => setModelUri(e.target.value)}
            placeholder="ipfs://..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Reward (ETH)</label>
          <input
            type="number"
            step="0.0001"
            min="0"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
            placeholder="0.01"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isPending || isConfirming || !modelUri || !reward}
          className="w-full mt-4 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(168,85,247,0.4)] hover:shadow-[0_0_20px_rgba(168,85,247,0.6)]"
        >
          {isPending ? 'Confirming in Wallet...' : isConfirming ? 'Escrowing Funds...' : 'Submit Task & Escrow'}
        </button>
      </form>

      {isConfirmed && (
        <div className="mt-4 p-3 bg-green-900/30 border border-green-500/50 rounded-lg text-green-400 text-sm text-center">
          Task successfully deployed to the Nexus network!
        </div>
      )}
    </div>
  );
}