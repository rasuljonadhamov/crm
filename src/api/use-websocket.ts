import { useEffect } from "react";

const ws = { current: null as WebSocket | null };
const reconnectTimeout = { current: null as NodeJS.Timeout | null };
const heartbeat = { current: null as NodeJS.Timeout | null };
const pongTimeout = { current: null as NodeJS.Timeout | null };

export function useWebSocket(refreshBids: () => void = () => {}, refreshOrders: () => void = () => {}) {
    const connect = () => {
        if (ws.current) return;

        const token = localStorage.getItem("authToken");
        const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL;

        ws.current = new WebSocket(`${WS_BASE_URL}?token=${token}`);

        ws.current.onopen = () => {
            // console.log("✅ WebSocket открыт");
            startHeartbeat();
        };



        ws.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                // console.log("📩 WebSocket message received:", data);
                if (data.type === "bid_update") {
                    // console.log("🔄 Refreshing bids...");
                    refreshBids();
                }
                if (data.type === "order_update") refreshOrders();
                if (data.type === "ping" && pongTimeout.current) clearTimeout(pongTimeout.current);
            } catch (error) {
                // console.error("❌ Ошибка обработки сообщения WebSocket:", error);
            }
        };
        

        ws.current.onerror = (error) => {
            // console.error("⚠️ WebSocket ошибка:", error);
        };

        ws.current.onclose = () => {
            // console.warn("🔴 WebSocket закрыт, перезапускаем...");
            ws.current = null;
            reconnectTimeout.current = setTimeout(connect, 5000);
        };
    };

    const startHeartbeat = () => {
        stopHeartbeat();
        heartbeat.current = setInterval(() => {
            if (ws.current?.readyState === WebSocket.OPEN) {
                ws.current.send(JSON.stringify({ type: "pong" }));
                if (pongTimeout.current) clearTimeout(pongTimeout.current);
                pongTimeout.current = setTimeout(() => {
                    console.warn("⚠️ Нет пинга, перезапускаем WebSocket...");
                    ws.current?.close();
                }, 30500);
            }
        }, 28000);
    };

    const stopHeartbeat = () => {
        if (heartbeat.current) clearInterval(heartbeat.current);
        if (pongTimeout.current) clearTimeout(pongTimeout.current);
    };

    useEffect(() => {
        // console.log("🟢 useWebSocket запущен");
        connect();

        return () => {
            // console.log("🔴 useWebSocket размонтирован, но WebSocket остаётся активным");
        };
    }, []);
}
