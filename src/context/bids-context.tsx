import { createContext, useContext, useState } from "react";

interface BidsContextType {
    isFetching: boolean;
    setIsFetching: (value: boolean) => void;
}

const BidsContext = createContext<BidsContextType | undefined>(undefined);

export const BidsProvider = ({ children }: { children: React.ReactNode }) => {
    const [isFetching, setIsFetching] = useState(false);

    return (
        <BidsContext.Provider value={{ isFetching, setIsFetching }}>
            {children}
        </BidsContext.Provider>
    );
};

export const useBidsContext = () => {
    const context = useContext(BidsContext);
    if (!context) {
        throw new Error("useBidsContext must be used within a BidsProvider");
    }
    return context;
};
