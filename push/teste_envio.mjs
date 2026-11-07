import http from "node:http"; import crypto from "node:crypto"; import fs from "node:fs";
import worker from "./worker_push.js";
const v = JSON.parse(fs.readFileSync(process.argv[2],"utf8"));
const ua = crypto.createECDH("prime256v1"); ua.generateKeys(); const auth = crypto.randomBytes(16);
const uaPub = ua.getPublicKey();
let recebido;
const srv = http.createServer((q,r)=>{ const ch=[]; q.on("data",c=>ch.push(c)); q.on("end",()=>{ recebido={h:q.headers,b:Buffer.concat(ch)}; r.statusCode=201; r.end(); }); });
await new Promise(r=>srv.listen(0,r)); const port = srv.address().port;
const env = { SEGREDO:v.segredo, VAPID_PUBLICA:v.publica, VAPID_PRIVADA:v.privada };
const mk = (h)=> new Request("http://x/", { method:"POST", headers:h, body:JSON.stringify({ subs:[{ endpoint:`http://127.0.0.1:${port}/abc`, keys:{ p256dh:uaPub.toString("base64url"), auth:auth.toString("base64url") } }], titulo:"Chamada de 07/11 feita por RONNY", corpo:"2 sem presença: JOAO (falta)" }) });
console.log("sem segredo:", (await worker.fetch(mk({}), env)).status);
const res = await (await worker.fetch(mk({ "X-Segredo":v.segredo }), env)).json(); console.log("resultado:", JSON.stringify(res.resultados.map(x=>x.status)));
// verificar VAPID
const [,jwt,k] = /vapid t=(.+), k=(.+)/.exec(recebido.h.authorization);
const [a,b,c] = jwt.split("."); const pubKey = crypto.createPublicKey({ key:{ kty:"EC", crv:"P-256", x:v.publica.length&&Buffer.from(v.publica,"base64url").subarray(1,33).toString("base64url"), y:Buffer.from(v.publica,"base64url").subarray(33,65).toString("base64url") }, format:"jwk" });
console.log("VAPID assinatura:", crypto.verify("sha256", Buffer.from(a+"."+b), { key:pubKey, dsaEncoding:"ieee-p1363" }, Buffer.from(c,"base64url")), "| k confere:", k===v.publica, "| claims:", Buffer.from(b,"base64url").toString());
// decifrar como o navegador faria
const body = recebido.b, salt = body.subarray(0,16), idlen = body[20], asPub = body.subarray(21,21+idlen), ct = body.subarray(21+idlen);
const secret = ua.computeSecret(asPub);
const ikm = Buffer.from(crypto.hkdfSync("sha256", secret, auth, Buffer.concat([Buffer.from("WebPush: info\0"), uaPub, asPub]), 32));
const cek = Buffer.from(crypto.hkdfSync("sha256", ikm, salt, "Content-Encoding: aes128gcm\0", 16));
const nonce = Buffer.from(crypto.hkdfSync("sha256", ikm, salt, "Content-Encoding: nonce\0", 12));
const d = crypto.createDecipheriv("aes-128-gcm", cek, nonce); d.setAuthTag(ct.subarray(ct.length-16));
const claro = Buffer.concat([d.update(ct.subarray(0,ct.length-16)), d.final()]);
console.log("decifrado:", claro.subarray(0,claro.length-1).toString());
srv.close();
