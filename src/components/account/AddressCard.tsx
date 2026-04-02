import { MapPin, Pencil, Trash2, Star } from "lucide-react";

interface AddressCardProps {
    address: {
        id: string;
        label?: string | null;
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
        isDefault: boolean;
    };
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onSetDefault?: (id: string) => void;
}

export function AddressCard({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) {
    return (
        <div
            className={`rounded-2xl border p-5 transition-all ${address.isDefault
                    ? "border-primary/30 bg-primary/5 shadow-sm"
                    : "border-border/40 bg-card/50 hover:shadow-sm"
                }`}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-bold">
                        {address.label || "Địa chỉ"}
                    </span>
                    {address.isDefault && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                            Mặc định
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    {!address.isDefault && onSetDefault && (
                        <button
                            onClick={() => onSetDefault(address.id)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                            title="Đặt mặc định"
                        >
                            <Star className="h-3.5 w-3.5" />
                        </button>
                    )}
                    {onEdit && (
                        <button
                            onClick={() => onEdit(address.id)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                            title="Sửa"
                        >
                            <Pencil className="h-3.5 w-3.5" />
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(address.id)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
                            title="Xoá"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>
            </div>
            <p className="text-sm text-foreground">{address.street}</p>
            <p className="text-xs text-muted-foreground mt-1">
                {address.city}, {address.state} {address.zip}
            </p>
            <p className="text-xs text-muted-foreground">{address.country}</p>
        </div>
    );
}
