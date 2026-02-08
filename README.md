# Financial Management System

Modern web application for financial management, allowing you to manage business partners, accounts, and financial transactions with an intuitive interface.

## Features

### Dashboard
- Overview of financial statistics
- Display of the 5 most recent accounts
- Display of the 5 latest transactions
- Real-time statistics on partners and accounts

### Business Partner Management
- Create new business partners
- Edit partner information
- Status management (Active, Inactive, Pending)
- Support for different legal forms (SA, SARL, SNC, Individual)
- Complete address tracking

### Account Management
- Create multi-currency accounts (CHF, EUR, USD, GBP)
- Edit existing accounts
- Associate accounts with business partners
- Real-time balance tracking
- Detailed transaction history per account

### Transaction Management
- Three types of transactions:
    - **Pay In**: Credit an account
    - **Pay Out**: Debit an account
    - **Exchange**: Convert between currencies
- Advanced filtering by account, currency, and type
- Pagination (10 transactions per page)
- Edit non-executed transactions
- Execute outgoing payments
- IBAN validation

## Technologies Used

### Frontend
- **React 18** - UI Library
- **TypeScript** - Static typing
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Navigation
- **Lucide React** - Modern icons

### Backend
- REST API compatible with API Platform
- Supabase support for data persistence

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Backend API running on `http://localhost:8080`
- Docker and Docker Compose (for Docker deployment)

## Installation

### Standard Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd project
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   Create a `.env` file at the project root:
```env
VITE_API_URL=http://localhost:8080
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the application in development mode:
```bash
npm run dev
```

The application will be accessible at `http://localhost:5173`

### Docker Installation

The project includes Docker support for easy deployment.

1. Start the application:
```bash
make up
```

2. View logs:
```bash
make logs
```

3. Access shell:
```bash
make shell
```

4. Stop the application:
```bash
make down
```

5. Complete reset (if needed):
```bash
make reset
```

The `make reset` command performs a complete cleanup by:
- Stopping all containers
- Removing `node_modules`, `package-lock.json`, and `dist`
- Rebuilding the Docker image from scratch
- Starting the application fresh

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Check code quality
- `npm run typecheck` - Check TypeScript types

## Makefile Commands

- `make up` - Start Docker containers in detached mode
- `make down` - Stop and remove Docker containers
- `make logs` - Follow container logs
- `make shell` - Access the frontend container shell
- `make reset` - Complete project reset (removes all dependencies and rebuilds)

## Project Structure

```
project/
├── src/
│   ├── components/          # React components
│   │   ├── Accounts.tsx     # Account management
│   │   ├── BusinessPartners.tsx  # Partner management
│   │   ├── Dashboard.tsx    # Dashboard
│   │   ├── Layout.tsx       # Main layout
│   │   ├── Toast.tsx        # Notifications
│   │   └── Transactions.tsx # Transaction management
│   ├── services/
│   │   └── api.ts          # API service
│   ├── types/
│   │   └── index.ts        # TypeScript definitions
│   ├── App.tsx             # Main component
│   └── main.tsx            # Entry point
├── public/                 # Static files
├── Makefile               # Docker commands
├── docker-compose.yml     # Docker configuration
└── package.json           # Dependencies and scripts
```

## API Endpoints Used

### Business Partners
- `GET /api/business_partners` - List partners
- `POST /api/business_partners` - Create partner
- `PATCH /api/business_partners/{id}` - Update partner

### Accounts
- `GET /api/accounts` - List accounts
- `POST /api/accounts` - Create account
- `PATCH /api/accounts/{id}` - Update account

### Transactions
- `GET /api/transactions` - List transactions
- `POST /api/transactions/payin` - Create incoming payment
- `POST /api/transactions/payout` - Create outgoing payment
- `POST /api/transactions/exchange` - Create currency exchange
- `PATCH /api/transactions/{id}` - Update transaction
- `PATCH /api/transactions/{id}/payout/execute` - Execute outgoing payment

## Detailed Features

### Transaction Filtering
- Filter by specific account
- Filter by currency (CHF, EUR, USD, GBP)
- Filter by transaction type (payin, payout, exchange)
- Quick filter reset

### Pagination
- 10 transactions per page
- Numbered page navigation
- Previous/Next buttons
- Display of total results count

### Editing
- Modify non-executed transactions
- Complete account modification
- Complete business partner modification
- Real-time form validation

### Notifications
- Success confirmations for all actions
- Detailed error messages
- Auto-dismissing toasts after 3 seconds

## Development

### Code Conventions
- Strict TypeScript usage
- Functional components with hooks
- ESLint for code quality
- Prettier for formatting (via ESLint)

### State Management
- useState for component local state
- useEffect for side effects
- No global state management (Redux/Zustand) for now

## Production Build

To create an optimized production build:

```bash
npm run build
```

Compiled files will be in the `dist/` folder.

To test the production build locally:

```bash
npm run preview
```

## Docker Deployment

The project is Docker-ready. The Docker configuration handles:
- Node.js environment setup
- Dependency installation
- Development server with hot reload
- Volume mounting for live code updates

Using the Makefile simplifies Docker operations:
- `make up` for quick start
- `make logs` for debugging
- `make reset` for troubleshooting

## Contributions

Contributions are welcome! Please:
1. Fork the project
2. Create a branch for your feature
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## Support

For any questions or issues, please open an issue on the repository.

## License

This project is licensed under the MIT License.
