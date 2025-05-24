# LockedIn Frontend

A complete Farcaster mini-app built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui components. The app allows friends to stake ETH in challenge groups where a winner is selected by the group owner to receive the pooled funds.

## 🏗️ **Architecture Overview**

### **Tech Stack**

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (100% type-safe)
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React hooks (useState, useEffect)
- **Blockchain Integration**: Placeholder functions for wagmi integration
- **MiniKit**: Coinbase's framework for Farcaster mini-apps

### **Project Structure**

```
frontend/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Homepage - group listings & stats
│   ├── groups/[id]/page.tsx     # Group details page
│   ├── layout.tsx               # Root layout with providers
│   ├── providers.tsx            # MiniKit provider setup
│   └── globals.css              # Global styles
├── components/                   # Reusable components
│   ├── ui/                      # shadcn/ui base components
│   ├── AddressAvatar.tsx        # Address identicon display
│   ├── EthDisplay.tsx           # ETH value formatting
│   ├── GroupCard.tsx            # Group summary card
│   ├── GroupList.tsx            # Grid of group cards
│   ├── CreateGroupDialog.tsx    # Create group modal
│   ├── JoinGroupDialog.tsx      # Join group confirmation
│   └── SettleGroupDialog.tsx    # Winner selection modal
├── types/                       # TypeScript definitions
│   └── group.ts                 # Group interface & params
├── lib/                         # Utilities & placeholders
│   ├── contractPlaceholders.ts  # Blockchain interaction stubs
│   └── utils.ts                 # shadcn/ui utilities
└── public/                      # Static assets
```

## 🎯 **Core Features**

### **1. Group Management**

- **Create Groups**: Modal form with name and entry fee validation
- **Join Groups**: Payment confirmation with participant preview
- **Settle Groups**: Owner-only winner selection interface
- **Group Listings**: Responsive grid with search and filtering

### **2. User Interface**

- **Responsive Design**: Mobile-first (360px+) to desktop
- **Dark/Light Mode**: Automatic theme detection
- **Loading States**: Skeleton screens and spinners
- **Error Handling**: User-friendly error messages
- **Accessibility**: ARIA labels and keyboard navigation

### **3. Data Flow**

- **Mock Data**: Realistic sample groups for development
- **State Management**: Local state with React hooks
- **Contract Placeholders**: Ready for wagmi integration
- **Type Safety**: Complete TypeScript coverage

## 📱 **Page Breakdown**

### **Homepage (`/`)**

```typescript
Features:
- Group statistics dashboard (total, active, participants)
- Responsive grid of group cards
- Create group button with modal
- Quick join functionality
- MiniKit integration status
- Loading states and empty states
```

### **Group Details (`/groups/[id]`)**

```typescript
Features:
- Detailed group information
- Prize pool visualization
- Participant list with roles
- Action buttons (Join/Settle)
- Winner announcement for settled groups
- Navigation breadcrumbs
- Mobile-optimized sidebar
```

## 🧩 **Component Details**

### **Core Components**

#### **GroupCard.tsx**

```typescript
Purpose: Displays group summary in grid layout
Props: group, onViewDetails, currentUserAddress
Features:
- Entry fee and total pool display
- Participant avatars (max 3 shown)
- Status badges (Owner, Joined, Settled)
- Winner announcement for settled groups
- Action button (Join/View Details)
```

#### **GroupList.tsx**

```typescript
Purpose: Renders responsive grid of GroupCard components
Props: groups, onViewDetails, currentUserAddress, isLoading
Features:
- Loading skeleton screens
- Empty state messaging
- Responsive grid (1-3 columns)
```

#### **Dialog Components**

#### **CreateGroupDialog.tsx**

```typescript
Purpose: Modal form for creating new groups
Props: open, onClose, onGroupCreated
Features:
- Form validation (name required, fee > 0)
- Loading states during submission
- Error handling and display
- Form reset on success
```

#### **JoinGroupDialog.tsx**

```typescript
Purpose: Payment confirmation for joining groups
Props: open, onClose, group, userAddress, onJoinSuccess
Features:
- Entry fee and pool calculation
- Current participants display
- Warning about locked stakes
- Payment button with ETH amount
```

#### **SettleGroupDialog.tsx**

```typescript
Purpose: Winner selection interface for group owners
Props: open, onClose, group, onSettleSuccess
Features:
- Prize pool visualization
- Clickable participant list
- Owner identification
- Confirmation warnings
- Final settlement action
```

### **Utility Components**

#### **AddressAvatar.tsx**

```typescript
Purpose: Generates identicon-style avatars for addresses
Props: address, size, className
Features:
- Color generation from address hash
- Multiple size options (sm, md, lg)
- Fallback to address characters
- Future ENS avatar support
```

#### **EthDisplay.tsx**

```typescript
Purpose: Consistent ETH value formatting
Props: amount, className, showSymbol
Features:
- Fixed 4 decimal places
- Monospace font for alignment
- Optional ETH symbol
- Responsive text sizing
```

## 🔗 **Data Models**

### **Group Interface**

```typescript
interface Group {
  id: string;                 // UUID or transaction hash
  name: string;               // Human-readable group name
  owner: string;              // Creator's wallet address
  entryFeeEth: string;        // Entry fee as string (e.g. "0.05")
  participants: string[];     // Array of participant addresses
  settled: boolean;           // Whether group has been settled
  winner?: string;            // Winner's address (if settled)
  createdAt: string;          // ISO timestamp
}
```

### **Action Parameters**

```typescript
interface CreateGroupParams {
  name: string;
  entryFeeEth: string;
}

interface JoinGroupParams {
  groupId: string;
  userAddress: string;
}

interface SettleGroupParams {
  groupId: string;
  winnerAddress: string;
}
```

## 🔌 **Contract Integration**

### **Placeholder Functions** (`lib/contractPlaceholders.ts`)

```typescript
// Ready for wagmi integration - replace with actual hooks
createGroupOnChain(params)     // Create new group contract
joinGroupOnChain(params)       // Transfer entry fee and join
settleGroupOnChain(params)     // Select winner and distribute funds
fetchGroupsFromChain()         // Read all groups from contract
fetchGroupById(id)             // Read specific group data
```

### **Integration Checklist**

- [ ] Replace mock data with contract reads
- [ ] Implement wagmi write hooks for transactions
- [ ] Add wallet connection UI
- [ ] Handle transaction confirmations
- [ ] Add gas estimation
- [ ] Implement error handling for failed transactions

**Built with ❤️ for ETH Dublin 2025**
