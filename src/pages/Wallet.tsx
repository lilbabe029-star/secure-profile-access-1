import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { useProfiles } from '../contexts/ProfileContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { TIGO_PAYMENT_DETAILS, SUPPORTED_CURRENCIES } from '../lib/constants';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Copy,
  CreditCard,
  History,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

const WalletPage: React.FC = () => {
  const { user } = useAuth();
  const { format, currentCurrency, currencySymbol } = useCurrency();
  const { addDeposit, transactions, deposits } = useProfiles();
  const [amount, setAmount] = React.useState('');
  const [refId, setRefId] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!amount || !refId) {
      toast.error('Please fill in all fields');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Invalid amount');
      return;
    }

    const selectedCurrency = SUPPORTED_CURRENCIES.find(c => c.code === currentCurrency);
    const usdAmount = numAmount / (selectedCurrency?.rate || 1);

    setIsSubmitting(true);
    
    setTimeout(() => {
      addDeposit({
        userId: user.id,
        userEmail: user.email,
        amount: usdAmount,
        localAmount: numAmount,
        localCurrency: currentCurrency,
        transactionRef: refId
      });
      
      toast.success('Deposit request submitted! Waiting for admin approval.');
      setAmount('');
      setRefId('');
      setIsSubmitting(false);
    }, 1000);
  };

  const copyNumber = () => {
    navigator.clipboard.writeText(TIGO_PAYMENT_DETAILS.number);
    toast.success('Number copied to clipboard');
  };

  const userDeposits = deposits.filter(d => d.userId === user?.id);
  const userTransactions = transactions.filter(t => t.userId === user?.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold mb-2">My Wallet</h1>
      <p className="text-muted-foreground mb-10">Manage your balance and view transaction history.</p>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-slate-900 text-white border-none overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Wallet size={120} />
            </div>
            <CardHeader>
              <CardDescription className="text-slate-400 font-medium">Available Balance</CardDescription>
              <CardTitle className="text-5xl font-black mt-1">
                {format(user?.balance || 0)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Info className="w-4 h-4" />
                <span>Base Currency: {user?.currency}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Deposit Funds
              </CardTitle>
              <CardDescription>Follow the instructions to fund your wallet.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-muted rounded-xl border border-primary/10 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Network</span>
                  <span className="font-bold text-primary">{TIGO_PAYMENT_DETAILS.network}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Payment Number</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono">{TIGO_PAYMENT_DETAILS.number}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyNumber}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>

              <form onSubmit={handleDeposit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount Sent ({currencySymbol})</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">
                      {currencySymbol}
                    </span>
                    <Input 
                      id="amount" 
                      type="number" 
                      placeholder="0.00" 
                      className="pl-8"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Approx. ${amount ? (parseFloat(amount) / (SUPPORTED_CURRENCIES.find(c => c.code === currentCurrency)?.rate || 1)).toFixed(2) : '0.00'} USD
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ref">Transaction Reference ID</Label>
                  <Input 
                    id="ref" 
                    placeholder="Enter ID from SMS" 
                    value={refId}
                    onChange={(e) => setRefId(e.target.value)}
                    required
                  />
                </div>
                <Button className="w-full font-bold h-12" disabled={isSubmitting}>
                  {isSubmitting ? 'Processing...' : 'Submit Deposit Proof'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Pending Deposits
                </CardTitle>
                <CardDescription>Your recently submitted proof of payments.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {userDeposits.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground italic text-sm">
                  No deposit history found.
                </div>
              ) : (
                <div className="space-y-4">
                  {userDeposits.map((dep) => (
                    <div key={dep.id} className="flex items-center justify-between p-4 border rounded-xl bg-card">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          dep.status === 'approved' ? 'bg-green-500/10 text-green-600' : 
                          dep.status === 'rejected' ? 'bg-red-500/10 text-red-600' : 'bg-amber-500/10 text-amber-600'
                        }`}>
                          {dep.status === 'approved' ? <CheckCircle2 className="w-5 h-5" /> : 
                           dep.status === 'rejected' ? <XCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-bold text-sm">
                            Deposit: {dep.localAmount.toLocaleString()} {dep.localCurrency}
                          </p>
                          <p className="text-xs text-muted-foreground">Ref: {dep.transactionRef}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={
                          dep.status === 'approved' ? 'default' : 
                          dep.status === 'rejected' ? 'destructive' : 'secondary'
                        }>
                          {dep.status.toUpperCase()}
                        </Badge>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {new Date(dep.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                Wallet Activity
              </CardTitle>
              <CardDescription>Detailed record of your platform expenditures.</CardDescription>
            </CardHeader>
            <CardContent>
              {userTransactions.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground italic text-sm">
                  No activity yet.
                </div>
              ) : (
                <div className="rounded-xl border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted text-left">
                        <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Type</th>
                        <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Details</th>
                        <th className="p-4 font-bold uppercase tracking-wider text-[10px] text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {userTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-muted/30 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {tx.type === 'deposit' ? (
                                <ArrowDownLeft className="w-4 h-4 text-green-500" />
                              ) : (
                                <ArrowUpRight className="w-4 h-4 text-blue-500" />
                              )}
                              <span className="font-medium capitalize">{tx.type}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="font-medium line-clamp-1">{tx.description}</p>
                            <p className="text-[10px] text-muted-foreground">{new Date(tx.createdAt).toLocaleString()}</p>
                          </td>
                          <td className={`p-4 text-right font-bold ${tx.type === 'deposit' ? 'text-green-600' : 'text-blue-600'}`}>
                            {tx.type === 'deposit' ? '+' : '-'}{format(tx.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;