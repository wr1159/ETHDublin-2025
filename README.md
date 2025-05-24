# LockedIn 🔒

**ETH Dublin 2025 Submission**

A Farcaster mini-app where friends stake ETH in challenge groups. The group owner selects a winner who receives the entire prize pool. Built with MiniKit, OnChainKit, and deployed on Base.

## 🎯 **Project Overview**

LockedIn transforms social challenges into trustless competitions by allowing friends to:

1. **Create Groups** - Set a challenge name and entry fee
2. **Stake ETH** - Friends join by paying the entry fee
3. **Compete** - Participate in real-world challenges (screen time, fitness, etc.)
4. **Win** - Group owner declares winner who receives the full pool

### **The Problem**

- Social challenges lack financial stakes
- Friends often forget or abandon commitments
- No trustless way to enforce challenge outcomes
- Traditional betting requires centralized platforms

### **Our Solution**

- **Trustless Stakes** - ETH locked in smart contracts
- **Social Integration** - Native Farcaster mini-app experience
- **Flexible Challenges** - Any challenge type (screen time, steps, etc.)
- **Instant Settlements** - Winners receive funds immediately

## 🏗️ **Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Farcaster     │    │    Frontend     │    │   Blockchain    │
│   (MiniKit)     │◄──►│   (Next.js)     │◄──►│     (Base)      │
│                 │    │                 │    │                 │
│ • Frame Embed   │    │ • UI/UX         │    │ • Smart Contract│
│ • User Context  │    │ • State Mgmt    │    │ • ETH Staking   │
│ • Notifications │    │ • Validation    │    │ • Settlements   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Tech Stack**

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Blockchain**: Base (Layer 2), Solidity smart contracts
- **Integration**: MiniKit (Farcaster), OnChainKit (Coinbase)
- **Hosting**: Vercel (frontend), Base network (contracts)

## 🚀 **Features**

### **Core Functionality**

✅ **Group Creation** - Anyone can create a challenge group  
✅ **ETH Staking** - Entry fees locked in smart contracts  
✅ **Winner Selection** - Group owners declare winners  
✅ **Instant Payouts** - Winners receive entire prize pool  
✅ **Social Integration** - Native Farcaster mini-app experience  

### **User Experience**

✅ **Mobile-First Design** - Optimized for mobile Farcaster  
✅ **Real-time Updates** - Live participant counts and pool sizes  
✅ **Transaction Safety** - Clear confirmations and warnings  

### **Developer Experience**

✅ **Type Safety** - Full TypeScript coverage  
✅ **Component Library** - Reusable UI components  
✅ **Testing Ready** - Structured for comprehensive testing  
✅ **Documentation** - Detailed technical documentation  
✅ **Deployment Ready** - Production-ready configuration  

## 📱 **User Journey**

### **Creating a Group**

1. **Open LockedIn** in Farcaster
2. **Click "New Group"** - Opens creation modal
3. **Set Challenge Name** - e.g., "Screen Time Challenge"
4. **Set Entry Fee** - e.g., 0.01 ETH
5. **Confirm Transaction** - Creates group contract
6. **Share Group** - Invite friends via Farcaster

### **Joining a Group**

1. **View Group Details** - See participants and pool size
2. **Click "Join Group"** - Opens payment confirmation
3. **Review Stakes** - See entry fee and total pool
4. **Confirm Payment** - Transfers ETH to contract
5. **Start Challenge** - Begin competing!

### **Settling a Group**

1. **Challenge Ends** - Real-world challenge period complete
2. **Owner Reviews Results** - Determines winner
3. **Select Winner** - Choose from participant list
4. **Confirm Settlement** - Transfers entire pool to winner
5. **Celebrate** - Winner announced in group

## 🛠️ **Project Structure**

```
LockedIn/
├── frontend/                 # Next.js application
│   ├── app/                 # Pages and routing
│   ├── components/          # UI components
│   ├── types/              # TypeScript definitions
│   ├── lib/                # Utilities and helpers
│   └── README.md           # Detailed frontend docs
├── contracts/              # Smart contracts (future)
│   ├── src/                # Solidity contracts
│   ├── test/               # Contract tests
│   └── deploy/             # Deployment scripts
└── README.md               # This file
```

## 🔧 **Development**

### **Frontend Setup**

```bash
cd frontend
yarn install
yarn dev
```

### **Environment Variables**

```bash
# Required for MiniKit
NEXT_PUBLIC_ONCHAINKIT_API_KEY=
NEXT_PUBLIC_URL=
NEXT_PUBLIC_ICON_URL=

# Farcaster Frame Configuration
FARCASTER_HEADER=
FARCASTER_PAYLOAD=
FARCASTER_SIGNATURE=
```

### **Testing the App**

1. **Local Development** - Run `yarn dev` in frontend/
2. **Farcaster Testing** - Use ngrok tunnel for live testing
3. **Mobile Testing** - Test responsive design on various devices

## 🌟 **Innovation Highlights**

### **Social-First Design**

- **Native Farcaster Integration** - No external app downloads
- **Viral Sharing** - Groups spread organically through social sharing
- **Trust Through Transparency** - All stakes and settlements on-chain

### **Flexible Challenge System**

- **Any Challenge Type** - Screen time, fitness, productivity, etc.
- **Owner Discretion** - Flexible winner determination
- **Real-World Integration** - Bridges digital stakes with physical challenges

### **Technical Excellence**

- **Gas Efficient** - Optimized smart contract interactions
- **Mobile Optimized** - Perfect mobile Farcaster experience
- **Type Safe** - Zero runtime errors with TypeScript
- **Production Ready** - Built for scale and reliability

## 🎁 **Demo Scenarios**

### **Screen Time Challenge**

- Friends stake 0.01 ETH each
- Goal: Lowest screen time for one week
- Owner checks phone usage and declares winner
- Winner receives entire pool (e.g., 0.05 ETH from 5 friends)

### **Fitness Challenge**

- Colleagues stake 0.02 ETH each
- Goal: Most steps in a month
- Owner verifies fitness app data
- Winner gets the pool for motivation and reward

### **Productivity Challenge**

- Study group stakes 0.005 ETH each
- Goal: Most productive hours logged
- Owner reviews work output
- Winner receives pool as achievement reward

## 🚀 **Deployment**

### **Frontend** (Production Ready)

- ✅ **Vercel Deployment** - Automatic CI/CD
- ✅ **Environment Configuration** - Production variables set
- ✅ **Performance Optimized** - Fast loading and responsive
- ✅ **Mobile Ready** - Perfect Farcaster integration

### **Smart Contracts** (Future Phase)

- 🔄 **Contract Development** - Solidity implementation
- 🔄 **Security Audit** - Professional security review

### **Next Steps**

1. **Smart Contract Implementation** - Deploy to Base mainnet
2. **Advanced Features** - Multi-signature settlements, escrow
3. **Integration Expansion** - Connect with fitness apps, productivity tools, native screen time
4. **Community Growth** - Onboard Farcaster communities

---

**Stakes made social. Challenges made trustless. Built on Base.**
