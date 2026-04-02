const statusConfig: Record<string, { label: string; className: string }> = {
    PENDING: {
        label: "Chờ xử lý",
        className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    },
    PROCESSING: {
        label: "Đang xử lý",
        className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    },
    SHIPPED: {
        label: "Đang giao",
        className: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    },
    DELIVERED: {
        label: "Đã giao",
        className: "bg-green-500/10 text-green-600 border-green-500/20",
    },
    CANCELLED: {
        label: "Đã huỷ",
        className: "bg-red-500/10 text-red-600 border-red-500/20",
    },
};

interface StatusBadgeProps {
    status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const config = statusConfig[status] || {
        label: status,
        className: "bg-secondary text-muted-foreground border-border",
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.className}`}
        >
            {config.label}
        </span>
    );
}
