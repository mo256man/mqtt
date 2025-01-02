import random
from paho.mqtt import client as mqtt_client

broker = "broker.emqx.io"
port = 8883
topic = 'python/mqtt'
client_id = f'python-mqtt-{random.randint(0, 1000)}'
username = "mo256man"
password = "momo1024"

def connect_mqtt():
    def on_connect(client, userdata, flags, reason_code, properties):
        if reason_code == 0:
            print("Connected to MQTT Broker!")
        else:
            print("Failed to connect, return code %d\n", reason_code)
    # Set Connecting Client ID
    client = mqtt_client.Client(mqtt_client.CallbackAPIVersion.VERSION2)
    # Set CA certificate
    client.tls_set(ca_certs="./emqxsl-ca.crt")
    client.username_pw_set(username, password)
    client.on_connect = on_connect
    client.connect(broker, port)
    return client

def subscribe(client: mqtt_client):
    def on_message(client, userdata, msg):
        print(f"Received `{msg.payload.decode()}` from `{msg.topic}` topic")
    client.subscribe(topic)
    client.on_message = on_message

def run():
    client = connect_mqtt()
    subscribe(client)
    client.loop_forever()


if __name__ == '__main__':
    run()