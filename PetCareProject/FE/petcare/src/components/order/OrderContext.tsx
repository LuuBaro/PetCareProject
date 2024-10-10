import React, { createContext, useState, useEffect } from 'react';

export interface Order {
    id: number;
    status: string;
    shopName: string;
    items: {
        name: string;
        variant?: string;
        quantity: number;
        price: number;
        imageUrl?: string;
        isGift?: boolean;
    }[];
    total: number;
}

interface OrderContextType {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    orders: Order[];
    setOrders: (orders: Order[]) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);


export const OrderProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [activeTab, setActiveTab] = useState('Tất cả');
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const response = await fetch('./src/components/order/orders.json');
            const data = await response.json();
            setOrders(data);
        };
        fetchOrders();
    }, []);

    return (
        <OrderContext.Provider value={{ activeTab, setActiveTab, orders, setOrders }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrderContext = () => {
    const context = React.useContext(OrderContext);
    if (!context) {
        throw new Error('useOrderContext must be used within an OrderProvider');
    }
    return context;
};