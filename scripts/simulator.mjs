import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';
import dotenv from 'dotenv';

// تحميل المتغيرات البيئية
dotenv.config({ path: '.env.local' });

const privateKey = process.env.PROVIDER_PRIVATE_KEY;
if (!privateKey) {
  console.error('❌ Error: PROVIDER_PRIVATE_KEY is missing in .env.local');
  process.exit(1);
}

const account = privateKeyToAccount(privateKey);
const publicClient = createPublicClient({ chain: baseSepolia, transport: http() });
const walletClient = createWalletClient({ account, chain: baseSepolia, transport: http() });

const CONTRACT_ADDRESS = '0x38E8e242Ea91F6896BE56675a60ec8199DE48B88';

// ABI مخصص للقراءة والكتابة
const ABI = [
  {
    "inputs": [], "name": "nextTaskId", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view", "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "tasks",
    "outputs": [
      { "internalType": "uint256", "name": "id", "type": "uint256" },
      { "internalType": "address", "name": "developer", "type": "address" },
      { "internalType": "address", "name": "provider", "type": "address" },
      { "internalType": "uint256", "name": "reward", "type": "uint256" },
      { "internalType": "string", "name": "modelUri", "type": "string" },
      { "internalType": "string", "name": "resultUri", "type": "string" },
      { "internalType": "bool", "name": "isCompleted", "type": "bool" }
    ],
    "stateMutability": "view", "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_taskId", "type": "uint256" },
      { "internalType": "string", "name": "_resultUri", "type": "string" }
    ],
    "name": "completeTask", "outputs": [], "stateMutability": "nonpayable", "type": "function"
  }
];

console.log(`\n🚀 Nexus Compute Provider Node Simulator Started...`);
console.log(`🟢 Actively polling Base Sepolia for tasks every 5 seconds...`);
console.log(`🔗 Provider Wallet: ${account.address}\n`);

let lastProcessedTaskId = -1;

async function checkTasks() {
  try {
    // 1. قراءة إجمالي المهام من العقد
    const nextTaskIdStr = await publicClient.readContract({
      address: CONTRACT_ADDRESS, abi: ABI, functionName: 'nextTaskId'
    });
    const currentTaskCount = Number(nextTaskIdStr);

    // 2. التحقق من وجود مهمة جديدة لم نعالجها
    if (currentTaskCount > 0 && lastProcessedTaskId < currentTaskCount - 1) {
      const taskIdToProcess = lastProcessedTaskId === -1 ? currentTaskCount - 1 : lastProcessedTaskId + 1;
      
      // جلب تفاصيل المهمة
      const task = await publicClient.readContract({
        address: CONTRACT_ADDRESS, abi: ABI, functionName: 'tasks', args: [BigInt(taskIdToProcess)]
      });

      const isCompleted = task[6];
      const reward = task[3];
      const developer = task[1];

      // إذا لم تكن مكتملة، نبدأ المعالجة
      if (!isCompleted) {
         console.log(`\n🔔 [NEW TASK DETECTED] Task ID: ${taskIdToProcess}`);
         console.log(`👤 Developer: ${developer}`);
         console.log(`💰 Reward Escrowed: ${reward} wei`);
         console.log(`⚙️ Downloading model and initializing GPU computation (10s)...`);

         lastProcessedTaskId = taskIdToProcess; // تحديث المؤشر لمنع التكرار

         // محاكاة المعالجة لمدة 10 ثواني
         setTimeout(async () => {
            try {
              console.log(`✅ Computation complete for Task ID: ${taskIdToProcess}. Uploading results...`);
              const dummyResultUri = `ipfs://nexus-result-hash-${taskIdToProcess}-${Date.now()}`;
              
              const { request } = await publicClient.simulateContract({
                account, address: CONTRACT_ADDRESS, abi: ABI, functionName: 'completeTask',
                args: [BigInt(taskIdToProcess), dummyResultUri]
              });

              const hash = await walletClient.writeContract(request);
              console.log(`💸 Claiming reward... Transaction Hash: ${hash}`);
              
              const receipt = await publicClient.waitForTransactionReceipt({ hash });
              console.log(`🎉 Success! Reward claimed. Node is ready for the next task...\n`);

            } catch (err) {
               console.error(`❌ Failed to complete task: ${err.shortMessage || err.message}`);
               lastProcessedTaskId = taskIdToProcess - 1; // التراجع في حال الفشل للمحاولة مجدداً
            }
         }, 10000);
      } else {
         lastProcessedTaskId = taskIdToProcess; // تخطي المهمة المكتملة
      }
    }
  } catch (error) {
     // نتجاهل أخطاء الشبكة المؤقتة ليبدأ الفحص التالي بصمت
  }
}

// الفحص كل 5 ثواني
setInterval(checkTasks, 5000);
// فحص فوري عند التشغيل
checkTasks();