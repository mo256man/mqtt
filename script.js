const brokerUrl = "wss://broker.emqx.io:8084/mqtt";
const CLIENT_ID = "myClient-" + Math.floor(Math.random() * 999);
const topic = "myTopic";

const client = mqtt.connect(brokerUrl, {
    username: "mo256man",
    password: "momo1024",
    clientId: CLIENT_ID,
});

document.getElementById("clientID").innerText = CLIENT_ID;

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
    const now = cdate();
    const str_datetime = now.format("YYYY/MM/DD HH:mm:ss");
    const message = JSON.stringify({
        clientId: CLIENT_ID,
        datetime: str_datetime,
        content: content,
    });
    client.publish(topic, message, (err) => {
        if (!err) {
            console.log("Message published:", content);
        }
    });
    writeLog("blue", str_datetime, content);
}


// メッセージ受信
client.on("message", (topic, message) => {
    try {
        const parsedMessage = JSON.parse(message.toString());
        const clientId = parsedMessage.clientId;
        const str_datetime = parsedMessage.datetime;
        const content = parsedMessage.content;
        if (clientId === CLIENT_ID) {
            console.log("自分自身のメッセージを無視する");
        } else {
            writeLog("red", str_datetime, content);
        }
    } catch (err) {
        console.error("Error parsing message:", message.toString());
    }
});

// ログ記載
const writeLog = (color, str_datetime, content) => {
    const elm = document.createElement("span");
    elm.className = color
    elm.innerHTML = `${str_datetime} publish: ${content}`;
    document.getElementById("messages").appendChild(elm);
}

// メッセージの送信（Publish）
document.getElementById("publish").addEventListener("click", () => {
    publishMessage("hello world");
});
