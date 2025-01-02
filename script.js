// MQTTブローカーのURL
const brokerUrl = "ws://broker.emqx.io:8083/mqtt"; // WebSocketを使用

// トピック設定
const topic = "python/mqtt";

// クライアントの作成
const client = mqtt.connect(brokerUrl);

// 接続イベント
client.on("connect", () => {
    console.log("Connected to MQTT broker");
    // トピックをサブスクライブ
        client.subscribe(topic, (err) => {
        if (!err) {
            console.log(`Subscribed to topic: ${topic}`);
        } else {
            console.error("Failed to subscribe:", err);
        }
    });
});

// メッセージ受信イベント
client.on("message", (topic, message) => {
    const msg = document.createElement("p");
    msg.textContent = `Received message: ${message.toString()} (on topic: ${topic})`;
    document.getElementById("messages").appendChild(msg);
});

    // メッセージの送信（Publish）
document.getElementById("publish").addEventListener("click", () => {
    const payload = "Hello from JavaScript!";
    client.publish(topic, payload, {}, (err) => {
        if (!err) {
            console.log("Message published:", payload);
        } else {
            console.error("Failed to publish:", err);
        }
    });
});
