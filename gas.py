import requests
import json
import random

def post_to_gas(value):
    # GASのWebアプリURL
    deploy_id = "AKfycbxMLS9whNhe8Nbx_jBIaN-fjf3DH-1qxzwddbb1UmxqyAhsMFe0iK2q-Wk9vz0rGjxNXQ"
    gas_url = f"https://script.google.com/macros/s/{deploy_id}/exec"

    # 送信するJSONデータ
    data = {
        "value": value,
    }

    # ヘッダー情報
    headers = {
        "Content-Type": "application/json"
    }

    # POSTリクエストの送信
    response = requests.post(gas_url, headers=headers, data=json.dumps(data))

    # レスポンスの内容を表示
    print("Status Code:", response.status_code)
    print("Response Text:", response.text)

# 実行
value = random.randint(10, 100)
post_to_gas(value)
