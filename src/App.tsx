
import { CreatePoolForm } from './components/CreatePoolForm';
import { WalletContextProvider } from './components/WalletContextProvider';

function App() {
  return (
    <WalletContextProvider>
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-8">Raydium AMM Pool Creator</h1>
        <CreatePoolForm />
      </main>
    </WalletContextProvider>

  )
}
export default App