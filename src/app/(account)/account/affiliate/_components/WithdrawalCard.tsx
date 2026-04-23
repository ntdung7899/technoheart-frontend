import { useState, useEffect } from "react";
import { Wallet, ArrowRightLeft, Loader2, AlertCircle, X, CreditCard, CheckCircle2, PlusCircle, Info } from "lucide-react";
import { PV_RATE } from "./constants"; 

interface WithdrawalCardProps {
    balance: number;
    loading: boolean;
    onWithdraw: (amount: number, bankName: string, accountNumber: string, accountName: string) => Promise<void>;
    lastBankInfo?: {
        bankName: string;
        accountNumber: string;
        accountName: string;
    };
}

export function WithdrawalCard({ balance, loading, onWithdraw, lastBankInfo }: WithdrawalCardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [amount, setAmount] = useState<string>("");
    
    const [useSavedBank, setUseSavedBank] = useState<boolean>(!!lastBankInfo);

    const [bankName, setBankName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountName, setAccountName] = useState("");

    useEffect(() => {
        if (isOpen) {
            setUseSavedBank(!!lastBankInfo);
            setAmount("");
        }
    }, [isOpen, lastBankInfo]);

    const handleAction = async () => {
        const numAmount = Number(amount);
        
        if (useSavedBank && lastBankInfo) {
            await onWithdraw(numAmount, lastBankInfo.bankName, lastBankInfo.accountNumber, lastBankInfo.accountName);
            setIsOpen(false);
            return;
        }

        if (numAmount > 0 && bankName && accountNumber && accountName) {
            await onWithdraw(numAmount, bankName, accountNumber, accountName.toUpperCase());
            setIsOpen(false);
            setBankName("");
            setAccountNumber("");
            setAccountName("");
        }
    };

    const isOverBalance = Number(amount) > balance;
    
    const isFormValid = useSavedBank 
        ? amount && !isOverBalance && lastBankInfo 
        : amount && !isOverBalance && bankName && accountNumber && accountName;

    return (
        <>
            <div className="bg-white dark:bg-zinc-950 border rounded-xl overflow-hidden shadow-sm p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl">
                        <Wallet className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-muted-foreground text-sm">Số dư khả dụng</h2>
                        <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-bold text-foreground">{balance.toLocaleString()} PV</p>
                            <p className="text-sm text-muted-foreground font-medium">≈ {(balance * PV_RATE).toLocaleString("vi-VN")} VNĐ</p>
                        </div>
                    </div>
                </div>
                
                <button
                    onClick={() => setIsOpen(true)}
                    className="h-10 px-4 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-all"
                >
                    Rút tiền
                </button>
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-background w-full max-w-md rounded-2xl shadow-xl overflow-hidden border">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="font-bold text-lg">Yêu cầu rút tiền</h3>
                            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-muted rounded-full">
                                <X className="h-5 w-5 text-muted-foreground" />
                            </button>
                        </div>

                        <div className="p-5 space-y-4">
                            <div className="flex gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 rounded-lg text-xs leading-relaxed">
                                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                                <p>Số dư khả dụng này là số tiền thực nhận <strong>sau khi đã khấu trừ 10% Thuế TNCN</strong> từ tổng hoa hồng của bạn.</p>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Số PV cần rút <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="Nhập số PV..."
                                        className={`w-full pl-3 pr-20 py-2.5 bg-background border rounded-lg outline-none focus:ring-2 transition-all ${
                                            isOverBalance ? "border-red-500 focus:ring-red-200" : "focus:ring-primary/20 border-input"
                                        }`}
                                    />
                                    {balance > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => setAmount(balance.toString())}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-primary bg-primary/10 hover:bg-primary/20 px-2.5 py-1.5 rounded-md transition-colors"
                                        >
                                            Tối đa
                                        </button>
                                    )}
                                </div>
                                <div className="flex justify-between items-center text-xs mt-1">
                                    <span className="text-muted-foreground">
                                        Khả dụng: <span className="font-bold text-primary">{balance.toLocaleString()} PV</span>
                                    </span>
                                    {amount && !isOverBalance && (
                                        <span className="font-medium text-blue-600 dark:text-blue-400">
                                            + {(Number(amount) * PV_RATE).toLocaleString("vi-VN")} VNĐ
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="h-px bg-border my-2"></div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium">Tài khoản nhận tiền</label>
                                
                                {lastBankInfo && (
                                    <div 
                                        onClick={() => setUseSavedBank(true)}
                                        className={`p-3 border rounded-lg cursor-pointer transition-all flex items-start gap-3 ${
                                            useSavedBank ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:bg-muted/50"
                                        }`}
                                    >
                                        <CreditCard className={`h-5 w-5 mt-0.5 ${useSavedBank ? "text-primary" : "text-muted-foreground"}`} />
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm">{lastBankInfo.bankName}</p>
                                            <p className="text-sm font-mono mt-0.5">{lastBankInfo.accountNumber}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5 uppercase">{lastBankInfo.accountName}</p>
                                        </div>
                                        {useSavedBank && <CheckCircle2 className="h-5 w-5 text-primary" />}
                                    </div>
                                )}

                                <div 
                                    onClick={() => setUseSavedBank(false)}
                                    className={`p-3 border rounded-lg cursor-pointer transition-all flex items-center gap-3 ${
                                        !useSavedBank ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:bg-muted/50"
                                    }`}
                                >
                                    <PlusCircle className={`h-5 w-5 ${!useSavedBank ? "text-primary" : "text-muted-foreground"}`} />
                                    <p className="font-medium text-sm">Rút về tài khoản ngân hàng khác</p>
                                    {!useSavedBank && <CheckCircle2 className="h-5 w-5 text-primary ml-auto" />}
                                </div>

                                {!useSavedBank && (
                                    <div className="space-y-3">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium">Ngân hàng thụ hưởng <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                value={bankName}
                                                onChange={(e) => setBankName(e.target.value)}
                                                placeholder="Ví dụ: Vietcombank, MB Bank..."
                                                className="w-full px-3 py-2.5 bg-background border border-input rounded-lg outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-medium">Số tài khoản <span className="text-red-500">*</span></label>
                                                <input
                                                    type="text"
                                                    value={accountNumber}
                                                    onChange={(e) => setAccountNumber(e.target.value)}
                                                    placeholder="Nhập STK..."
                                                    className="w-full px-3 py-2.5 bg-background border border-input rounded-lg outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-medium">Tên chủ tài khoản <span className="text-red-500">*</span></label>
                                                <input
                                                    type="text"
                                                    value={accountName}
                                                    onChange={(e) => setAccountName(e.target.value)}
                                                    placeholder="NGUYEN VAN A"
                                                    className="w-full px-3 py-2.5 bg-background border border-input rounded-lg outline-none focus:ring-2 focus:ring-primary/20 transition-all uppercase"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {isOverBalance && (
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                                    <AlertCircle className="h-4 w-4 shrink-0" /> Số PV vượt quá số dư khả dụng!
                                </div>
                            )}

                            <button
                                onClick={handleAction}
                                disabled={loading || !isFormValid}
                                className="w-full mt-4 h-11 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
                            >
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRightLeft className="h-4 w-4" />}
                                Xác nhận rút tiền
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}