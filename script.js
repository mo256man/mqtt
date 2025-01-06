const brokerUrl = "wss://broker.emqx.io:8084/mqtt";
const CLIENT_ID = "myClient-" + Math.floor(Math.random() * 999);
const topic = "myTopic";
let connectedClientsCount = 0;

const client = mqtt.connect(brokerUrl, {
    username: "******",
    password: "******",
    clientId: CLIENT_ID,
});

document.getElementById("clientID").innerText = CLIENT_ID;

client.on("connect", () => {
    console.log("Connected to EMQX broker (SSL)");
    
    client.subscribe(topic, (err) => {
        if (!err) {
            console.log(`Subscribed to topic: ${topic}`);
        } else {
            console.error("Failed to subscribe:", err);
        }
    });

    client.subscribe("$SYS/brokers/+/clients/connected", (err) => {
        if (!err) {
            console.log("Subscribed to total connected clients count");
        }
    });

    client.subscribe("$SYS/brokers/+/clients/+/connected", (err) => {
        if (!err) {
            console.log("Subscribed to client connection events");
        }
    });

    client.subscribe("$SYS/brokers/+/clients/+/disconnected", (err) => {
        if (!err) {
            console.log("Subscribed to client disconnection events");
        }
    });
});

client.on("message", (topic, message) => {
    if (topic.startsWith("$SYS")) {
        console.log(`$SYS message received: ${topic} - ${message.toString()}`);

        if (topic.includes("/clients/connected") && !topic.includes("/+")) {
            connectedClientsCount = parseInt(message.toString(), 10);
            console.log(`Initial connected clients: ${connectedClientsCount}`);
        } else if (topic.includes("connected")) {
            connectedClientsCount++;
        } else if (topic.includes("disconnected")) {
            connectedClientsCount--;
        }
        console.log(`Current connected clients: ${connectedClientsCount}`);
    } else {
        try {
            const parsedMessage = JSON.parse(message.toString());
            const clientId = parsedMessage.clientId;
            const str_datetime = parsedMessage.datetime;
            const content = parsedMessage.content;
            if (clientId === CLIENT_ID) {
                console.log("自分自身のメッセージを無視する");
            } else {
                writeLog("receive", str_datetime, content);
            }
        } catch (err) {
            console.error("Error parsing message:", message.toString());
        }
    }
});

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
    writeLog("send", str_datetime, content);
};

const writeLog = (transferMode, str_datetime, content) => {
    const color = transferMode == "send" ? "blue" : "red";
    const elm = document.createElement("span");
    elm.className = color
    elm.innerHTML = `${str_datetime} ${transferMode}: ${content}<br>`;
    document.getElementById("messages").appendChild(elm);
};

document.getElementById("publish").addEventListener("click", () => {
    publishMessage("hello world");
});
