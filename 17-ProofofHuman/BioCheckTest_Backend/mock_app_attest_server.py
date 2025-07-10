# mock_app_attest_server.py
from flask import Flask, request, jsonify, abort
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import ec
import base64, os, struct, time

app = Flask(__name__)
_db = {}    # keyID -> publicKey bytes

# ---------- 工具 ----------

def sha256(data: bytes) -> str:
    digest = hashes.Hash(hashes.SHA256())
    digest.update(data)
    return digest.finalize().hex()

def load_pubkey(x963_b64: str):
    raw = base64.b64decode(x963_b64)
    return ec.EllipticCurvePublicKey.from_encoded_point(ec.SECP256R1(), raw)

# ---------- 注册 ----------

@app.route("/attest", methods=["POST"])
def attest():
    obj = request.get_json(force=True)
    public_key_b64 = obj["publicKey"]
    key_id = obj["keyID"]
    timestamp = obj["timestamp"]
    signature = base64.b64decode(obj["signature"])

    # 1. 验证 keyID = SHA256(pubKey)
    pub_raw = base64.b64decode(public_key_b64)
    if sha256(pub_raw) != key_id:
        abort(400, "keyID mismatch")

    # 2. 复原 payload = appID || keyID || timestamp(big endian u64)
    app_id = obj["appID"].encode()
    payload = app_id + key_id.encode() + struct.pack(">Q", timestamp)

    # 3. 验签
    pub = load_pubkey(public_key_b64)
    try:
        pub.verify(signature, payload, ec.ECDSA(hashes.SHA256()))
    except Exception:
        abort(400, "attestation signature invalid")

    # 4. 保存公钥 → 内存
    _db[key_id] = pub
    # 5. 返回随机 challenge
    challenge = os.urandom(32)
    return jsonify({"keyID": key_id, "challenge": base64.b64encode(challenge).decode()})

# ---------- 断言 ----------

@app.route("/assert", methods=["POST"])
def assert_():
    obj = request.get_json(force=True)
    key_id = obj["keyID"]
    challenge = base64.b64decode(obj["challenge"])
    signature = base64.b64decode(obj["signature"])

    pub = _db.get(key_id)
    if pub is None:
        abort(400, "unknown keyID")

    try:
        pub.verify(signature, challenge, ec.ECDSA(hashes.SHA256()))
    except Exception:
        abort(400, "assertion signature invalid")

    return jsonify({"result": "ok"})

@app.route("/status/<key_id>", methods=["GET"])
def status(key_id):
    if key_id in _db:
        challenge = os.urandom(32)
        return jsonify({
            "registered": True,
            "challenge": base64.b64encode(challenge).decode()
        })
    return jsonify({"registered": False}), 404

# ---------- 入口 ----------
if __name__ == "__main__":
    print("Mock App Attest server running at http://127.0.0.1:5000")
    app.run(port=5000, debug=False)
