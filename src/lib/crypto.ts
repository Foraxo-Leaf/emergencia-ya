const KEY_STORAGE = "secure-key";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function bufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getKey(): Promise<CryptoKey> {
  const stored = typeof localStorage !== "undefined" ? localStorage.getItem(KEY_STORAGE) : null;
  if (stored) {
    const raw = base64ToBuffer(stored);
    return crypto.subtle.importKey("raw", raw, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
  }

  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  const exported = await crypto.subtle.exportKey("raw", key);
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(KEY_STORAGE, bufferToBase64(exported));
  }
  return key;
}

export async function encrypt(data: string): Promise<Uint8Array> {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = encoder.encode(data);
  const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
  const result = new Uint8Array(iv.length + cipher.byteLength);
  result.set(iv, 0);
  result.set(new Uint8Array(cipher), iv.length);
  return result;
}

export async function decrypt(payload: Uint8Array): Promise<string> {
  const key = await getKey();
  const iv = payload.slice(0, 12);
  const data = payload.slice(12);
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
  return decoder.decode(plain);
}
