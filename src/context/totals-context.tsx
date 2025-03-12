import { createContext, useContext, useEffect, useState } from "react";

interface Totals {
    fullPrice: number;
    fullPriceNds: number;
    commission: number;
}

const TotalsContext = createContext<Totals | undefined>(undefined);

export const TotalsProvider = ({ data, children }: { data: any[] | null; children: React.ReactNode }) => {
    const [totals, setTotals] = useState<Totals>({ fullPrice: 0, fullPriceNds: 0, commission: 0 });

    useEffect(() => {
        if (!data) return;

        const newTotals = (data ?? []).reduce(
            (acc, item) => {
                const parseValue = (value: any) =>
                    typeof value === "string" ? Number(value.replace(/\D/g, "")) : Number(value ?? 0);

                acc.fullPrice += parseValue(item.fullPrice);
                acc.fullPriceNds += parseValue(item.fullPriceNds);
                acc.commission += parseValue(item.comission ?? item.commission);
                return acc;
            },
            { fullPrice: 0, fullPriceNds: 0, commission: 0 }
        );

        setTotals(newTotals);
    }, [data]);

    return <TotalsContext.Provider value={totals}>{children}</TotalsContext.Provider>;
};

export const useTotals = () => {
    const context = useContext(TotalsContext);
    if (!context) {
        throw new Error("useTotals must be used within a TotalsProvider");
    }
    return context;
};
