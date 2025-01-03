const brokerUrl = "wss://broker.emqx.io:8084/mqtt";
const CLIENT_ID = "github-client-" + Math.floor(Math.random() * 999);
const topic = "python/mqtt";

const client = mqtt.connect(brokerUrl, {
    username: "mo256man",
    password: "momo1024",
    clientId: CLIENT_ID,
});


// 接続イベント
client.on("connect", () => {
    console.log("Connected to EMQX broker (SSL)");
    client.subscribe(topic, (err) => {
    if (!err) {
        console.log(`Subscribed to topic: ${topic}`);
    } else {
        console.error("Failed to subscribe:", err);
    }
    });
});

// メッセージ送信
const publishMessage = (content) => {
    const message = JSON.stringify({
        clientId: CLIENT_ID,
        content: content,
    });
    client.publish(topic, message, (err) => {
        if (!err) {
            console.log("Message published:", content);
        }
    });
}


// メッセージ受信
client.on("message", (topic, message) => {
    try {
        const parsedMessage = JSON.parse(message.toString());
        if (parsedMessage.clientId === CLIENT_ID) {
            console.log("自分自身のメッセージを無視する");
        } else {
            const content = parsedMessage.content;
            const elm = document.createElement("p");
            elm.textContent = `Received message: ${content} (on topic: ${topic})`;
            document.getElementById("messages").appendChild(elm);
        }
    } catch (err) {
        console.error("Error parsing message:", message.toString());
    }
});


// メッセージの送信（Publish）
document.getElementById("publish").addEventListener("click", () => {
    publishMessage("hello world");
});
